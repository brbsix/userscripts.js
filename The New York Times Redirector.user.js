// ==UserScript==
// @name         The New York Times Redirector
// @namespace    https://brbsix.github.io/
// @version      0.1
// @description  Bypass The New York Times paywall by redirecting to an archive of the page
// @author       Brian Beffa <brbsix@gmail.com>
// @match        https://myaccount.nytimes.com/auth/login?URI=*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    location.replace('https://archive.is/?run=1&url=' + encodeURIComponent(new URLSearchParams(location.search.substring(1)).get('URI').split('?')[0]));
})();
