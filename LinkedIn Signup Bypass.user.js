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
// @grant        GM_log
// ==/UserScript==

(function () {
    'use strict';

    function removeNodes (selector) {
        document.querySelectorAll(selector).forEach(
            e => e.parentNode.removeChild(e)
        );
    }

    GM_log(GM_info.script.name);

    // hide signup overlay
    removeNodes('#advocate-modal');

    // hide signup card
    removeNodes('.reg-upsell');
})();
