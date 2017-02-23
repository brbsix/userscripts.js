// ==UserScript==
// @name         The New York Times Redirector
// @namespace    https://brbsix.github.io/
// @version      0.1
// @author       Brian Beffa <brbsix@gmail.com>
// @description  Bypass The New York Times paywall by redirecting to an archive of the page
// @match        https://myaccount.nytimes.com/auth/login?URI=*
// @connect      archive.is
// @run-at       document-start
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

    function log(msg) {
        if (msg) {
            GM_log(scriptName + ':', msg);
        } else {
            GM_log(scriptName);
        }
    }

    log('detects paywalled NYT article');
    getArchive(new URLSearchParams(window.location.search.substring(1)).get('URI').split('?')[0]);
})();
