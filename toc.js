// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="about.html">About</a></li><li class="chapter-item expanded affix "><li class="part-title">💡 Blog</li><li class="chapter-item expanded "><div>2026</div></li><li><ol class="section"><li class="chapter-item expanded "><a href="csblog/2026/Orality-and-Literacy/2025-12-28-Orality-Literacy-and-Code.html">Orality, Literacy, and Code</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="csblog/2026/Orality-and-Literacy/2025-12-28-Orality-Literacy.html">Orality and Literacy</a></li><li class="chapter-item expanded "><a href="csblog/2026/Orality-and-Literacy/2025-12-28-Orality-and-Code.html">Orality and Code</a></li><li class="chapter-item expanded "><a href="csblog/2026/Orality-and-Literacy/2025-12-28-Literacy-and-Code.html">Literacy and Code</a></li><li class="chapter-item expanded "><a href="csblog/2026/Orality-and-Literacy/2025-12-28-Conclusion.html">Conclusion</a></li><li class="chapter-item expanded "><a href="csblog/2026/Orality-and-Literacy/2025-12-28-Links.html">Links and References</a></li><li class="chapter-item expanded "><a href="csblog/2026/Orality-and-Literacy/2025-12-28-Orality-Literacy-and-Code-Notes.html">Notes on Orality and Literacy</a></li></ol></li></ol></li><li class="chapter-item expanded "><div>2025</div></li><li><ol class="section"><li class="chapter-item expanded "><a href="csblog/2025-10-23-History-of-Compilers.html">History of Compilers</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="csblog/2025-11-4-David-MacQueen-on-the-History-of-Compilers.html">David MacQueen on the History of Compilers</a></li></ol></li><li class="chapter-item expanded "><a href="csblog/2025-9-23-Dataflow-CPUs.html">Dataflow CPUs</a></li><li class="chapter-item expanded "><a href="csblog/2025-9-18-Book-Recs.html">Books Recs</a></li><li class="chapter-item expanded "><a href="csblog/2025-7-29-Array-Cast.html">Array Cast Episode</a></li><li class="chapter-item expanded "><a href="csblog/2025-7-23-Strict-Aliasing.html">Why UB is Good</a></li><li class="chapter-item expanded "><a href="csblog/2025-7-21-SMT-Solver-Interview.html">Try an SMT solver</a></li><li class="chapter-item expanded "><a href="csblog/2025-7-20-Ideal-Array-Language.html">My Ideal Array Language</a></li><li class="chapter-item expanded "><a href="csblog/values.html">Values</a></li></ol></li><li class="chapter-item expanded "><div>2024</div></li><li><ol class="section"><li class="chapter-item expanded "><a href="csblog/2024-9-4-Debugging-In-Parallel.html">Debugging in Parallel</a></li><li class="chapter-item expanded "><a href="csblog/2024-8-31-Linux-Perf-Notes.html">Linux Perf Notes</a></li></ol></li><li class="chapter-item expanded "><div>2023</div></li><li><ol class="section"><li class="chapter-item expanded "><a href="csblog/2023-6-1-C-VLA-Implementation.html">Variable Length Arrays</a></li></ol></li><li class="chapter-item expanded "><div>2022</div></li><li><ol class="section"><li class="chapter-item expanded "><a href="csblog/2022-5-2-BQN-reflections.html">BQN and Reflections on the Joy of Programming</a></li><li class="chapter-item expanded "><a href="csblog/2022-2-2-LLVM-Development-On-NixOS.html">LLVM Development on NixOS</a></li><li class="chapter-item expanded "><a href="csblog/2022-2-10-CUDA-101-Matvec.html">CUDA 101: Matrix-Vector Product</a></li><li class="chapter-item expanded "><a href="csblog/2022-12-12-Compiler-Perf-Debugging.html">Debugging Performance in Compilers</a></li><li class="chapter-item expanded "><a href="csblog/2022-1-15-Std-Expected.html">std::expected&#39;s Monadic Interface</a></li></ol></li><li class="chapter-item expanded "><div>2021</div></li><li><ol class="section"><li class="chapter-item expanded "><a href="csblog/2021-3-7-GTest-Type-Value-Params.html">GTest Type and Value Parameterized Tests</a></li><li class="chapter-item expanded "><a href="csblog/2021-3-6-Spack-Development-3.html">Spack for Package Development Part 3</a></li><li class="chapter-item expanded "><a href="csblog/2021-3-6-Clang-Tools-Lambda.html">Clang Tools for Checking Domain-Specific Errors</a></li><li class="chapter-item expanded "><a href="csblog/2021-3-5-Spack-Development-2.html">Spack for Package Development Part 2</a></li><li class="chapter-item expanded "><a href="csblog/2021-3-4-Spack-Development-1.html">Spack for Package Development Part 1</a></li><li class="chapter-item expanded "><a href="csblog/2021-12-23-std-mdspan-Response.html">A Look at std::mdspan</a></li><li class="chapter-item expanded "><a href="csblog/2021-10-24-Popular-Languages-1965.html">Using the Most Popular Programming Languages of the &#39;60s</a></li><li class="chapter-item expanded "><a href="csblog/2021-10-19-Leetcode-And-Distributed-Computing.html">One Problem, Four Languages, Two Paradigms</a></li><li class="chapter-item expanded "><a href="csblog/2021-10-11-BQN-Cpp-CUDA.html">BQN and CUDA C++ LeetCode Solutions</a></li></ol></li><li class="chapter-item expanded "><a href="csblog/2025-9-30-Style-Inspiration.html">Style Inspirations</a></li><li class="chapter-item expanded affix "><li class="part-title">🚧 WIP 🚧</li><li class="chapter-item expanded "><a href="csblog/2025-9-23-History-Of-Compilers.html">A Brief History of Compilers</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="csblog/2025-9-23-History-Of-Compilers-Early-Hours.html">The Earliest Hours</a></li><li class="chapter-item expanded "><a href="csblog/2025-9-23-History-Of-Compilers-Unix.html">Unix</a></li><li class="chapter-item expanded "><a href="csblog/2025-9-23-History-Of-Compilers-Open-Source-Era.html">Open Source Era</a></li></ol></li><li class="chapter-item expanded "><a href="csblog/2025-7-26-Functional-Array-Languages.html">The Unreasonable Optimizability of Functional Array Languages</a></li><li class="chapter-item expanded "><a href="csblog/2025-7-26-Pay-Me-Now-Or-Later.html">Pay Me Now or Pay Me Later</a></li><li class="chapter-item expanded "><a href="csblog/2025-7-24-Compilers-Are-Like-Fish.html">Compilers are like Fish</a></li><li class="chapter-item expanded "><a href="csblog/2025-7-24-Career-Journey.html">Career Journey</a></li><li class="chapter-item expanded "><a href="csblog/2025-7-23-Monadic-MLIR-Types.html">Monadic Operations on MLIR&#39;s FailureOr</a></li><li class="chapter-item expanded "><a href="csblog/2025-7-22-Vector-Length.html">You can vectorize without a vector length?</a></li><li class="chapter-item expanded "><a href="csblog/2025-7-22-Functional-Programming-Compilers.html">Why is functional programming such a great fit for Compilers?</a></li><li class="chapter-item expanded "><a href="csblog/2025-7-22-MLIR-OCaml.html">What Would It Take to Build an MLIR-Based OCaml Compiler?</a></li><li class="chapter-item expanded "><a href="csblog/2025-7-22-Simple-Type-Checker.html">The Simplest Hindley-Milner Type Checker</a></li><li class="chapter-item expanded affix "><li class="part-title">☕️ Coffee</li><li class="chapter-item expanded "><div>2023</div></li><li><ol class="section"><li class="chapter-item expanded "><a href="coffeeblog/2023-6-11-Best-Espresso-In-Portland.html">Best Espresso In Portland</a></li><li class="chapter-item expanded "><a href="coffeeblog/2023-6-22-Sterling.html">Sterling</a></li><li class="chapter-item expanded "><a href="coffeeblog/2023-6-14-Deadstock.html">Deadstock</a></li><li class="chapter-item expanded "><a href="coffeeblog/2023-6-22-Barista.html">Barista</a></li><li class="chapter-item expanded "><a href="coffeeblog/2023-6-13-Never-Coffee.html">Never Coffee</a></li><li class="chapter-item expanded "><a href="coffeeblog/2023-6-15-Upper-Left-Roasters.html">Upper Left Roasters</a></li><li class="chapter-item expanded "><a href="coffeeblog/2023-6-14-Abba.html">Abba</a></li><li class="chapter-item expanded "><a href="coffeeblog/2023-6-15-Rose-City-Coffee.html">Rose City Coffee</a></li><li class="chapter-item expanded "><a href="coffeeblog/2023-6-14-Sterling.html">Sterling</a></li><li class="chapter-item expanded "><a href="coffeeblog/2023-6-21-Superjoy.html">Superjoy</a></li><li class="chapter-item expanded "><a href="coffeeblog/2023-6-13-Beginners-Guide.html">Beginners Guide</a></li><li class="chapter-item expanded "><a href="coffeeblog/2023-6-19-Seattle-Trip-Report.html">Seattle Trip Report</a></li><li class="chapter-item expanded "><a href="coffeeblog/2023-6-15-Adapt-Coffee.html">Adapt Coffee</a></li><li class="chapter-item expanded "><a href="coffeeblog/2023-6-13-Coava.html">Coava</a></li><li class="chapter-item expanded "><a href="coffeeblog/2023-6-14-PDX-Espresso-Research.html">PDX Espresso Research</a></li><li class="chapter-item expanded "><a href="coffeeblog/2023-6-15-Nossa-Familia-Coffee.html">Nossa Familia Coffee</a></li></ol></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
