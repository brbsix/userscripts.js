/* global Bottleneck, nd, overlib */
// ==UserScript==
// @name         RARBG: Add Magnet Links
// @namespace    https://brbsix.github.io/
// @version      0.1
// @author       Brian Beffa <brbsix@gmail.com>
// @description  Add small magnet links to search results
// @match        http://rarbg.to/torrents.php?search=*
// @match        https://rarbg.to/torrents.php?search=*
// @icon         http://www.rarbg.to/favicon.ico
// @require      https://raw.githubusercontent.com/SGrondin/bottleneck/master/bottleneck.min.js
// @run-at       document-end
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    function createMagnetLink (href) {
        const magnetElement = document.createElement('a');
        magnetElement.className = 'magnet';
        magnetElement.href = href;
        magnetElement.onmouseover = function () {
            return overlib('Magnet link.');
        };
        magnetElement.onmouseout = function () {
            return nd();
        };

        const imgElement = document.createElement('img');
        imgElement.src = 'data:image/png;base64,R0lGODlhDAAMALMPAOXl5ewvErW1tebm5oocDkVFRePj47a2ts0WAOTk5MwVAIkcDesuEs0VAEZGRv///yH5BAEAAA8ALAAAAAAMAAwAAARB8MnnqpuzroZYzQvSNMroUeFIjornbK1mVkRzUgQSyPfbFi/dBRdzCAyJoTFhcBQOiYHyAABUDsiCxAFNWj6UbwQAOw==';

        magnetElement.appendChild(imgElement);

        return magnetElement;
    }

    function findMagnetHref (html) {
        const responsePage = document.createElement('html');
        responsePage.innerHTML = html;

        const magnetElementFound = responsePage.querySelector('a[href^="magnet:"]');

        return magnetElementFound === null ? null : magnetElementFound.href;
    }

    function insertMagnetLink (torrentLink) {
        const url = torrentLink.href;

        return fetch(url, {
                credentials: 'include'
            })
            .then(response => response.text())
            .then(function (html) {
                log(`inserting magnet link for ${url}`);

                const magnetHref = findMagnetHref(html);

                if (magnetHref === null) {
                    throw new Error((html.indexOf('/threat_defence.php?') !== -1 ? 'host has blocked attempt' : 'failed') + ` to scrape magnet link from ${url}`);
                }

                torrentLink.after(createMagnetLink(magnetHref));
            });
    }

    function log () {
        console.log(...['[' + new Date().toISOString().replace(/T/, ' ').replace(/Z/, '') + ']', ...arguments]);
    }

    GM_addStyle('.magnet { margin-left: 3px; }');

    // limit requests to 10 per second
    const rateLimiter = new Bottleneck(1, 100);

    Array.from(
        document.querySelectorAll('a[href^="/torrent/"]')
    ).filter(
        l => l.text !== '' && l.href.indexOf('#') === -1
    ).forEach(
        l => rateLimiter.schedule(insertMagnetLink, l)
    );

})();
