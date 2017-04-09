// ==UserScript==
// @name         Hacker News - disable flag links
// @namespace    https://brbsix.github.io/
// @version      0.1
// @author       Brian Beffa <brbsix@gmail.com>
// @description  Double-click to re-enable
// @match        https://news.ycombinator.com/*
// @icon         https://news.ycombinator.com/favicon.ico
// @updateURL    https://github.com/brbsix/userscripts.js/raw/master/Hacker%20News%20-%20disable%20flag%20links.user.js
// @grant        GM_log
// ==/UserScript==

(function () {
    'use strict';

    function disableLink (element) {
        // use <del> tag to indicate deleted text
        const del = document.createElement('del');
        del.textContent = element.textContent;

        // rather than deletion, href is set to '#' in order to maintain tab index
        element.href = '#';
        element.textContent = '';

        // preserve <a> tag by appending <del> tag as a child
        element.appendChild(del);
    }

    function enableLink (element, outerHTML) {
        element.outerHTML = outerHTML;
        log('enabled element');
    }

    function log () {
        GM_log(...[arguments.length ? GM_info.script.name + ':' : GM_info.script.name, ...arguments]);
    }

    function setupLink (element) {
        const outerHTML = element.outerHTML;
        disableLink(element);
        element.addEventListener('dblclick', () => enableLink(element, outerHTML), {
            once: true
        });
    }

    log('configuring flag links');

    Array.from(
        document.querySelectorAll('a[href^="flag?"]')
    ).forEach(
        setupLink
    );

})();
