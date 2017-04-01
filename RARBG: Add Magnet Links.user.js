/* global Bottleneck, nd, overlib */
// ==UserScript==
// @name         RARBG: Add Magnet Links
// @namespace    https://brbsix.github.io/
// @version      0.1
// @author       Brian Beffa <brbsix@gmail.com>
// @description  Add small magnet links to search results
// @match        http://rarbg.to/*
// @match        https://rarbg.to/*
// @icon         http://www.rarbg.to/favicon.ico
// @require      https://raw.githubusercontent.com/SGrondin/bottleneck/master/bottleneck.min.js#sha512=7f7dabb273e521f495e67e506683697604cccc8cb50f5ae3a7f302eb3cbdbb571637bf8cbc73eab6bf6ba907026ae2e732ee823d9ea677b0826b202b51434272
// @updateURL    https://github.com/brbsix/userscripts.js/raw/master/RARBG:%20Add%20Magnet%20Links.user.js
// @run-at       document-end
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    function createDOM (html) {
        return new DOMParser().parseFromString(html, 'text/html');
    }

    function createMagnetLink (href) {
        const magnetElement = document.createElement('a');
        magnetElement.className = 'magnet';
        magnetElement.href = href;
        magnetElement.onmouseover = () => overlib('Magnet link.');
        magnetElement.onmouseout = () => nd();

        const imgElement = document.createElement('img');
        imgElement.src = 'data:image/png;base64,R0lGODlhDAAMALMPAOXl5ewvErW1tebm5oocDkVFRePj47a2ts0WAOTk5MwVAIkcDesuEs0VAEZGRv///yH5BAEAAA8ALAAAAAAMAAwAAARB8MnnqpuzroZYzQvSNMroUeFIjornbK1mVkRzUgQSyPfbFi/dBRdzCAyJoTFhcBQOiYHyAABUDsiCxAFNWj6UbwQAOw==';

        magnetElement.appendChild(imgElement);

        return magnetElement;
    }

    function findMagnetHref (doc) {
        const magnetElementFound = doc.querySelector('a[href^="magnet:"]');

        return magnetElementFound === null ? null : magnetElementFound.href;
    }

    function insertMagnetLink (torrentLink) {
        const url = torrentLink.href;

        return fetch(url, {
                credentials: 'include'
            })
            .then(response => response.text())
            .then(html => {
                log(`attempting to scrape magnet link from HTML of ${url}`);
                const insertHref = (magnetHref, source) => {
                    torrentLink.after(createMagnetLink(magnetHref));
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
        return;
    }

    log('adding magnet links on hover');

    GM_addStyle('.magnet { margin-left: 3px; }');

    // store start time in order to calculate elapsed time
    window.start_times = {};

    // limit requests to 10 per second
    const rateLimiter = new Bottleneck(1, 100);

    Array.from(
        document.querySelectorAll('a[href^="/torrent/"]')
    ).filter(
        l => l.text !== '' && l.href.indexOf('#') === -1
    ).forEach(
        l => l.onmouseenter = () => {
            l.onmouseenter = undefined;
            window.start_times[l] = performance.now();
            rateLimiter.schedule(insertMagnetLink, l);
        }
    );

})();
