// ==UserScript==
// @name         The Wall Street Journal Redirector
// @namespace    https://brbsix.github.io/
// @version      0.1
// @author       Brian Beffa <brbsix@gmail.com>
// @description  Bypass The Wall Street Journal paywall by redirecting to an archive of the page
// @match        http://www.wsj.com/articles/*
// @match        https://www.wsj.com/articles/*
// @connect      archive.is
// @grant        GM_info
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
    'use strict';

    function log (msg) {
        const scriptName = GM_info.script.name;

        if (arguments.length === 0) {
            GM_log(scriptName);
        } else {
            GM_log(scriptName + ':', msg);
        }
    }

    function openArchive (url = window.location.href) {
        const host = 'https://archive.is';

        GM_xmlhttpRequest({
            method: 'GET',
            url: new window.URL(['timemap', url].join('/'), host).href,
            onload: function (response) {
                let archiveURL;
                log(`opening archive of ${url}`);
                if (response.status === 200) {
                    log('opening existing snapshot');
                    archiveURL = new window.URL(['timegate', url].join('/'), host);
                } else if (response.status === 404) {
                    log('creating snapshot');
                    archiveURL = new window.URL(host);
                    archiveURL.searchParams.set('run', '1');
                    archiveURL.searchParams.set('url', url);
                }
                window.location.assign(archiveURL.href);
            }
        });
    }

    function getMetaContent (name) {
        return document.querySelector(`meta[name='${name}']`).content;
    }

    if (getMetaContent('article.template') !== 'full') {
        log('detects paywalled WSJ article');
        openArchive();
    }
})();
