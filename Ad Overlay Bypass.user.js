// ==UserScript==
// @name         Ad Overlay Bypass
// @namespace    https://brbsix.github.io/
// @version      0.1
// @author       Brian Beffa <brbsix@gmail.com>
// @description  Bypass ad overlays found on some mature video hosts
// @match        http://www.gameofporn.net/video/*
// @match        http://www.hclips.com/videos/*
// @match        http://www.yeptube.com/video/*
// @match        https://www.ceporn.net/video/*
// @updateURL    https://github.com/brbsix/userscripts.js/raw/master/Ad%20Overlay%20Bypass.user.js
// @grant        GM_log
// ==/UserScript==

(function () {
    'use strict';

    function log () {
        GM_log(...[arguments.length ? GM_info.script.name + ':' : GM_info.script.name, ...arguments]);
    }

    function hideAdOverlay () {
        const btnName = 'Close & Play';
        const btnSelector = new Map([
            ['www.ceporn.net', '#vad > div:nth-child(2) > div:nth-child(2)'],
            ['www.hclips.com', '.pl_adv1_c.ind_close'],
            ['www.gameofporn.net', '.video-banner-close-play'],
            ['www.yeptube.com', '.drt-spot-close-play']
        ]).get(window.location.host);

        if (typeof btnSelector === 'undefined') {
            throw new Error(`No selector for "${btnName}" button on the current host`);
        }

        const btn = document.querySelector(btnSelector);

        if (btn === null) {
            throw new Error(`"${btnName}" button was not found`);
        }

        log(`clicking "${btnName}" button`);
        btn.click();
    }

    log();

    hideAdOverlay();
})();
