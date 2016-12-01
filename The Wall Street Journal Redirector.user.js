// ==UserScript==
// @name         The Wall Street Journal Redirector
// @namespace    https://brbsix.github.io/
// @version      0.1
// @description  Bypass The Wall Street Journal paywall by redirecting to an archive of the page
// @author       Brian Beffa <brbsix@gmail.com>
// @match        http://www.wsj.com/articles/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function getMetaContent(name) {
        return document.querySelector(`meta[name='${name}']`).content;
    }

    if (getMetaContent('article.access') !== 'free' || getMetaContent('article.template') !== 'full') {
        location.assign(`https://archive.is/?run=1&url=${location.href}`);
    }
})();
