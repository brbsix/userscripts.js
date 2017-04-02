// ==UserScript==
// @name         The New York Times Redirector
// @namespace    https://brbsix.github.io/
// @version      0.1
// @author       Brian Beffa <brbsix@gmail.com>
// @description  Bypass The New York Times paywall by redirecting to an archive of the page
// @match        https://myaccount.nytimes.com/auth/login?URI=*
// @icon         http://www.nytimes.com/favicon.ico
// @updateURL    https://github.com/brbsix/userscripts.js/raw/master/The%20New%20York%20Times%20Redirector.user.js
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

    log('New York Times paywall detected');

    openArchive((() => {
        const dirtyURL = new window.URL((() => {
            // NYTD will most likely not be ready by the time this script
            // executes, in which case we don't want to wait around for it
            // and can instead parse the redirect URL out of the search
            // parameters of the current page
            if (typeof unsafeWindow.NYTD !== 'undefined' && typeof unsafeWindow.NYTD.success_redirect_url === 'string') {
                log('obtaining article URL from NYTD.success_redirect_url');
                return unsafeWindow.NYTD.success_redirect_url;
            } else {
                log('manually obtaining article URL by parsing this page\'s search parameters');
                return new window.URL(window.location).searchParams.get('URI');
            }
        })());

        // strip parameters
        dirtyURL.search = '';

        return dirtyURL.href;
    })());
})();
