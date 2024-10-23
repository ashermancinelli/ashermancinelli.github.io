
Compilers today do lots of whole-program optimization and even link-time optimization (LTO) that does a bit of optimization that can only be done when the entire program and all its libraries are linked together.

```
                                                            
        Example of a modern compiler (llvm)
        -----------------------------------                 
                                                            
                                                            
              Source Code (test.cpp)                        
            ┌───────────────────────┐                       
            │                       │                       
    ┌───────┼─ int func1() {...}    │                       
    │       │  int func2() {...}    │                       
    │       │  int func3() {...}    │                       
    │       │                       │                       
    │       └───────────────────────┘                       
    │                                                       
    │  ┌──────────────────────────────────┐                 
    │  │            Compiler              │                 
    │  │         --------------           │                 
    │  │      ┌──────────────────┐        │                 
    └──┼────► │    Frontend      │        │  Clang          
       │      │                  │        │                 
       │      │ ┌─► Lexer   ───┐ │        │  Note the lexer and parser working together
       │      │ │              │ │        │  since the grammar for c++ is not context-free.
       │      │ └── Parser  ◄──┘ │        │                 
       │      └──────────────────┘        │                 
       │                                  │                 
       │              │                   │                 
       │              │   IR              │                 
       │              ▼                   │                 
       │ ┌─────────────────────────────┐  │                 
       │ │         Optimizer           │  │  Opt            
       │ │                             │  │                 
       │ │                             │  │                 
       │ │      pass1  │ ◄─────Also IR │  │                 
       │ │             │               │  │                 
       │ │             │               │  │                 
       │ │      pass2  ▼ │             │  │                 
       │ │               │             │  │                 
       │ │               │             │  │                 
       │ │      pass3    ▼   │         │  │                 
       │ │                   │         │  │                 
       │ │                   │         │  │                 
       │ │      pass2 again  ▼         │  │                 
       │ │                             │  │                 
       │ └─────────────────────────────┘  │                 
       │                                  │                 
       │   ┌───────────────────────────┐  │                 
       │   │     Code Generation       │  │                 
       │   │                           │  │   LLC           
       │   │ Target-independent core   │  │                 
       │   │                           │  │                 
       │   │ Regalloc                  │  │                 
       │   │                           ├──┼──┐              
       │   │ Actual codegen            │  │  │              
       │   │                           │  │  │              
       │   │                           │  │  │              
       │   │                           │  │  │              
       │   └───────────────────────────┘  │  │              
       │                                  │  │              
       └──────────────────────────────────┘  │              
                                             │              
                   ┌──────────────────┐      │              
                   │  Assembly        │      │              
                   │                  │      │              
                   │  func1:          │◄─────┘              
                   │    ldr x1, [sp]  │                     
                   │                  │                     
                   └───────┬──────────┘                     
                           │                                
                           │  Linker (lld)                  
                           │                                
                   ┌───────▼──────┐                         
                   │   Program    │                         
                   │              │                         
                   └──────────────┘
```

<!-- The memory constraints that required early compiler developers to structure the compiler in this way largely do not apply  -->
