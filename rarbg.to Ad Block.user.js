// ==UserScript==
// @name         rarbg.to Ad Block
// @namespace    https://brbsix.github.io/
// @version      0.1
// @author       Brian Beffa <brbsix@gmail.com>
// @description  Block nasty popunder ads on rarbg.to
// @match        https://rarbg.to/*
// @grant        GM_info
// @grant        GM_log
// ==/UserScript==

(function() {
    'use strict';

    const scriptName = GM_info.script.name;

    function log(msg) {
        if (msg) {
            GM_log(scriptName + ':', msg);
        } else {
            GM_log(scriptName);
        }
    }

    log();

    // _wm is initialized in https://dyncdn.me/static/20/js/expla5.js, where
    // most of the popunder code is handled. _wm is used by other ad-related
    // scripts also, so we want to prevent it from being used. The site checks
    // whether _wm is undefined in order to determine if an ad blocker is being
    // used, so all that we have to do is set it to something else (e.g. null).
    _wm = null;
})();
