<!--
layout: post
title: Clang Tools for Checking Domain-Specific Errors
permalink: /clang-lambda
cat: cs
-->

Compilers are extremely proficient at catching (and even suggesting fixes for) errors in your code.
What about cases that are not formally errors, but should not exist in your codebase?
This post explores using Clang tools to address this case.


## Example Use Case

When using portability libraries such as [RAJA](https://github.com/LLNL/RAJA/blob/main/docs/sphinx/user_guide/index.rst) and
[Kokkos](https://github.com/kokkos/kokkos), the capture clauses of lambda statements are extremely important.
When developing the open source optimization engine [HiOp](https://github.com/LLNL/hiop) to use the portability library RAJA
in its linear algebra library,
we ran into an issue where a RAJA `forall` statement would implicitly capture the `this` pointer in an instance method
which would cause memory access errors when running on a GPU device.

For example, let's say we have the following Vector class:

```cpp
#include <RAJA/RAJA.hpp>

struct Vector {
  using namespace RAJA;
  
  Vector(std::size_t sz, int* data/*=pointer to data on device*/)
    : sz(sz), data(data) {}
    
  void times_constant(int factor) {
  
    forall<cuda_exec<128>>(RangeSegment(0, sz),
      [=] (Index_type i) {
      
        // Here, `data` is captured implicitly via `this` pointer
        // even though `this` does not reside on the GPU
        data[i] *= factor;
      });
      
  }
private:
  std::size_t sz;
  int* data;
};
```

As described in the comments above, the data lives on the device, but is accessed via the `this` pointer which does not.
The solution to this memory access error is to create a local copy of the pointer outside the scope of the RAJA lambda:

```cpp
  void times_constant(int factor) {
    auto* local_data = this->data;
    forall<cuda_exec<128>>(RangeSegment(0, sz),
      [=] (Index_type i) {
        // Here, `data` is no longer captured implicitly via `this` pointer
        local_data[i] *= factor;
      });
  }
```

Of course, this is not an error that will be captured by nvcc, hipcc or another host compiler (that I know of).
At first we just examined each kernel in our codebase to ensure we did not use the `this` pointer implicitly.
Without too much effort however, we were able to develop a small tool to search our codebase for this exact case.

## Clang Tools

The first step in creating this tool was to set up a CMake project to link against LLVM libraries.
The directory structure looked like this:

```

lambda-checker
├── CMakeLists.txt
└── src
    ├── CMakeLists.txt
    ├── driver.cpp
    └── actions.hpp

```

Quite simple, no?
[The Clang documentation for frontend actions](https://clang.llvm.org/docs/RAVFrontendAction.html) walks through a similar task.

`src/driver.cpp` contains all of the code to instantiate an AST Action with a clang compiler instance
(and any options you would like to give your driver), while `src/actions.hpp` contains the actual code to
traverse the AST.

### CMake

In the top-level CMakeLists.txt and after the usual CMake project preamble, we include relevant clang libraries:

```cmake
# top-level CMakeLists.txt

find_package(Clang REQUIRED)

set(CMAKE_MODULE_PATH
  ${CMAKE_MODULE_PATH}
  "${LLVM_CMAKE_DIR}"
  )

include(AddLLVM)

include_directories(${LLVM_INCLUDE_DIRS})
include_directories(${CLANG_INCLUDE_DIRS})
add_definitions(${LLVM_DEFINITIONS})
add_definitions(${CLANG_DEFINITIONS})
```

Then, we added our plugin as a target:

```cmake
# top-level CMakeLists.txt
add_executable(LambdaChecker src/driver.cpp)
target_link_libraries(LambdaChecker
  PRIVATE
  clangAST
  clangBasic
  clangFrontend
  clangSerialization
  clangTooling
  clangIndex
  clangRewrite
  clangTooling
  )
```

### Actions

Before we start with `src/actions.hpp`, let us first discuss strategy.
Finding a potentially dangerous lambda capture requires two predicates for each lambda function found in the AST:

1. Does the lambda capture `this`?
2. Does the lambda dereference `this` to access a pointer or array-like member?

I broke each of these steps into its own frontend action.
The first simple searches the AST for a lambda function and checks if it captures `this`:

#### Find Lambda that Captures `this`

```cpp
// src/actions.hpp
class FindLambdaCaptureThis
  : public RecursiveASTVisitor<FindLambdaCaptureThis> {
public:
  explicit FindLambdaCaptureThis(ASTContext *Context)
    : Context(Context), MemberVisitor(Context) {}

  bool VisitLambdaExpr(LambdaExpr *Expr) {
    bool FoundThis = false;
    for (auto it = Expr->capture_begin(); it != Expr->capture_end(); it++) {
      if (it->capturesThis()) {
        FoundThis = true;
        break;
      }
    }

    /* If `this` is not captured, we don't care about it. */
    if (!FoundThis)
      return true;

    const CompoundStmt* LambdaBody = Expr->getBody();
    if (LambdaBody->body_empty())
      return true;

    for(auto Stmt : LambdaBody->body()) {
      MemberVisitor.Parent = Expr;
      MemberVisitor.TraverseStmt(Stmt);
    }

    return true;
  }

private:
  ASTContext *Context;
  FindLambdaCapturedFields MemberVisitor; // we'll come back to this
};
```

You may find that we define the function `VisitLambdaExpr` - because this is a special name registered within clang,
the compiler instance will run this function on any AST node that matches it: every lambda expression.

Walking through the class above, we first check if the lambda expression captures `this`:

```cpp
    bool FoundThis = false;
    for (auto it = Expr->capture_begin(); it != Expr->capture_end(); it++) {
      if (it->capturesThis()) {
        FoundThis = true;
        break;
      }
    }
```

If the lambda does not capture `this`, we can continue traversing the AST:

```cpp
    if (!FoundThis)
      return true;
```

Then we make another check to ensure the lambda body is not empty:

```cpp
    const CompoundStmt* LambdaBody = Expr->getBody();
    if (LambdaBody->body_empty())
      return true;
```

If all the above conditions are met, we traverse the body of the lambda to find any pointer- or array-like
member variables accessed in the lambda:

```cpp
    for(auto Stmt : LambdaBody->body()) {
      MemberVisitor.Parent = Expr;
      MemberVisitor.TraverseStmt(Stmt);
    }
```

Now that we have a higher-level AST traversal class to find lambdas that capture `this`, we can look at our next
AST traversal class which checks for problematic uses of member variables.
The member visitor will accept *all forms of expressions*, so we only run that visitor on the statements
in the body of the lambda.
You may also notice that we set the `Parent` field of our `MemberVisitor` - this is to improve the quality
of the diagnostics we are able to emit. We'll expand on this later.

#### Member Visitor

This AST visitor class ensures no pointer- or array-like member variables are accessed in the lambda

```cpp
struct FindLambdaCapturedFields
  : public RecursiveASTVisitor<FindLambdaCapturedFields> {
public:
  explicit FindLambdaCapturedFields(ASTContext *Context)
    : Context(Context) {}

  bool VisitMemberExpr(MemberExpr *Expr) {
    auto MemberType = Expr->getType();

    /* Problematic use of member variable! Time to generate diagnostic
     * information. */
    if (MemberType->isArrayType() || MemberType->isPointerType()) {

      /* Report diagnostic information */
      clang::DiagnosticsEngine &DE = Context->getDiagnostics();

      /* Error message describing the issue */
      auto ID = DE.getCustomDiagID(
          clang::DiagnosticsEngine::Error,
          "Found lambda capturing pointer-like member variable here.");
      DE.Report(Expr->getBeginLoc(), ID);

      /* Remark indicating which member variable triggered the error */
      ID = DE.getCustomDiagID(clang::DiagnosticsEngine::Note,
          "Member variable declared here:");
      DE.Report(Expr->getMemberDecl()->getBeginLoc(), ID);

      /* Remark with suggested change to mitigate the issue */
      ID = DE.getCustomDiagID(clang::DiagnosticsEngine::Remark,
          "Consider creating a local copy of the member variable in local scope"
          " just outside the lambda capture.");
      DE.Report(Parent->getBeginLoc(), ID);
    }
    return true;
  }

  ASTContext *Context;
  LambdaExpr *Parent=nullptr;
};
```

First, we check the type of the expression inside the lambda:

```cpp
    auto MemberType = Expr->getType();
    /* Problematic use of member variable! Time to generate diagnostic
     * information. */
    if (MemberType->isArrayType() || MemberType->isPointerType()) {
```    

If we enter this conditional, we've found a potential problem! Now what to do?

#### Diagnostics

Clang diagnostics are again a very rich library which won't be fully flushed out here - please
consult [the documentation for the Clang Diagnostics Engine](https://clang.llvm.org/doxygen/classclang_1_1DiagnosticsEngine.html).

First order of business in emmitting diagnositcs is to get a handle for a diagnositcs engine capable
of printing helpful messages to the user of our tool.

```cpp
      clang::DiagnosticsEngine &DE = Context->getDiagnostics();
```

Let's think for a moment about the sort of diagnostic we would like to emit.
I think we should report three things to the user if a lambda expression meets our 
critera for an error:

1. Location in the lambda where the member variable is used via `this` pointer
2. Location of that member's declaration
3. Suggestion for fixing the issue

Let's address these one-by-one: first, report the location where the member variable is
potentially erroneously used.

```cpp
      auto ID = DE.getCustomDiagID(
          clang::DiagnosticsEngine::Error,
          "Found lambda capturing pointer-like member variable here.");
      DE.Report(Expr->getBeginLoc(), ID);
```

Then, where the member variable was declared:

```cpp
      /* Remark indicating which member variable triggered the error */
      ID = DE.getCustomDiagID(clang::DiagnosticsEngine::Note,
          "Member variable declared here:");
      DE.Report(Expr->getMemberDecl()->getBeginLoc(), ID);
```

Finally, a suggestion for fixing the error:

```cpp
      /* Remark with suggested change to mitigate the issue */
      ID = DE.getCustomDiagID(clang::DiagnosticsEngine::Remark,
          "Consider creating a local copy of the member variable in local scope"
          " just outside the lambda capture.");
      DE.Report(Parent->getBeginLoc(), ID);
```

At this point, we're essentially done - all we need is a bit of boilerplate code to
connect our AST consumer classes up to a compiler instance:

```cpp
class LambdaCaptureCheckerConsumer : public clang::ASTConsumer {
public:
  explicit LambdaCaptureCheckerConsumer(ASTContext *Context)
    : Visitor(Context) {}
  explicit LambdaCaptureCheckerConsumer(CompilerInstance& CI)
    : Visitor(&CI.getASTContext()) {}

  virtual void HandleTranslationUnit(clang::ASTContext &Context) {
    Visitor.TraverseDecl(Context.getTranslationUnitDecl());
  }
private:
  FindLambdaCaptureThis Visitor;
};
```

Now we're done with the file `src/actions.hpp`.

### Driver

In `src/driver.cpp` we create an AST frontend action to create and use the compiler action we defined in `src/actions.hpp`:

```cpp
// src/driver.cpp
class LambdaCaptureCheckerAction : public clang::ASTFrontendAction {
public:
  virtual std::unique_ptr<clang::ASTConsumer> CreateASTConsumer(
    clang::CompilerInstance &Compiler, llvm::StringRef InFile) {
    return std::unique_ptr<clang::ASTConsumer>(
        new LambdaCaptureCheckerConsumer(&Compiler.getASTContext()));
  }
};
```

Here I omit any command line options.
[The documentation on this topic](https://llvm.org/docs/CommandLine.html) is rich,
so if you would like to add command line options you shouldn't have too much trouble.

```cpp
// src/driver.cpp
static cl::OptionCategory LambdaCaptureCheckerCategory("LambdaChecker options");

int main(int argc, const char **argv) {
  CommonOptionsParser Op(argc, argv, LambdaCaptureCheckerCategory);

  /* Create a new Clang Tool instance (a LibTooling environment). */
  ClangTool Tool(Op.getCompilations(), Op.getSourcePathList());

  return Tool.run(newFrontendActionFactory<LambdaCaptureCheckerAction>().get());
}
```

### Running

At this point, you may also generate a clang plugin library to use our AST actions
which can be loaded via compiler invocation, however I opted to stick with a standalone executable.

In order to fully test our AST action, I also created a subdirectory for examples,
giving us the following directory structure:

```

lambda-checker
├── CMakeLists.txt
├── src
│   ├── CMakeLists.txt
│   ├── driver.cpp
│   └── actions.hpp
└── test
    └── capture-test.cpp

```

Where `capture-test.cpp` contains:

```cpp
// capture-test.cpp
struct CaptureTest {

  /* Should not capture */
  int *i;

  /* Should not capture */
  int j[1];

  /* OK to capture */
  int k=0;

  /* Method which implicitly captures `this` pointer and modifies member
   * variable `i`. This is problematic when using portability libraries, as
   * member variables may not reside on the host. */
  void methodUsingBadCapturePointer() {
    auto throwaway = [=] () {
      *i = 1;
    };
  }

  /* Raw arrays should not be used either. */
  void methodUsingBadCaptureArray() {
    auto throwaway = [=] () {
      j[0] = 1;
    };
  }

  /* The preferred method to mitigate the issue outlined above is to create a
   * local copy of the pointer and modify the underlying data through the copy.
   */
  void methodUsingGoodCapture() {
    int* localCopy = i;
    auto throwaway = [=] () {
      *localCopy += 1;
    };
  }

  /* Methods which capture `this` variables which are not pointers should not
   * cause an issue. */
  void methodNotCapturingPointer() {
    auto throwaway = [=] () {
      k++;
    };
  }
};

int main() { return 0; }
```

I added this as a CMake target such that the compile commands database would be generated for
our test case ([additional documentation for compile-commands database](https://clang.llvm.org/docs/HowToSetupToolingForLLVM.html)).
To do this, add the following to the top-level `CMakeLists.txt`:

```cmake
# top-level CMakeLists.txt
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
add_executable(dummy-target test/capture-test.cpp)
```

This way, we are able to run our plugin driver directly on our test case.

```console

$ cd lambda-capture
$ mkdir build
$ cd build
$ cmake .. && make

$ # At this point, the file `compile_commands.json` should exist in your CWD
$ # and you should be able to run the driver on our test case:
$ ./src/LambdaChecker ../test/capture-test.cpp
/path/to/lambda-capture/test/capture.cpp:17:8: error: Found lambda capturing pointer-like member variable here.

      *i = 1;
       ^
/path/to/lambda-capture/test/capture.cpp:4:3: note: Member variable declared here:
  int *i;
  ^
/path/to/lambda-capture/test/capture.cpp:16:22: remark: Consider creating a local copy of the member variable in local scope
just outside the lambda capture.
    auto throwaway = [=] () {

```

As you can see, our tool seems to be correctly identifying our domain-specific error!
After developing this tool and running it over all of our codebases which make heavy use of portability
libraries such as RAJA and Kokkos, we are confident that we have purged this error from our
codebase.

Hopefully this demonstration helps your team weed out nasty errors like these from your codebase as well.

The full code listings can be found in the [repository linked here](https://github.com/ashermancinelli/lambda-capture-checker).
The code snippets used here for example purposes will not map perfectly to the current repository, but should
serve as a concrete starting point.

{% include footer.html %}

## References

1. [Lambda Capture tool](https://github.com/ashermancinelli/lambda-capture-checker)
1. [RAJA](https://github.com/LLNL/RAJA/blob/main/docs/sphinx/user_guide/index.rst)
1. [Kokkos](https://github.com/kokkos/kokkos)
1. [Clang compile commands database spec](https://clang.llvm.org/docs/JSONCompilationDatabase.html)
1. [Clang compile commands tutorial](https://clang.llvm.org/docs/HowToSetupToolingForLLVM.html)
1. [HiOp](https://github.com/LLNL/hiop)
1. [Clang AST Visitor documentation](https://clang.llvm.org/docs/RAVFrontendAction.html)
1. [Peter Goldsborough's C++Now talk on Clang/LLVM tools](https://www.youtube.com/watch?v=E6i8jmiy8MY&ab_channel=CppNow)
