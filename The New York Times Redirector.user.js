// ==UserScript==
// @name         The New York Times Redirector
// @namespace    https://brbsix.github.io/
// @version      0.1
// @author       Brian Beffa <brbsix@gmail.com>
// @description  Bypass The New York Times paywall by redirecting to an archive of the page
// @match        https://myaccount.nytimes.com/auth/login?URI=*
// @connect      archive.is
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    const TM_DEBUG = 1;

    function debug(msg) {
        if (TM_DEBUG) {
            console.log('Tampermonkey: ' + msg);
        }
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

    debug('detects paywalled NYT article');
    getArchive(new URLSearchParams(window.location.search.substring(1)).get('URI').split('?')[0]);
})();
