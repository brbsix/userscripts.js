// ==UserScript==
// @name         APKMirror Downloader
// @namespace    https://brbsix.github.io/
// @version      0.1
// @author       Brian Beffa <brbsix@gmail.com>
// @description  Automatically click the download button on APKMirror
// @match        http://www.apkmirror.com/apk/*
// @match        https://www.apkmirror.com/apk/*
// @match        http://www.apkmirror.com/?p=*
// @match        https://www.apkmirror.com/?p=*
// @icon         https://www.apkmirror.com/favicon.ico
// @updateURL    https://raw.githubusercontent.com/brbsix/userscripts.js/master/APKMirror%20Downloader.meta.js
// @downloadURL  https://raw.githubusercontent.com/brbsix/userscripts.js/master/APKMirror%20Downloader.user.js
// @grant        GM_log
// ==/UserScript==

(function () {
    'use strict';

    function log () {
        GM_log(...[arguments.length ? GM_info.script.name + ':' : GM_info.script.name, ...arguments]);
    }

    const downloadButton = document.querySelector('.downloadButton[type="button"]');
    if (downloadButton !== null) {
        log('clicking download button');
        downloadButton.click();
    }
})();
