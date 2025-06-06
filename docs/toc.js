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
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="index.html">Introduction</a></li><li class="chapter-item expanded affix "><li class="part-title">Smart Contract Vulnerabilities</li><li class="chapter-item expanded "><a href="vulnerabilities/authorization-txorigin.html"><strong aria-hidden="true">1.</strong> Authorization Through tx.origin</a></li><li class="chapter-item expanded "><a href="vulnerabilities/insufficient-access-control.html"><strong aria-hidden="true">2.</strong> Insufficient Access Control</a></li><li class="chapter-item expanded "><a href="vulnerabilities/delegatecall-untrusted-callee.html"><strong aria-hidden="true">3.</strong> Delegatecall to Untrusted Callee</a></li><li class="chapter-item expanded "><a href="vulnerabilities/signature-malleability.html"><strong aria-hidden="true">4.</strong> Signature Malleability</a></li><li class="chapter-item expanded "><a href="vulnerabilities/missing-protection-signature-replay.html"><strong aria-hidden="true">5.</strong> Missing Protection against Signature Replay Attacks</a></li><li class="chapter-item expanded "><a href="vulnerabilities/overflow-underflow.html"><strong aria-hidden="true">6.</strong> Integer Overflow and Underflow</a></li><li class="chapter-item expanded "><a href="vulnerabilities/off-by-one.html"><strong aria-hidden="true">7.</strong> Off-By-One</a></li><li class="chapter-item expanded "><a href="vulnerabilities/lack-of-precision.html"><strong aria-hidden="true">8.</strong> Lack of Precision</a></li><li class="chapter-item expanded "><a href="vulnerabilities/reentrancy.html"><strong aria-hidden="true">9.</strong> Reentrancy</a></li><li class="chapter-item expanded "><a href="vulnerabilities/dos-gas-limit.html"><strong aria-hidden="true">10.</strong> DoS with Block Gas Limit</a></li><li class="chapter-item expanded "><a href="vulnerabilities/dos-revert.html"><strong aria-hidden="true">11.</strong> DoS with (Unexpected) revert</a></li><li class="chapter-item expanded "><a href="vulnerabilities/msgvalue-loop.html"><strong aria-hidden="true">12.</strong> Using msg.value in a Loop</a></li><li class="chapter-item expanded "><a href="vulnerabilities/transaction-ordering-dependence.html"><strong aria-hidden="true">13.</strong> Transaction-Ordering Dependence</a></li><li class="chapter-item expanded "><a href="vulnerabilities/insufficient-gas-griefing.html"><strong aria-hidden="true">14.</strong> Insufficient Gas Griefing</a></li><li class="chapter-item expanded "><a href="vulnerabilities/unchecked-return-values.html"><strong aria-hidden="true">15.</strong> Unchecked Return Value</a></li><li class="chapter-item expanded "><a href="vulnerabilities/arbitrary-storage-location.html"><strong aria-hidden="true">16.</strong> Write to Arbitrary Storage Location</a></li><li class="chapter-item expanded "><a href="vulnerabilities/unbounded-return-data.html"><strong aria-hidden="true">17.</strong> Unbounded Return Data</a></li><li class="chapter-item expanded "><a href="vulnerabilities/uninitialized-storage-pointer.html"><strong aria-hidden="true">18.</strong> Uninitialized Storage Pointer</a></li><li class="chapter-item expanded "><a href="vulnerabilities/unexpected-ecrecover-null-address.html"><strong aria-hidden="true">19.</strong> Unexpected ecrecover null address</a></li><li class="chapter-item expanded "><a href="vulnerabilities/weak-sources-randomness.html"><strong aria-hidden="true">20.</strong> Weak Sources of Randomness from Chain Attributes</a></li><li class="chapter-item expanded "><a href="vulnerabilities/hash-collision.html"><strong aria-hidden="true">21.</strong> Hash Collision when using abi.encodePacked() with Multiple Variable-Length Arguments</a></li><li class="chapter-item expanded "><a href="vulnerabilities/timestamp-dependence.html"><strong aria-hidden="true">22.</strong> Timestamp Dependence</a></li><li class="chapter-item expanded "><a href="vulnerabilities/unsafe-low-level-call.html"><strong aria-hidden="true">23.</strong> Unsafe Low-Level Call</a></li><li class="chapter-item expanded "><a href="vulnerabilities/unsupported-opcodes.html"><strong aria-hidden="true">24.</strong> Unsupported Opcodes</a></li><li class="chapter-item expanded "><a href="vulnerabilities/unencrypted-private-data-on-chain.html"><strong aria-hidden="true">25.</strong> Unencrypted Private Data On-Chain</a></li><li class="chapter-item expanded "><a href="vulnerabilities/asserting-contract-from-code-size.html"><strong aria-hidden="true">26.</strong> Asserting Contract from Code Size</a></li><li class="chapter-item expanded "><a href="vulnerabilities/floating-pragma.html"><strong aria-hidden="true">27.</strong> Floating Pragma</a></li><li class="chapter-item expanded "><a href="vulnerabilities/outdated-compiler-version.html"><strong aria-hidden="true">28.</strong> Outdated Compiler Version</a></li><li class="chapter-item expanded "><a href="vulnerabilities/use-of-deprecated-functions.html"><strong aria-hidden="true">29.</strong> Use of Deprecated Functions</a></li><li class="chapter-item expanded "><a href="vulnerabilities/incorrect-constructor.html"><strong aria-hidden="true">30.</strong> Incorrect Constructor Name</a></li><li class="chapter-item expanded "><a href="vulnerabilities/shadowing-state-variables.html"><strong aria-hidden="true">31.</strong> Shadowing State Variables</a></li><li class="chapter-item expanded "><a href="vulnerabilities/incorrect-inheritance-order.html"><strong aria-hidden="true">32.</strong> Incorrect Inheritance Order</a></li><li class="chapter-item expanded "><a href="vulnerabilities/unused-variables.html"><strong aria-hidden="true">33.</strong> Presence of Unused Variables</a></li><li class="chapter-item expanded "><a href="vulnerabilities/default-visibility.html"><strong aria-hidden="true">34.</strong> Default Visibility</a></li><li class="chapter-item expanded "><a href="vulnerabilities/inadherence-to-standards.html"><strong aria-hidden="true">35.</strong> Inadherence to Standards</a></li><li class="chapter-item expanded "><a href="vulnerabilities/assert-violation.html"><strong aria-hidden="true">36.</strong> Assert Violation</a></li><li class="chapter-item expanded "><a href="vulnerabilities/requirement-violation.html"><strong aria-hidden="true">37.</strong> Requirement Violation</a></li></ol>';
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
