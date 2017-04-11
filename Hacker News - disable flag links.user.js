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
        // create placeholder (with href set to '#' in order to preserve tab index)
        const dummyElement = document.createElement('a');
        dummyElement.href = '#';

        // use <del> tag to indicate deleted text
        const del = document.createElement('del');
        del.textContent = element.textContent;

        // preserve <a> tag by appending <del> tag as a child
        dummyElement.appendChild(del);

        // swap the old link for the new one
        element.parentNode.insertBefore(dummyElement, element);
        element.parentNode.removeChild(element);

        dummyElement.addEventListener('dblclick', () => restoreLink(dummyElement, element), {
            once: true
        });
    }

    function restoreLink (dummyElement, realElement) {
        dummyElement.parentNode.insertBefore(realElement, dummyElement);
        dummyElement.parentNode.removeChild(dummyElement);
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
