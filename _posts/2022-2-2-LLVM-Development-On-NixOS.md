---
layout: post
title: LLVM Development on NixOS
permalink: /llvm-nixos
category: c++, nixos, llvm
cat: cs
---

I've found NixOS to provide a wonderful development environment after learning a bit of the Nix language - but building and hacking on LLVM on NixOS gave me some trouble.
Hopefully reading this post will save you the trouble!

{% include disclaimer.html %}

# Build Environment

### ***If you'd just like to see my config, go to the end of the post where I've pasted the whole thing***

I'm no Nix language expert by any stretch of the imagination, nor am I an expert in dynamic linking or managing an operating system.

I started with the `nix-shell` example provided in [the nix documentation here](https://nixos.wiki/wiki/LLVM) and made additions as I found the need.

I had to pass the library directories of both GCC and GLIBC using both the `-B` and `-L` flags, because some required object files (like `crt1.o`) must be found at link time, and clang/gcc don't search `LD_LIBRARY_PATH` for these files.
`-B` will tell the compilers to look in the provided paths for these files.

```nix
  libcFlags = [
    "-L ${stdenv.cc.libc}/lib"
    "-B ${stdenv.cc.libc}/lib"
  ];

  # The string version of just the gcc flags for NIX_LDFLAGS
  nixLd = lib.concatStringsSep " " [
    "-L ${gccForLibs}/lib"
    "-L ${gccForLibs}/lib/gcc/${targetPlatform.config}/${gccForLibs.version}"
  ];

  gccFlags = [
    "-B ${gccForLibs}/lib/gcc/${targetPlatform.config}/${gccForLibs.version}"
    "${nixLd}"
  ];
```

The official documentation uses `LLVM_ENABLE_PROJECTS` to enable runtimes, which is deprecated, so I first removed that in favor of a manual two-stage build for libc++ and libc++abi.

```nix
  # For building clang itself, we're just using the compiler wrapper and we
  # don't need to inject any flags of our own.
  cmakeFlags = lib.concatStringsSep " " [
    "-DGCC_INSTALL_PREFIX=${gcc}"
    "-DC_INCLUDE_DIRS=${stdenv.cc.libc.dev}/include"
    "-DCMAKE_BUILD_TYPE=Release"
    "-DCMAKE_INSTALL_PREFIX=${installdir}"
    "-DLLVM_INSTALL_TOOLCHAIN_ONLY=ON"
    "-DLLVM_ENABLE_PROJECTS=clang"
    "-DLLVM_TARGETS_TO_BUILD=X86"
  ];
  cmakeCmd = lib.concatStringsSep " " [
    "export CC=${stdenv.cc}/bin/gcc; export CXX=${stdenv.cc}/bin/g++;"
    "${cmakeCurses}/bin/cmake -B ${builddir} -S llvm"
    "${cmakeFlags}"
  ];
```

To build clang itself, I activate the nix shell and build only clang:
```console
$ cd llvm-project
$ nix-shell
$ eval "$cmakeCmd"
$ make -C build -j `nproc`
```

I didn't use `LLVM_ENABLE_RUNTIMES` since I had trouble passing the CMake arguments to the runtime builds through the top-level build.
The purpose of `LLVM_ENABLE_RUNTIMES` is to build an LLVM project using the just-built clang/LLVM, however compile and link arguments are not passed to the runtime builds using the default `CMAKE_CXX_FLAGS` as I expected (or at least I was unable to get this to work).

Instead, I configured a seperate set of cmake arguments for the runtimes, and manually passed the just-built clang compiler as `CXX` to the runtime builds like so:

```nix
  cmakeRuntimeFlags = lib.concatStringsSep " " [
    "-DCMAKE_CXX_FLAGS=\"${flags}\""
    "-DLIBCXX_TEST_COMPILER_FLAGS=\"${flags}\""
    "-DLIBCXX_TEST_LINKER_FLAGS=\"${flags}\""
    "-DLLVM_ENABLE_RUNTIMES='libcxx;libcxxabi'"
  ];
  cmakeRtCmd = lib.concatStringsSep " " [
    "export CC=${builddir}/bin/clang; export CXX=${builddir}/bin/clang++;"
    "${cmakeCurses}/bin/cmake -B ${builddir}-rt -S runtimes"
    "${cmakeRuntimeFlags}"
  ];
```

```console
$ cd llvm-project
$ eval "$cmakeRtCmd"
$ make -C build-rt -j `nproc`
```

# Testing, Linking, Running

A huge issue with testing arose due to the way NixOS handles it's dynamic loader.

When you use software in NixOS, it's usually found somewhere in the `/run/current-system/sw/` prefix, while most software expects to be run from `/usr` or `/usr/local`, or it expects to be able to find key libraries under those prefixes (eg `libc.so`).

Instead, each software component has it's own prefix under `/nix/store`, for example:

```console
$ which perl
/run/current-system/sw/bin/perl
$ file $(which perl)
/run/current-system/sw/bin/perl: symbolic link to 
    /nix/store/kpzx6f97583zbjyyd7b17rbv057l4vn2-perl-5.34.0/bin/perl
```

Each compiler must then know the correct locations of the standard libraries and software components, such as the dynamic loader, the standard C library, etc.
To acomplish this, Nix-provided compilers ship with _wrappers_ that inject the required flags.

If I inspect my GNU compilers, we see that I'm not using `g++` directly:
```console
$ which g++
/nix/store/gkzmfpb04ddb7phzj8g9sl6saxzprssg-gcc-wrapper-10.3.0/bin/g++
$ file $(which g++)
/nix/store/gkzmfpb04ddb7phzj8g9sl6saxzprssg-gcc-wrapper-10.3.0/bin/g++:
  a /nix/store/v1d8l3zqnia3hccqd0701szhlx22g54z-bash-5.1-p8/bin/bash
  script, ASCII text executable
```

The actual compiler is found in a seperate prefix:
```console
$ grep 'g++' $(which g++) | head -n1
[[ "/nix/store/mrqrvina0lfgrvdzfyri7sw9vxy6pyms-gcc-10.3.0/bin/g++" = *++ ]] && isCxx=1 || isCxx=0
```

On my current system, the true compiler is found under `/nix/store/mrqrvina0lfgrvdzfyri7sw9vxy6pyms-gcc-10.3.0`.

This becomes an issue with testing LLVM because the tests run executables built with the just-built `clang++`, not with the wrapped compiler!
That's why we have to inject so many flags in our `shell.nix`.

When I initially ran `make check-cxx` to run the tests for libc++, I found errors like this:
```console
FileNotFoundError: [Errno 2]
    No such file or directory:
    '/home/asher/workspace/llvm-project/brt/libcxx/test/std/containers/sequences/deque/deque.modifiers/Output/erase_iter_iter.pass.cpp.dir/t.tmp.exe'
```

It _looks_ like the tests rely on an executable that's not there.
However, if I check that location:
```console
$ file /home/asher/workspace/llvm-project/brt/libcxx/test/std/containers/sequences/deque/deque.modifiers/Output/erase_iter_iter.pass.cpp.dir/t.tmp.exe
/home/asher/workspace/llvm-project/brt/libcxx/test/std/containers/sequences/deque/deque.modifiers/Output/erase_iter_iter.pass.cpp.dir/t.tmp.exe:
ELF 64-bit LSB executable, x86-64, version 1 (SYSV), dynamically linked,
interpreter /lib64/ld-linux-x86-64.so.2, for GNU/Linux 2.6.32, with debug_info, not stripped
```

the executable _was_ built.

If I try to run it directly, it still appears to not exist:
```console
$ /home/asher/workspace/llvm-project/brt/libcxx/test/std/containers/sequences/deque/deque.modifiers/Output/erase_iter_iter.pass.cpp.dir/t.tmp.exe
bash: /home/asher/workspace/llvm-project/brt/libcxx/test/std/containers/sequences/deque/deque.modifiers/Output/erase_iter_iter.pass.cpp.dir/t.tmp.exe:
  No such file or directory
```

***What's going on here?***

## Dynamic Linker

If we return to the output of running `file` on our mysterious executable, we see it thinks its dynamic linker is `/lib64/ld-linux-x86-64.so.2`:
```
ELF 64-bit LSB executable, x86-64, version 1 (SYSV), dynamically linked,
interpreter /lib64/ld-linux-x86-64.so.2, for GNU/Linux 2.6.32, with debug_info, not stripped
```

However, if we look for that file, it doesn't exist:
```console
$ file /lib64/ld-linux-x86-64.so.2
/lib64/ld-linux-x86-64.so.2:
  cannot open `/lib64/ld-linux-x86-64.so.2'
  (No such file or directory)
```

The `patchelf` utility from the NixOS developers will tell us where the dynamic linker is for a given executable:
```console
$ patchelf --print-interpreter /path/to/llvm-test.exe
/lib64/ld-linux-x86-64.so.2
```

Again, our executable wasn't built by a Nix compiler wrapper, it was built by the clang we just compiled ourselves.
What dynamic linker do other programs on this system use?
```console
$ patchelf --print-interpreter $(which bash)
/nix/store/vjq3q7dq8vmc13c3py97v27qwizvq7fd-glibc-2.33-59/lib/ld-linux-x86-64.so.2
```

That's right, everything on NixOS is built in its own prefix.
If we had used a compiler wrapper, the flags to tell the executable which linker to use would have been injected.

I found that the linker flag `--dynamic-linker` will set the dynamic linker path for a given executable, and it's used here in GCC's compiler wrapper:
```console
$ grep 'dynamic-link' $(which g++)
        extraBefore+=("-Wl,-dynamic-linker=$NIX_DYNAMIC_LINKER_x86_64_unknown_linux_gnu")
```

I can't quite figure out how `NIX_DYNAMIC_LINKER_x86_64_unknown_linux_gnu` is set other than that it's set by the script in `$gcc_wrapper_prefix/nix-support/add-flags.sh`, but I did find the file `dynamic-linker` under that same prefix:
```console
$ file $(which g++)
/run/current-system/sw/bin/g++: symbolic link to
  /nix/store/gkzmfpb04ddb7phzj8g9sl6saxzprssg-gcc-wrapper-10.3.0/bin/g++
$ ls /nix/store/gkzmfpb04ddb7phzj8g9sl6saxzprssg-gcc-wrapper-10.3.0
bin  nix-support
$ ls /nix/store/gkzmfpb04ddb7phzj8g9sl6saxzprssg-gcc-wrapper-10.3.0/nix-support
add-flags.sh      cc-ldflags      libc-crt1-cflags  libcxx-ldflags  orig-libc-dev            utils.bash
add-hardening.sh  dynamic-linker  libc-ldflags      orig-cc         propagated-build-inputs
cc-cflags         libc-cflags     libcxx-cxxflags   orig-libc       setup-hook
```

So the file `$gcc_wrapper_prefix/nix-support/dynamic-linker` contains the path to the dynamic linker the compiler is using:
```console
$ cat /nix/store/gkzmfpb04ddb7phzj8g9sl6saxzprssg-gcc-wrapper-10.3.0/nix-support/dynamic-linker
/nix/store/vjq3q7dq8vmc13c3py97v27qwizvq7fd-glibc-2.33-59/lib/ld-linux-x86-64.so.2
```

I'll then use this in my `shell.nix` to get the path to the dynamic linker, and then pass that to clang for building the LLVM runtimes so the correct dynamic linker is used for executables built by clang:
```nix
  dynLinker = lib.fileContents "${stdenv.cc}/nix-support/dynamic-linker";
  flags = lib.concatStringsSep " " ([
    "-Wno-unused-command-line-argument"
    "-Wl,--dynamic-linker=${dynLinker}"
                          ↑↑↑↑↑↑↑↑↑↑↑↑↑
  ] ++ gccFlags ++ libcFlags);
```

I've also added `-Wno-unused-command-line-argument` to the compile flags so we're not spammed with warnings every time a link directory or file directory I pass to the compiler invokation is ignored.

We can now finally run our tests.
Sometimes required binaries are still not found by lit, so I use the `cxx-test-depends` target to build test dependencies and then I run lit manually:
```console
$ make cxx-test-depends -C build-rt
$ ./build/bin/llvm-lit ./libcxx
```

# Full Config

I was able to find lots of information about nix from playing around in the nix repl and using tab completion, like this:

```console
$ nix repl
Welcome to Nix 2.4. Type :? for help.

nix-repl> pkgs = import <nixpkgs> {}

nix-repl> pkgs.lib.concatStringsSep " " ["one" "two" "three"]
"one two three"

nix-repl> pkgs.stdenv.cc.<TAB><TAB>
pkgs.stdenv.cc.__ignoreNulls                pkgs.stdenv.cc.libc_dev
pkgs.stdenv.cc.all                          pkgs.stdenv.cc.libc_lib
pkgs.stdenv.cc.args                         pkgs.stdenv.cc.man
pkgs.stdenv.cc.bintools                     pkgs.stdenv.cc.meta
...

nix-repl> "${pkgs.stdenv.cc.cc}"
"/nix/store/mrqrvina0lfgrvdzfyri7sw9vxy6pyms-gcc-10.3.0"

nix-repl> pkgs.lib.fileContents "${pkgs.stdenv.cc}/nix-support/dynamic-linker"
"/nix/store/vjq3q7dq8vmc13c3py97v27qwizvq7fd-glibc-2.33-59/lib/ld-linux-x86-64.so.2"
```

Here's the full config:

```nix
with import <nixpkgs> {};

let
  builddir = "build";
  installdir = "install";
  gccForLibs = stdenv.cc.cc;
  dynLinker = lib.fileContents "${stdenv.cc}/nix-support/dynamic-linker";
  libcFlags = [
    "-L ${stdenv.cc.libc}/lib"
    "-B ${stdenv.cc.libc}/lib"
    ];

  # The string version of just the gcc flags for NIX_LDFLAGS
  nixLd = lib.concatStringsSep " " [
    "-L ${gccForLibs}/lib"
    "-L ${gccForLibs}/lib/gcc/${targetPlatform.config}/${gccForLibs.version}"
  ];

  gccFlags = [
    "-B ${gccForLibs}/lib/gcc/${targetPlatform.config}/${gccForLibs.version}"
    "${nixLd}"
    ];

  flags = lib.concatStringsSep " " ([
      "-Wno-unused-command-line-argument"
      "-Wl,--dynamic-linker=${dynLinker}"
    ] ++ gccFlags ++ libcFlags);

  # For building clang itself, we're just using the compiler wrapper and we
  # don't need to inject any flags of our own.
  cmakeFlags = lib.concatStringsSep " " [
    "-DGCC_INSTALL_PREFIX=${gcc}"
    "-DC_INCLUDE_DIRS=${stdenv.cc.libc.dev}/include"
    "-DCMAKE_BUILD_TYPE=Release"
    "-DCMAKE_INSTALL_PREFIX=${installdir}"
    "-DLLVM_INSTALL_TOOLCHAIN_ONLY=ON"
    "-DLLVM_ENABLE_PROJECTS=clang"
    "-DLLVM_TARGETS_TO_BUILD=X86"
  ];

  # For configuring a build of LLVM runtimes however, we do need to inject the
  # extra flags.
  cmakeRuntimeFlags = lib.concatStringsSep " " [
    "-DCMAKE_CXX_FLAGS=\"${flags}\""
    "-DLIBCXX_TEST_COMPILER_FLAGS=\"${flags}\""
    "-DLIBCXX_TEST_LINKER_FLAGS=\"${flags}\""
    "-DLLVM_ENABLE_RUNTIMES='libcxx;libcxxabi'"
  ];

  cmakeCmd = lib.concatStringsSep " " [
    "export CC=${stdenv.cc}/bin/gcc; export CXX=${stdenv.cc}/bin/g++;"
    "${cmakeCurses}/bin/cmake -B ${builddir} -S llvm"
    "${cmakeFlags}"
  ];

  cmakeRtCmd = lib.concatStringsSep " " [
    "export CC=${builddir}/bin/clang; export CXX=${builddir}/bin/clang++;"
    "${cmakeCurses}/bin/cmake -B ${builddir}-rt -S runtimes"
    "${cmakeRuntimeFlags}"
  ];

in stdenv.mkDerivation {

  name = "llvm-dev-env";

  buildInputs = [
    bashInteractive
    cmakeCurses
    llvmPackages_latest.llvm
  ];

  # where to find libgcc
  NIX_LDFLAGS = "${nixLd}";

  # teach clang about C startup file locations
  CFLAGS = "${flags}";
  CXXFLAGS = "${flags}";

  cmakeRuntimeFlags="${cmakeRuntimeFlags}";
  cmakeFlags="${cmakeFlags}";

  cmake="${cmakeCmd}";
  cmakeRt="${cmakeRtCmd}";
}
```

{% include disclaimer.html %}
