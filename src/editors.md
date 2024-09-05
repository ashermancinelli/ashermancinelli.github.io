# Editors and Tools

## Editor

My editing workflow starts with `ssh`ing into a box and reattaching to a `tmux` session:

```bash
ssh myhost
tmux attach
```

I have an ssh alias set up to forward certain ports as well:
```bash
$ cat ~/.ssh/config
Host myhost
  User ashermancinelli
  HostName myhost.domain.com
  LocalForward 6666 localhost:6666
  LocalForward 6667 localhost:6667
  LocalForward 6668 localhost:6668
  LocalForward 6669 localhost:6669
```

From inside the tmux session, I usually have several sessions each with a few shell windows and a `neovim` server running:

```bash
nvim --headless --listen localhost:6666
```

Then I can attach my editor[^neovide] to the remote editing session from my local terminal:

```bash
neovide --no-multigrid --fork --server localhost:6666
```


## Tools

I use Spack[^spack] for nearly everything.

I have a set of tools I need on every machine, which I install with Spack.
At the time of writing, this is the list:

- `ripgrep`
- `the-silver-searcher`
- `bat`
- `fzf`
- `fd`
- `rlwrap`
- `neovim@master`
- `lua`
- `vim`
- `perl`
- `python`
- `py-pip`

I install all of these like so:

```bash
spack \
  --config concretizer:targets:granularity:generic \
  install -j `nproc` \
  ripgrep the-silver-searcher bat fzf fd rlwrap neovim@master lua vim perl python py-pip \
  --fresh
```

Setting the target granularity to `generic` means I can _usually_ install once for each architecture in the cluster I'm working on, however sometimes OS incompatibilities mean I need to reinstall a few times.

From a script, I load all the default packages I need by just choosing the first one that matches my current generic architecture.
```bash
arch=`spack arch --platform`-`spack arch --operating-system`-`spack arch --generic-target`
for pkg in ${packages[@]}; do eval `spack load --sh --first $pkg arch=$garch`; done
```

The better way to do this would be to use environments[^spack_env], but installing them as individual packages makes it easier to reuse all my scripts for different architectures and operating systems rather than creating environments for each.
I can just update my list of default packages and reinstall as-needed without activating an environment, reconcretizing and reinstalling every time.

[^neovide]: [NeoVide, neovim gui client](https://github.com/neovide/neovide)
[^spack]: [Spack | A flexible package manager supporting multiple versions, configurations, platforms, and compilers.](https://spack.io/)
[^spack_env]: [https://spack.readthedocs.io/en/latest/environments.html](https://spack.readthedocs.io/en/latest/environments.html)
