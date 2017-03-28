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
// @grant        GM_unsafeWindow
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
    'use strict';

    function log () {
        GM_log(...[arguments.length ? GM_info.script.name + ':' : GM_info.script.name, ...arguments]);
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

    log('paywalled New York Times article detected');

    const redirectURL = new window.URL((() => {
        if (typeof unsafeWindow.NYTD.success_redirect_url === 'string') {
            log('obtaining article URL from unsafeWindow.NYTD.success_redirect_url');
            return unsafeWindow.NYTD.success_redirect_url;
        } else {
            log('manually obtaining article URL by parsing this page\'s search parameters');
            return new window.URL(window.location).searchParams.get('URI');
        }
    })());

    // strip away problematic parameters
    redirectURL.search = '';

    openArchive(redirectURL.href);
})();
