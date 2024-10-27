# Value Proposition of Better Compilers

~~~admonish important title="Key Question"
Why learn about compilers? Why are they important right now?

***So what? Who cares?***
~~~

Software used to get "better" every year by virtue of the hardware getting exponentially better.
This isn't quite true anymore - harware is indeed getting much better every single year, but this is often in part due to specialized hardware.
It's not the case that every consumer's CPU will run the same software 10x faster next year, and it's more likely that they have a heterogeneous architecture that requires some know-how to fully leverage.

~~~admonish quote title=""
The past's *free lunch* from direct hardware improvements is no longer for sale.
Hardware-software co-design is the future.
~~~

To best leverage the hardware, the hardware vendors usually give users a descriptive, higher-level option for describing software that gives lots of freedom to the language/compiler/runtime, or you have a very low-level, prescriptive model.
For example, compare auto-vectorization with writing platform-specific vector intrinsics by hand.

Often, the descriptive programming models are mature or fully available, users write their most important kernels by hand and leave the rest to the higher-level languages.
After a while, they may script this step, so maybe they have some python code generating a set of kernels in vector intrinsics.
This eventually becomes a fragile, ad-hoc compiler that their software sits on, sort of demonstrating that the programming language/compiler level is the right level to address the problem of hardware utilization -
if platform distributors don't give users a good programming language/runtime/compiler option, one will grow naturally from the problem space.
We as compiler developers have a unique opportunity to usher in the era of heterogeneous compute platforms.

Hardware and software have to be designed together (hardware-software codesign), otherwise a compiler/language/runtime will be built ad-hoc by your users.
Take advantage of your moment to design the language/compiler/runtime from the beginning and give users the opportunity to help so it's done well from the start.

This heterogeneity is only getting more extreme - the spectrum from CPUs to GPUs to NPU/TPUs, to FPGAs where you're reprogramming the board itself for the operations you care about, down to designing your own chip from the ground up, hardware manufacturers are getting more and more creative, and we need to develop the PL/compiler space before users build up a more fragile library- or script-based solution on their own.

~~~admonish todo

1. Why?
    1. “Free lunch” software people got from early moore’s law hardware scaling is mostly over
        1. We need to be smarter, we need better compilers
        2. Today’s hardware doesnt just innately run yesterday’s software 10x faster
        3. Need hw sw codesign of proglangs that are hardware and DevEx efficient
    2. Increasing importance of accelerators
        1. Not so easy to get a free lunch, cant always dump your app onto a brand new gpu and expect amazing performance in the same way you can with the CPU
        2. More sensitive to configuration
            1. You can explicitly say I want this value to live in the L2 cache for this compute kernel. If you get memory hierarchy wrong, you might see a massive dropping performance. It’s very difficult to get right by hand.
    3. Heterogeneity
        1. You might need to run on an amalgamation of four different systems all of different hardware
    4. How do we take advantage of this?
        1. Do you want your software engineers being really explicit about what they want? Vector intrinsics, manual memory placement on a GPU in a specific place in a specific cash level?
        2. Do you want your language ecosystem to take care of this for you?
            1. Libraries with handwritten code by experts?
            2. Programming models Compiler makes all the performance decisions for you?
    5. Lots a hardware in software innovation and fragmentation happening at the same time?
        1. Spectrum from
            1. Cpu v general
            2. Gpu more specific with simd model. Tensor cores for specialized ops
            3. Tpu npu etc
            4. Fpga, rewire for some specific op
            5. Design your own chip

~~~
