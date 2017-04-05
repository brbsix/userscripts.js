// ==UserScript==
// @name         Hacker News - disable flag links
// @namespace    https://brbsix.github.io/
// @version      0.1
// @author       Brian Beffa <brbsix@gmail.com>
// @description  Double-click to re-enable
// @match        https://news.ycombinator.com/*
// @icon         https://news.ycombinator.com/favicon.ico
// @updateURL    https://github.com/brbsix/userscripts.js/raw/master/Hacker%20News%20-%20disable%20flagging.user.js
// @grant        GM_log
// ==/UserScript==

(function () {
    'use strict';

    function disableLink (element) {
        element.removeAttribute('href');
        element.innerHTML = `<del>${element.textContent}</del>`;
    }

    function enableLink (element, outerHTML) {
        element.outerHTML = outerHTML;
        log('enabled element');
    }

    function log () {
        GM_log(...[arguments.length ? GM_info.script.name + ':' : GM_info.script.name, ...arguments]);
    }

    log('configuring flag links');

    Array.from(
        document.querySelectorAll('a[href^="flag?"]')
    ).forEach(
        l => {
            const outerHTML = l.outerHTML;
            disableLink(l);
            l.ondblclick = () => enableLink(l, outerHTML);
        }
    );

})();
