// ==UserScript==
// @name         LinkedIn Signup Bypass
// @namespace    https://brbsix.github.io/
// @version      0.1
// @author       Brian Beffa <brbsix@gmail.com>
// @description  Bypass signup-related crud on LinkedIn profile pages
// @match        https://www.linkedin.com/in/*
// @grant        GM_info
// @grant        GM_log
// ==/UserScript==

(function() {
    'use strict';

    const scriptName = GM_info.script.name;

    function log(msg) {
        if (msg) {
            GM_log(scriptName + ':', msg);
        } else {
            GM_log(scriptName);
        }
    }

    function removeNodes(selector) {
        document.querySelectorAll(selector).forEach(
            function(e) {
                e.parentNode.removeChild(e);
            }
        );
    }

    log();

    // hide signup overlay
    removeNodes('#advocate-modal');

    // hide signup card
    removeNodes('.reg-upsell');
})();