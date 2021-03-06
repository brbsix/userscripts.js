/* global nd, overlib, pThrottle */
// ==UserScript==
// @name         RARBG: Add Magnet Links
// @namespace    https://brbsix.github.io/
// @version      0.1
// @author       Brian Beffa <brbsix@gmail.com>
// @description  Add small magnet links to search results
// @match        http://rarbg.to/*
// @match        https://rarbg.to/*
// @icon         http://www.rarbg.to/favicon.ico
// @require      https://wzrd.in/standalone/p-throttle@2.0.0#sha512=847ce710d42e6b8d9aeddafd2526a56e0fae69c350d6bdc5628d105a5201590238bccf84e554d635660ae9f29e7f84f0bbbccad03350c685a2b79c545e529bd4
// @updateURL    https://raw.githubusercontent.com/brbsix/userscripts.js/master/RARBG:%20Add%20Magnet%20Links.meta.js
// @downloadURL  https://raw.githubusercontent.com/brbsix/userscripts.js/master/RARBG:%20Add%20Magnet%20Links.user.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function () {
    'use strict';

    const options = {
        cache: true,
        hover: true
    };

    function createDOM (html) {
        return new DOMParser().parseFromString(html, 'text/html');
    }

    function createMagnetLink (href) {
        const magnetElement = document.createElement('a');
        magnetElement.href = href;
        magnetElement.onmouseover = () => overlib('Magnet link.');
        magnetElement.onmouseout = () => nd();

        const iconElement = document.createElement('i');
        iconElement.className = 'mgicon';

        magnetElement.appendChild(iconElement);

        return magnetElement;
    }

    function findMagnetHref (doc) {
        const magnetElementFound = doc.querySelector('a[href^="magnet:"]');

        return magnetElementFound === null ? null : magnetElementFound.href;
    }

    function insertMagnetLink (torrentLink, magnetHref) {
        torrentLink.after(createMagnetLink(magnetHref));
    }

    function processMagnetLink (torrentLink) {
        const url = torrentLink.href;

        log(`fetching ${url}`);
        return fetch(url, {
                credentials: 'include'
            })
            .then(response => response.text())
            .then(html => {
                log(`attempting to scrape magnet link from HTML of ${url}`);
                const insertHref = (magnetHref, source) => {
                    if (options.cache) {
                        log(`storing magnet link of ${url} in cache`);
                        GM_setValue(url, magnetHref);
                    }
                    insertMagnetLink(torrentLink, magnetHref);
                    const elapsed = parseFloat(Math.round((performance.now() - window.start_times[torrentLink]) * 100) / 100).toFixed(2);
                    log(`successfully scraped magnet link from ${source} of ${url} in ${elapsed} milliseconds`);
                };
                const responsePage = createDOM(html);
                const magnetHrefFromHtml = findMagnetHref(responsePage);
                if (magnetHrefFromHtml !== null) {
                    insertHref(magnetHrefFromHtml, 'HTML');
                    return;
                }

                log(`attempting to scrape magnet link from ${url} in a new window`);
                const responseWindow = open(
                    url,
                    '_blank',
                    'menubar=no,resizable=no,scrollbars=no,status=no,toolbar=no,visible=none,height=100,width=100,left=10000,top=10000',
                    false
                );
                responseWindow.onload = function () {
                    log(`${url} window finished loading`);
                    const magnetHrefFromWindow = findMagnetHref(responseWindow.document);
                    responseWindow.close();
                    if (magnetHrefFromWindow !== null) {
                        insertHref(magnetHrefFromWindow, 'new window');
                        return;
                    } else {
                        // If RARBG detects abnormal activity from your IP, they may
                        // temporarily block you (from automated requests at least)
                        // by serving you their "Threat Defense" page. Here, we
                        // differentiate between being unable to find the magnet link
                        // because the request was blocked and being unable to find it
                        // for any other reason (e.g. it was simply not on the page).
                        throw new Error((html.indexOf('/threat_defence.php?') !== -1 ? 'host has blocked attempt' : 'failed') + ` to scrape magnet link from ${url}`);
                    }
                };
            });
    }

    function log () {
        console.log(...['[' + new Date().toISOString().replace(/T/, ' ').replace(/Z/, '') + ']', ...arguments]);
    }

    // only continue if page has torrent links that we're interested in
    if (document.getElementsByClassName('lista2t').length === 0) {
        log('no torrent links on this page');
        return;
    }

    log('adding magnet links', `${options.hover ? 'on hover' : ''}`);

    GM_addStyle(`
        .mgicon {
            background-image: url("https://dyncdn.me/static/20/img/magnet.gif");
            display: inline-block;
            height: 12px;
            width: 12px;
            margin-left: 3px;
        }
    `);

    // store start time in order to calculate elapsed time
    window.start_times = {};

    // limit requests to 10 per second
    const rateLimiter = pThrottle(processMagnetLink, 10, 1000);

    Array.from(
        document.querySelectorAll('a[href^="/torrent/"]')
    ).filter(
        l => l.text !== '' && l.href.indexOf('#') === -1
    ).forEach(
        l => {
            const run = () => {
                if (options.cache) {
                    const url = l.href;
                    const magnetHref = GM_getValue(url);
                    if (typeof magnetHref !== 'undefined') {
                        log(`retrieved magnet link of ${url} from cache`);
                        insertMagnetLink(l, magnetHref);
                        return;
                    }
                }

                window.start_times[l] = performance.now();
                rateLimiter(l);
            };

            if (options.hover) {
                l.onmouseenter = () => {
                    l.onmouseenter = undefined;
                    run();
                };
            } else {
                run();
            }
        }
    );

})();
