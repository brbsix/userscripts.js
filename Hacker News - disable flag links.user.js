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

    function protectLink (element) {
        const outerHTML = element.outerHTML;

        // use <del> tag to indicate deleted text
        const del = document.createElement('del');
        del.textContent = element.textContent;

        // rather than delete it, set href to '#' in order to preserve tab index
        element.href = '#';
        element.textContent = '';

        // preserve <a> tag by appending <del> tag as a child
        element.appendChild(del);

        element.addEventListener('dblclick', () => restoreLink(element, outerHTML), {
            once: true
        });
    }

    function restoreLink (element, outerHTML) {
        element.outerHTML = outerHTML;
        log('restored element');
    }

    function log () {
        GM_log(...[arguments.length ? GM_info.script.name + ':' : GM_info.script.name, ...arguments]);
    }

    log('configuring flag links');

    Array.from(
        document.querySelectorAll('a[href^="flag?"]')
    ).filter(
        // don't disable "unflag" links
        a => a.textContent === 'flag'
    ).forEach(
        protectLink
    );

})();
