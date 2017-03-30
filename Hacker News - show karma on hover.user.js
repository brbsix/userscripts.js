// ==UserScript==
// @name         Hacker News - show karma on hover
// @namespace    https://brbsix.github.io/
// @version      0.1
// @author       Brian Beffa <brbsix@gmail.com>
// @description  Hover over a commenter's username to view their karma
// @match        https://news.ycombinator.com/item?id=*
// @icon         https://news.ycombinator.com/favicon.ico
// @grant        GM_info
// @grant        GM_log
// ==/UserScript==

(function () {
    'use strict';

    function log () {
        GM_log(...[arguments.length ? GM_info.script.name + ':' : GM_info.script.name, ...arguments]);
    }

    // add or update existing text node after link
    function addKarma(afterLink, karma) {
        const nextSibling = afterLink.nextSibling;

        // if span doesn't exist yet, create it
        if (nextSibling === null || nextSibling.nodeName !== 'SPAN') {
            log('creating new text node');
            const repSpan = document.createElement('span');
            repSpan.className = 'reputation';
            afterLink.parentNode.insertBefore(repSpan, nextSibling);
        }

        // now update it
        afterLink.nextSibling.textContent = ` (karma: ${karma}) `;
        log(afterLink.nextSibling);
    }

    function showKarma (link) {
        const username = new URL(link.href).searchParams.get('id');
        fetch(`https://hacker-news.firebaseio.com/v0/user/${username}/karma.json`)
        .then(response => response.json())
        .then(karma => addKarma(link, karma));
    }

    function throttle (fn, ms=50, context=window) {
        let to;
        let wait = false;
        return (...args) => {
            let later = () => fn.apply(context, args);
            if (!wait) {
                later();
                wait = true;
                to = setTimeout(() => wait = false, ms);
            }
        };
    }

    Array.from(
        document.getElementsByClassName('hnuser')
    ).forEach(
        l => l.onmouseover = throttle(() => showKarma(l), 5000)
    );

})();
