// ==UserScript==
// @name         The Wall Street Journal Redirector
// @namespace    https://brbsix.github.io/
// @version      0.1
// @author       Brian Beffa <brbsix@gmail.com>
// @description  Bypass The Wall Street Journal paywall by redirecting to an archive of the page
// @match        http://www.wsj.com/articles/*
// @match        https://www.wsj.com/articles/*
// @icon         http://online.wsj.com/favicon.ico
// @updateURL    https://github.com/brbsix/userscripts.js/raw/master/The%20Wall%20Street%20Journal%20Redirector.user.js
// @connect      archive.is
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
    'use strict';

    function getMetaContent (name) {
        const metaTag = document.querySelector(`meta[name='${name}']`);

        return metaTag === null ? null : metaTag.content;
    }

    function log () {
        GM_log(...[arguments.length ? GM_info.script.name + ':' : GM_info.script.name, ...arguments]);
    }

    function openArchive (url = window.location.href) {
        const host = 'https://archive.is';

        const createArchiveLink = (action, searchParams) => {
            const newURL = new URL(action === undefined ? '' : [action, url].join('/'), host);
            if (typeof searchParams !== undefined) {
                newURL.search = new URLSearchParams(searchParams).toString();
            }
            return newURL.href;
        };

        GM_xmlhttpRequest({
            method: 'GET',
            url: createArchiveLink('timemap'),
            onload: function (response) {
                log(`opening archive of ${url}`);
                window.location.assign((() => {
                    if (response.status === 200) {
                        log('opening existing snapshot');
                        return createArchiveLink('timegate');
                    } else if (response.status === 404) {
                        log('creating snapshot');
                        return createArchiveLink(undefined, [['run', 1], ['url', url]]);
                    } else {
                        throw new Error('unknown response from host');
                    }
                })());
            }
        });
    }

    if (getMetaContent('article.template') !== 'full') {
        log('Wall Street Journal paywall detected');
        openArchive();
    }
})();
