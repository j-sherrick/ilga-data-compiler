import { IChapter } from "../../../schemas/ILCS/intefaces/IChapter";

export class Extractor {

    public static returnChapterList(html: HTMLElement[]): string {

        let chapters: object[] = [];
        let currentTopic = '';
        for(const el of html) {
            if ((el.tagName === 'DIV' || el.tagName === 'P') && el.innerText !== '') {
                currentTopic = el.innerText.trim();
            }
            else if (el.tagName === 'LI' && el.innerText !== '') {
                const link = el.querySelector('a');
                const linkHref = link ? link.href : '';
                chapters.push({
                    title: el.innerText.trim(),
                    topic: currentTopic,
                    url: linkHref
                });
            }
        }
    
        return JSON.stringify(chapters);
    }

    public static returnChapterContents(html: HTMLElement[]): string {


        return '';
    }
}



/**
 * This function is a pageFunction to be evaluated in the browser context by Puppeteer. It expects the result of a
 * querySelectorAll call on 'td p *' selector on the appropriate page, and returns a string representing the entire text of an act.
 * Each section of the act is separated by the delimiter token.
 * 
 * @param pChildren the children of a P element that may contain a table of acts
 * @param tokenString a string constant used as a delimiter token to separate acts 
 * @returns a formatted string representing the entire text of an act, with sections separated by tokenString
 */
function getILCSAct(
    pChildren: HTMLElement[],
    tokenString: string):
    string {

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
 * @param aNodes - an array of anchor elements that may contain a link to the entire act
 * @param viewEntireAct - a string constant used to identify the link to the entire act 
 * @returns a string with the href attribute found in the link to the entire act, if it exists, or an empty string if it doesn't
 */
function hasEntireAct(
    aNodes: HTMLAnchorElement[],
    viewEntireAct: string):
    string {
        
    let href = '';
    for (const aNode of aNodes) {
        if (aNode.innerText.toLowerCase().includes(viewEntireAct)) {
            href = aNode.href;
            break;
        }
    }
    return href;
}

export { 
    getILCSAct,
    hasEntireAct
 }