/* global moment */
// ==UserScript==
// @name         Hacker News - date tooltips
// @namespace    https://brbsix.github.io/
// @version      0.1
// @author       Brian Beffa <brbsix@gmail.com>
// @description  Show absolute dates via tooltip
// @match        https://news.ycombinator.com/*
// @icon         https://news.ycombinator.com/favicon.ico
// @require      https://momentjs.com/downloads/moment.min.js#sha512=1bd75f089146df2fd7abc99b6ea6f98b7150355686974164930f953d54f72f4d2003893b8728d218da40c72930803c3571f245963e6d3b75de3daf9ece30d0c9
// @updateURL    https://github.com/brbsix/userscripts.js/raw/master/Hacker%20News%20-%20date%20tooltips.user.js
// @grant        GM_log
// ==/UserScript==

(function () {
    'use strict';

    // inspired by https://greasyfork.org/en/scripts/23432-hacker-news-date-tooltips

    const url = new URL(window.location.href);

    if (url.pathname === '/user') {
        const username = url.searchParams.get('id');
        if (username === null) {
            throw new Error('unable to determine username');
        }

        const dateElement = Array.from(
            document.querySelectorAll('td[valign="top"]')
        ).filter(
            e => e.textContent === 'created:'
        ).map(
            e => e.nextElementSibling
        ).pop();
        if (typeof dateElement === 'undefined') {
            throw new Error(`unable to find 'created:' element`);
        }

        fetch(`https://hacker-news.firebaseio.com/v0/user/${username}/created.json`)
        .then(response => response.json())
        .then(created => {
            const dateString = moment(created * 1000).format('LL');
            dateElement.title = dateString;
        });
    } else {
        Array.from(
            document.querySelectorAll('.age a')
        ).forEach(
            dateElement => {
                const ago = dateElement.textContent;
                const match = ago.match(/^(\d+) (\w+) ago$/);
                if (match !== null) {
                    const timeDelta = match[1];
                    const timeUnit = match[2];
                    const dateString = moment().subtract(timeUnit, timeDelta).format('LL');
                    dateElement.title = dateString;
                }
            }
        );
    }

})();
