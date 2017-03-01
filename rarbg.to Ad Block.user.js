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

    function isObject(object) {
            return typeof object === 'object';
    }

    function log(msg) {
        if (msg) {
            GM_log(scriptName + ':', msg);
        } else {
            GM_log(scriptName);
        }
    }

    log();

    // Most of rarbg's popunder code is defined in:
    // https://dyncdn.me/static/20/js/expla5.js
    //
    // This is where _wm is initialized. Other ad-related scripts also
    // utilize it, so we want to prevent it from being used. However if
    // it is undefined, the site assumes that some sort of ad blocker is
    // in use and responds accordingly. To get around this, we can set
    // it to an empty object literal.
    //
    // NOTE: ensure expla5.js is not blocked by other ad-blocking software
    try {
        if (typeof _wm === 'object') {
            log('overwriting _wm');
            _wm = {};
        } else {
            log('_wm is not an object');
        }
    } catch (e) {
        log('error checking _wm');
    }

    // overwrite the popunder configuration (probably not necessary)
    try {
        if (typeof _wm_settings === 'object') {
            log('overwriting _wm_settings');
            _wm_settings = {};
        } else {
            log('_wm_settings is not an object');
        }
    } catch (e) {
        log('error checking _wm_settings');
    }
})();
