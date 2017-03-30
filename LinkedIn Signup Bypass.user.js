// ==UserScript==
// @name         LinkedIn Signup Bypass
// @namespace    https://brbsix.github.io/
// @version      0.1
// @author       Brian Beffa <brbsix@gmail.com>
// @description  Bypass signup-related crud on LinkedIn profile pages
// @match        http://www.linkedin.com/in/*
// @match        https://www.linkedin.com/in/*
// @icon         https://www.linkedin.com/favicon.ico
// @updateURL    https://github.com/brbsix/userscripts.js/raw/master/LinkedIn%20Signup%20Bypass.user.js
// @grant        GM_info
// @grant        GM_log
// ==/UserScript==

(function () {
    'use strict';

    function log () {
        GM_log(...[arguments.length ? GM_info.script.name + ':' : GM_info.script.name, ...arguments]);
    }

    function removeNodes (selector) {
        document.querySelectorAll(selector).forEach(
            function (e) {
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
