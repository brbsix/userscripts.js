// ==UserScript==
// @name         uploadrocket.net - Ad bypass
// @namespace    https://brbsix.github.io/
// @version      0.1
// @author       Brian Beffa <brbsix@gmail.com>
// @description  Bypass the insidious ad technology used by uploadrocket.net
// @match        http://uploadrocket.net/*
// @match        https://uploadrocket.net/*
// @match        http://api.solvemedia.com/papi/media?*
// @match        https://api.solvemedia.com/papi/media?*
// @icon         http://uploadrocket.net/favicon.ico
// @updateURL    https://github.com/brbsix/userscripts.js/raw/master/uploadrocket.net%20-%20Ad%20bypass.user.js
// @grant        GM_addStyle
// @grant        GM_log
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_unsafeWindow
// ==/UserScript==

(function () {
    'use strict';

    const options = {
        clipboard: true,
        cookie: true,
        iframe: true,
        inline: true,
        notification: true,
        overlay: true,
        page1: true,
        page2: true,
        page3: true
    };

    function log () {
        GM_log(...[arguments.length ? GM_info.script.name + ':' : GM_info.script.name, ...arguments]);
    }

    // verify that inline scripts are disabled
    if (options.inline) {
        unsafeWindow.TM_inlineScripts = false;

        const newScript = document.createElement('script');
        newScript.type = 'text/javascript';
        newScript.textContent = 'TM_inlineScripts = true';
        document.head.appendChild(newScript);
        newScript.remove();

        if (unsafeWindow.TM_inlineScripts) {
            log('inline scripts do not appear to be disabled');
            log('please disable inline scripts on this page');
        } else {
            log('inline scripts appear to be disabled');
        }
    }

    // assist with captcha loaded in iframe
    if (options.iframe) {
        if (window.self === window.top) {
            log('the user script appears to be running in the top page');
            log(`page url is ${window.location.href}`);
        } else {
            log('the user script appears to be running in an iframe');
            log(`iframe url is ${window.location.href}`);

            // wait for captcha iframe to load before clicking play button
            window.onload = function () {
                log('Solve Media iframe received onload');
                const playBtn = document.querySelector('#playBtn');
                if (playBtn !== null) {
                    log('clicking play button on Solve Media iframe');
                    playBtn.click();
                }
            };

            const expandedInput = document.querySelector('input[id="adcopy-expanded-response"]');
            if (expandedInput !== null) {
                log('focusing on expanded Solve Media captcha input');
                expandedInput.focus();
            }

            // nothing more to do
            return;
        }
    }

    // set cookie sessionID (normally set in an inline script) in order to
    // disable anti-ablock tech (e.g. countdown and slow download speeds)
    if (options.cookie) {
        // manually set cookie sessionID (normally set in an inline script) to
        // disable anti-ablock tech (e.g. countdown and slow download speeds)
        // document.cookie = 'sessionID=a16516d61561d6511;domain=.uploadrocket.net;';

        Array.from(
            document.querySelectorAll('script:not([src])')
        ).find(
            (e) => {
                const matches = RegExp(' // NOd\n\\s*document\.cookie = "([^"]+)"').exec(e.innerHTML);
                if (matches !== null && matches.length === 2) {
                    const cookie = matches[1];
                    log(`setting document.cookie to '${cookie}'`);
                    document.cookie = cookie;
                    return true;
                }
            }
        );
    }

    // hide glasstop overlay (normally performed by breakglass() upon click)
    if (options.overlay) {
        log('editing style sheet to hide glasstop overlay');
        GM_addStyle('#glasstop { display: none; }');
    }

    // click free download button (1st page)
    if (options.page1) {
        const freeBtn = document.querySelector('input[type="submit"][name="method_isfree"]');
        if (freeBtn !== null) {
            log('clicking free download button');
            freeBtn.click();
            return;
        }
    }

    // assist with captcha (2nd page)
    if (options.page2) {
        const captchaBtn = document.querySelector('input[type="submit"][id="btn_download"][value="Create link from captcha code"]');
        if (captchaBtn !== null) {
            // configure Solve Media captcha
            unsafeWindow.ACPuzzleOptions = {
                theme: 'white',
                size: ''
            };

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
    }

    // assist with download (3rd page)
    if (options.page3) {
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

                const spacerElement = document.querySelector('tr:nth-child(4) > td[style="width:5%;"]');
                if (spacerElement !== null) {
                    log('inserting spacer element on download page');
                    const newSpacerElement = document.createElement('td');
                    newSpacerElement.style.width = '5%';
                    spacerElement.nextElementSibling.after(newSpacerElement);
                }
            }

            if (options.clipboard) {
                const directHref = directLink.href;
                log('copying direct download link to clipboard');
                GM_setClipboard(directHref);
                if (options.notification) {
                    GM_notification(
                        'Direct download link in clipboard',
                        directHref.split('/').pop().split('#')[0].split('?')[0],
                        GM_info.script.icon
                    );
                }
            }

            return;
        }
    }

})();
