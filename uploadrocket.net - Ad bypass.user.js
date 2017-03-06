// ==UserScript==
// @name         uploadrocket.net - Ad bypass
// @namespace    https://brbsix.github.io/
// @version      0.1
// @author       Brian Beffa <brbsix@gmail.com>
// @description  Bypass the insidious ad technology used by uploadrocket.net
// @match        http://uploadrocket.net/*
// @match        http://uploadrocket.net/*
// @run-at       document-end
// @grant        GM_info
// @grant        GM_log
// ==/UserScript==

(function () {
    'use strict';

    function log (msg) {
        const scriptName = GM_info.script.name;

        if (arguments.length === 0) {
            GM_log(scriptName);
        } else {
            GM_log(scriptName + ':', msg);
        }
    }

    // click free download button
    const freeBtn = document.querySelector('input[type="submit"][name="method_isfree"]');
    if (freeBtn !== null) {
        log('clicking free download button');
        freeBtn.click();
        return;
    }

    // scroll to bottom of page for captcha entry
    const captchaBtn = document.querySelector('input[type="submit"][id="btn_download"][value="Create link from captcha code"]');
    if (captchaBtn !== null) {
        log('scrolling to bottom of page for captcha entry');
        window.scrollTo(0, document.body.scrollHeight);

        const solverInput = document.querySelector('input[type="text"][name="adcopy_response"][id="adcopy_response"]');
        if (solverInput !== null) {
            log('focusing on Solve Media captcha input');
            solverInput.focus();
        }
        return;
    }

    // automatically begin download
    const directLink = Array.from(document.querySelectorAll('a[href*="/d/"]')).find(function (l) {
        return l.textContent === 'Direct Download Link (No ads)';
    });
    if (typeof directLink !== 'undefined') {
        log('clicking direct download link');
        window.location.replace(directLink.href);
        return;
    }

})();
