// ==UserScript==
// @name         The Wall Street Journal Redirector
// @namespace    https://brbsix.github.io/
// @version      0.1
// @author       Brian Beffa <brbsix@gmail.com>
// @description  Bypass The Wall Street Journal paywall by redirecting to an archive of the page
// @match        http://www.wsj.com/articles/*
// @connect      archive.is
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    var TM_DEBUG = 1;

    function debug(msg) {
        if (TM_DEBUG) {
            console.log('Tampermonkey: ' + msg);
        }
    }

    function getMetaContent(name) {
        return document.querySelector(`meta[name='${name}']`).content;
    }

    function getArchive(url) {
        const host = 'https://archive.is';

        GM_xmlhttpRequest({
            method: 'GET',
            url: host + '/timemap/' + url,
            onload: function(response) {
                debug('response.readyState: ' + response.readyState);
                debug('response.responseHeaders: ' + response.responseHeaders);
                debug('response.responseText: ' + response.responseText);
                debug('response.status: ' + response.status);
                debug('response.statusText: ' + response.statusText);
                if (response.status === 200) {
                    debug('opening existing snapshot');
                    location.assign(host + '/timegate/' + url);
                } else if (response.status === 404) {
                    debug('creating snapshot');
                    location.assign(host + '/?run=1&url=' + encodeURIComponent(url));
                }
            }
        });
    }

    if (getMetaContent('article.template') !== 'full') {
        debug('detects paywalled WSJ article');
        getArchive(window.location.href);
    }
})();
