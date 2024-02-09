/**
 * @module ILCSExtractor
 * 
 * @description This module exports functions that extract data from the HTML of the Illinois Compiled Statutes (ILCS) website.
 * These functions are used by the `ILCSCrawler` class to parse the crawled data.
 */

import { TITLE, HREF, TOPIC, TOKEN, NL } from './constants/strings.js';
import { ENTIRE_ACT_LINK } from './constants/strings.js';

/**
 * This function is a pageFunction to be evaluated in the browser context by Puppeteer. It expects the result of a
 * querySelectorAll call on 'td ul *' selector, and returns a formatted string representing the index of ILCS chapters.
 * 
 * @param {Element[]} ulChildren children of a UL element that may contain a list of chapters or acts
 * @param {String} titleString string constant for formatting the title of a chapter or act
 * @param {String} urlString string constant for formatting the url to the page containing a chapter or act 
 * @param {String} topicString string constant for formatting the topic of a chapter or subtopic of an act.
 * @param {String} nlChar string constant for formatting a newline character
 * @returns {String} chapterIndexString - The formatted string representing a list index of ILCS chapters or acts.
 * 
 */
export function getILCSIndexString(ulChildren, titleString, urlString, topicString, nlChar) {
    let chapterIndexString  = '';
    let currentTopic = '';
    for(const ulChild of ulChildren) {
        if ((ulChild.tagName === 'DIV' || ulChild.tagName === 'P') && ulChild.innerText !== '') {
            // trim() is always called on the innerText String to remove unexpected newlines
            currentTopic = ulChild.innerText.trim();
        }
        else if (ulChild.tagName === 'LI' && ulChild.innerText !== '') {
            chapterIndexString += titleString + ulChild.innerText.trim() + nlChar;
            chapterIndexString += topicString + currentTopic + nlChar;
            chapterIndexString += urlString + ulChild.querySelector('a').href + nlChar + nlChar;
        }
    }

    return chapterIndexString;
}


/**
 * This function is a pageFunction to be evaluated in the browser context by Puppeteer. It expects the result of a
 * querySelectorAll call on 'td p *' selector on the appropriate page, and returns a string representing the entire text of an act.
 * Each section of the act is separated by the delimiter token.
 * 
 * @param {Element[]} pChildren the children of a P element that may contain a table of acts
 * @param {String} tokenString a string constant used as a delimiter token to separate acts 
 * @returns {String} actText - The formatted string representing the entire text of an act, with sections separated by tokenString
 */
export function getILCSAct(pChildren, tokenString) {
    let actText = '';

    for (const pChild of pChildren) {
        if (pChild.tagName === 'TABLE') {
            actText += pChild.innerText + tokenString;
        }
    }

    return actText;
}

/**
 * Some acts contain articles which are listed as links on the main page of the act. This function is a pageFunction that returns
 * the url of the 'View Entire Act' link, if it exists. It expects the result of a querySelectorAll call on 'td p a' selector on 
 * the appropriate page.
 * 
 * @param {Element[]} aNodes - an array of anchor elements that may contain a link to the entire act
 * @param {String} viewEntireAct - a string constant used to identify the link to the entire act 
 * @returns {String} href - the href attribute of the link to the entire act, or an empty string if the link is not found
 */
export function hasEntireAct(aNodes, viewEntireAct) {
    let href = '';
    for (const aNode of aNodes) {
        if (aNode.innerText.toLowerCase().includes(viewEntireAct)) {
            href = aNode.href;
            break;
        }
    }
    return href;
}