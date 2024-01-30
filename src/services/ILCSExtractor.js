import { TITLE, HREF, TOPIC, TOKEN, NL } from '../constants/strings.js';
import { ENTIRE_ACT_LINK } from './constants/strings.js';

export function getILCSIndexString(ulChildren) {
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

export function getILCSAct(pChildren) {
    let actText = '';

    for (const pChild of pChildren) {
        if (pChild.tagName === 'TABLE') {
            actText += pChild.innerText + TOKEN;
        }
    }

    return actText;
}

export function hasEntireAct(aNodes) {
    let href = '';
    for (const aNode of aNodes) {
        if (aNode.innerText.toLowerCase().includes(ENTIRE_ACT_LINK)) {
            href = aNode.href;
            break;
        }
    }
    return href;
}