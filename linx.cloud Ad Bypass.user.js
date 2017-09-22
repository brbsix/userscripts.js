// ==UserScript==
// @name         linx.cloud Ad Bypass
// @namespace    https://brbsix.github.io/
// @version      0.1
// @author       Brian Beffa <brbsix@gmail.com>
// @description  Bypass the insidious ad technology used by linx.cloud
// @match        http://linx.cloud/*
// @match        https://linx.cloud/*
// @updateURL    https://raw.githubusercontent.com/brbsix/userscripts.js/master/linx.cloud%20Ad%20Bypass.meta.js
// @downloadURL  https://raw.githubusercontent.com/brbsix/userscripts.js/master/linx.cloud%20Ad%20Bypass.user.js
// @grant        GM_log
// ==/UserScript==

(function () {
    'use strict';

    // Ensure the following lines are added to your uBlock filters:
    // ||linx.cloud/ajax.php
    // linx.cloud##script:inject(noeval.js)

    function log () {
        GM_log(...[arguments.length ? GM_info.script.name + ':' : GM_info.script.name, ...arguments]);
    }

    function hide (selector) {
        Array.from(
            document.querySelectorAll(selector)
        ).forEach(
            e => {
                e.style.display = 'none';
            }
        );
    }

    // show links
    document.getElementById('linx').style.left = '0px';

    // hide button
    document.getElementById('wtd').style.display = 'none';

    // hides 3 "Loading..." placeholders
    log('hiding M270095Composite placeholders');
    hide('[id^="M270095Composite"]');

    // hides 2 placeholders
    log('hiding cloud placeholders');
    hide('.cloud-aftercontent');
    hide('.cloud-widget');

    // hides footer lines
    log('hiding entry footer');
    hide('.entry-footer');

})();
