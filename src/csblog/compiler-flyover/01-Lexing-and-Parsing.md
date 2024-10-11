# Lexing & Parsing

Now that we have a foundation of eBNF grammars and context-free grammars we can talk about lexing and parsing.

If you look at the TOC of the Dragon Book, you'll see that chapters 1-9 and 11 are essentially all about parsing and lexing.
At the time, compilers cared a *lot* about locality because it was so hard to fit the entire program into memory.
Compiler had to be architected to work on a tiny chunk of a single program at a time, meaning the parser would request a token from the lexer when it needed to as it was streaming through the input tokens.
Perhaps a single function was processed at a time, code was often generated as the compiler streamed through the input.

This is called a *sinlge-pass compiler*, meaning the compiler as a whole streamed through the entire program once, lexing, parsing, and generating assembly code in one pass.
This was +/-necessary because the primary constraint was fitting all the data structures for the program into memory while the compiler was running.

These compilers were often what-you-see-is-what-you-get for this reason; whatever code you wrote would be streamed directly to assembly after a brief semantic analysis.
Little optimization was done (chapters 12, 13 and 14 of the dragon book are about optimization, but what would be considered extremely basic optimization today due to the memory constraints).


```
              Example of a streaming single-pass compiler           
              -------------------------------------------           
                                                                    
                                                                    
                        Source Code (test.c)                        
                      ┌───────────────────────┐                     
                      │                       │                     
     ┌────────────────┼─ int func1() {...}    │                     
     │                │  int func2() {...}    │                     
     │                │  int func3() {...}    │                     
     │                │                       │                     
     │                └───────────────────────┘                     
     │                                                              
     │   ┌─────────────────────────────────────────────────────┐    
     │   │                    Compiler                         │    
     │   │                 --------------                      │    
     │   │                                                     │    
     └───┼───►Lexer ─────► Parser ──► Semantics ───► Codegen  ─┼──┐ 
         │            ▲            ▲             ▲             │  │ 
         │            │            │             │             │  │ 
         │          Tokens       Parse          AST            │  │ 
         │                       Tree                          │  │ 
         └─────────────────────────────────────────────────────┘  │ 
                        ┌──────────────────┐                      │ 
                        │  Assembly        │                      │ 
                        │                  │                      │ 
                        │  func1:          │◄─────────────────────┘ 
                        │    ldr x1, [sp]  │                        
                        │                  │                        
                        └──────────────────┘                        

```

This is not often the case today for a variety of reasons.
Compilers today do lots of whole-program optimization and even link-time optimization (LTO) that does a bit of optimization that can only be done when the entire program and all its libraries are linked together.

```
                                                            
        Example of a modern compiler (llvm)
        -----------------------------------                 
                                                            
                                                            
              Source Code (test.c)                          
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
       │      │ ┌─► Lexer   ───┐ │        │                 
       │      │ │              │ │        │                 
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

---

[^ccarruth_cppnow2023]: [Modernizing Compiler Design for Carbon Toolchain - Chandler Carruth - CppNow 2023](https://youtu.be/ZI198eFghJk?si=Ju9jL8-CzL31QaAz)
[^asciiflow]: [ascii flow for ascii diagrams](https://asciiflow.com/#/)
