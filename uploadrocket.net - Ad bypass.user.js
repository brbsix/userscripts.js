// ==UserScript==
// @name         uploadrocket.net - Ad bypass
// @namespace    https://brbsix.github.io/
// @version      0.1
// @author       Brian Beffa <brbsix@gmail.com>
// @description  Bypass the insidious ad technology used by uploadrocket.net
// @match        http://uploadrocket.net/*
// @match        http://uploadrocket.net/*
// @icon         http://uploadrocket.net/favicon.ico
// @updateURL    https://raw.githubusercontent.com/brbsix/userscripts.js/master/uploadrocket.net%20-%20Ad%20bypass%20(with%20inline%20scripts%20blocked).meta.js
// @downloadURL  https://raw.githubusercontent.com/brbsix/userscripts.js/master/uploadrocket.net%20-%20Ad%20bypass%20(with%20inline%20scripts%20blocked).user.js
// @grant        GM_addStyle
// @grant        GM_log
// @grant        GM_setClipboard
// @grant        GM_unsafeWindow
// ==/UserScript==

(function () {
    'use strict';

    function log () {
        GM_log(...[arguments.length ? GM_info.script.name + ':' : GM_info.script.name, ...arguments]);
    }

    // defuse Ad Maven
    // https://github.com/AdguardTeam/AdguardFilters/blob/master/EnglishFilter/sections/general_extensions.txt)
    // https://forum.adguard.com/index.php?threads/resolved-onwatchseries-to.18912/
    Object.defineProperties(unsafeWindow, {
        admvpu: {
            get: function() {
                log('something attempted to access window.admvpu');
            },
            set: function(value) {
                if (typeof value === 'function') {
                    log('something attempted to set window.admvpu to a function');
                    throw new Error();
                } else {
                    log('something attempted to set window.admvpu to something other than a function');
                }
            }
        },
        Fingerprint2: {
            get: function() {
                log('something attempted to access window.Fingerprint2');
            },
            set: function() {
                log('something attempted to set window.Fingerprint2');
                throw new Error();
            }
        }
    });

    // defuse window.open
    Object.defineProperty(unsafeWindow, 'open', {
        get: function () {
            log('something attempted to access window.open');
            return function (url) {
                log(`window.open blocked an attempt to open ${url}`);
                return new Proxy({}, {
                    get: function(target, name) {
                        log(`dummy window logged access to property '${name}'`);
                    },
                    set: function(target, name, value) {
                        log(`dummy window logged setting of property '${name}' to ${value}`);
                    }
                });
            };
        },
        set: function () {
            log('something attempted to redefine window.open');
        }
    });

    // defuse document.onclick
    // https://forum.adguard.com/index.php?threads/resolved-uploadrocket-net.12845/
    Object.defineProperty(document, 'onclick', {
        get: function () {
            log('attempting to access to value of document.onclick');
        }
    });

    // hide glasstop overlay (normally performed by breakglass() upon click)
    log('editing style sheet to hide glasstop overlay');
    GM_addStyle('#glasstop { display: none; }');

    // click free download button (1st page)
    const freeBtn = document.querySelector('input[type="submit"][name="method_isfree"]');
    if (freeBtn !== null) {
        log('clicking free download button');
        freeBtn.click();
        return;
    }

    // assist with captcha (2nd page)
    const captchaBtn = document.querySelector('input[type="submit"][id="btn_download"][value="Create link from captcha code"]');
    if (captchaBtn !== null) {

        const premiumJunk = document.querySelector('div[style="z-index:2001;position:relative;font-size: 24px;"]');
        if (premiumJunk !== null) {
            log('removing premium upsell');
            premiumJunk.style.display = 'none';
        }

        const blogJunk = document.querySelector('table.file_slot');
        if (blogJunk !== null) {
            log('removing blog entries on captcha entry page');
            blogJunk.style.display = 'none';
        }

        log('scrolling to bottom of page for captcha entry');
        window.scrollTo(0, document.body.scrollHeight);

        // this isn't particularly reliable
        const solverBtn = document.querySelector('#play_button');
        if (solverBtn !== null) {
            log('clicking play button on Solve Media captcha');
            solverBtn.click();
        }

        const solverInput = document.querySelector('input[type="text"][name="adcopy_response"][id="adcopy_response"]');
        if (solverInput !== null) {
            log('focusing on Solve Media captcha input');
            solverInput.focus();
        }

        return;
    }

    // assist with download (3rd page)
    const directLink = Array.from(document.querySelectorAll('a[href*="/d/"]')).find(function (l) {
        return l.textContent === 'Direct Download Link (No ads)';
    });
    if (typeof directLink !== 'undefined') {
        const headerJunk = document.querySelector('table.file_slot:nth-of-type(1)');
        if (headerJunk !== null) {
            log('removing annoying header on download page');
            headerJunk.style.display = 'none';
        }

        const blogJunk = document.querySelector('table.file_slot:nth-of-type(3)');
        if (blogJunk !== null) {
            log('removing blog entries on download page');
            blogJunk.style.display = 'none';
        }

        const premiumBtn = document.querySelector('input[type="submit"][name="method_ispremium"][value="Premium Download"]');
        if (premiumBtn !== null) {
            log('removing premium download button on download page');
            premiumBtn.parentElement.parentElement.style.display = 'none';

            const spacerElement = document.querySelector('td[style="width:5%;"]');
            if (spacerElement !== null) {
                log('removing spacer element on download page');
                spacerElement.style.display = 'none';
            }
        }

        log('copying direct download link to clipboard');
        GM_setClipboard(directLink.href);

        return;
    }

})();
