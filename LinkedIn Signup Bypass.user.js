// ==UserScript==
// @name         LinkedIn Signup Bypass
// @namespace    https://brbsix.github.io/
// @version      0.1
// @author       Brian Beffa <brbsix@gmail.com>
// @description  Bypass signup-related crud on LinkedIn profile pages
// @match        https://www.linkedin.com/in/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function removeNodes(selector) {
        document.querySelectorAll(selector).forEach(
            function(e) {
                e.parentNode.removeChild(e);
            }
        );
    }

    // hide signup overlay
    removeNodes('#advocate-modal');

    // hide signup card
    removeNodes('.reg-upsell');
})();