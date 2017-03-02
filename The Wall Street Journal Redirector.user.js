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

(function() {
    'use strict';

    const scriptName = GM_info.script.name;

    function getArchive(url) {
        const host = 'https://archive.is';

        GM_xmlhttpRequest({
            method: 'GET',
            url: host + '/timemap/' + url,
            onload: function(response) {
                if (response.status === 200) {
                    log('opening existing snapshot');
                    location.assign(host + '/timegate/' + url);
                } else if (response.status === 404) {
                    log('creating snapshot');
                    location.assign(host + '/?run=1&url=' + encodeURIComponent(url));
                }
            }
        });
    }

    function getMetaContent(name) {
        return document.querySelector(`meta[name='${name}']`).content;
    }

    function log(msg) {
        if (msg) {
            GM_log(scriptName + ':', msg);
        } else {
            GM_log(scriptName);
        }
    }

    if (getMetaContent('article.template') !== 'full') {
        log('detects paywalled WSJ article');
        getArchive(window.location.href);
    }
})();
