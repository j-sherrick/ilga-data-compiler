/**
 * @module ILCSExtractor
 * 
 * @description This module exports functions that extract data from the HTML of the Illinois Compiled Statutes (ILCS) website.
 * These functions are used by the `ILCSCrawler` class to parse the crawled data.
 * 
 * The exported functions include:
 * - `getILCSIndexString(ulChildren, TITLE, HREF, TOPIC, NL)`: Takes an array of HTML elements representing the children of a UL element, and constants for title, href, topic, and newline. Returns a string representing the index of ILCS chapters.
 * - `getILCSAct(pChildren, TOKEN)`: Takes an array of HTML elements representing the children of a P element, and a token constant. Returns a string representing the text of an ILCS act.
 * 
 * @example
 * import { getILCSIndexString, getILCSAct } from './ILCSExtractor.js';
 * 
 * let ulChildren = document.querySelector('ul').children;
 * let pChildren = document.querySelector('p').children;
 * 
 * let indexString = getILCSIndexString(ulChildren, 'TITLE: ', 'HREF: ', 'TOPIC: ', '\n');
 * let actText = getILCSAct(pChildren, 'TOKEN');
 * 
 * console.log(indexString);
 * console.log(actText);
 */

import { TITLE, HREF, TOPIC, TOKEN, NL } from './constants/strings.js';
import { ENTIRE_ACT_LINK } from './constants/strings.js';

export function getILCSIndexString(ulChildren, TITLE, HREF, TOPIC, NL) {
    let chapterIndexString  = '';
    let currentTopic = '';
    for(const ulChild of ulChildren) {
        if ((ulChild.tagName === 'DIV' || ulChild.tagName === 'P') && ulChild.innerText !== '') {
            // trim() is always called on the innerText String to remove unexpected newlines
            currentTopic = ulChild.innerText.trim();
        }
        else if (ulChild.tagName === 'LI' && ulChild.innerText !== '') {
            chapterIndexString += TITLE + ulChild.innerText.trim() + NL;
            chapterIndexString += TOPIC + currentTopic + NL;
            chapterIndexString += HREF + ulChild.querySelector('a').href + NL + NL;
        }
    }

    return chapterIndexString;
}

export function getILCSAct(pChildren, TOKEN) {
    let actText = '';

    for (const pChild of pChildren) {
        if (pChild.tagName === 'TABLE') {
            actText += pChild.innerText + TOKEN;
        }
    }

    return actText;
}

export function hasEntireAct(aNodes, ENTIRE_ACT_LINK) {
    let href = '';
    for (const aNode of aNodes) {
        if (aNode.innerText.toLowerCase().includes(ENTIRE_ACT_LINK)) {
            href = aNode.href;
            break;
        }
    }
    return href;
}