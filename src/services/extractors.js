import { get } from "mongoose";

export const UL_CHILDREN = 'td ul > *';
export const P_CHILDREN = 'td p > *'
export const TD_P_ANCHORS = 'td p a';


export function getILCSIndexString(ulChildren) {
    let chapterIndexString  = '';
    let currentTopic = '';
    for(const ulChild of ulChildren) {
        if ((ulChild.tagName === 'DIV' || ulChild.tagName === 'P') && ulChild.innerText !== '') {
            // trim() is always called on the innerText String to remove unexpected newlines
            currentTopic = ulChild.innerText.trim();
        }
        else if (ulChild.tagName === 'LI' && ulChild.innerText !== '') {
            chapterIndexString += 'title:' + ulChild.innerText.trim() + '\n';
            chapterIndexString += 'topic:' + currentTopic + '\n';
            chapterIndexString += 'url:' + ulChild.querySelector('a').href + '\n\n';
        }
    }

    return chapterIndexString;
}

export function getILCSAct(pChildren) {
    let actText = '';

    for (const pChild of pChildren) {
        if (pChild.tagName === 'TABLE') {
            actText += pChild.innerText + '<TABLE_END>';
        }
    }

    return actText;
}

export function getActHasArticles(aNodes) {
    let href = '';
    for (const aNode of aNodes) {
        if (aNode.innerText.toLowerCase().includes('entire act')) {
            href = aNode.href;
            break;
        }
    }
    return href;
}