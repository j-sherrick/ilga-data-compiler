import puppeteer, { Page } from 'puppeteer';

class ILCS {
    constructor() {
        this.chapterIndex = null;
    }

    static BASE_URL = 'https://www.ilga.gov/legislation/ilcs/ilcs.asp';

    static MAJOR_TOPICS = {
        '00': 'GOVERNMENT',
        '100': 'EDUCATION',
        '200': 'REGULATION',
        '300': 'HUMAN NEEDS',
        '400': 'HEALTH AND SAFETY',
        '500': 'AGRICULTURE AND CONSERVATION',
        '600': 'TRANSPORTATION',
        '700': 'RIGHTS AND REMEDIES',
        '800': 'BUSINESS AND EMPLOYMENT'
    };

    async init() {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(ILCS.BASE_URL);

        const pageUElement = await page.$('td ul');
        if (!this.hasAllMajorTopics(pageUElement)) return null;

        
        
        let tempChapterIndex = {};
        let currentSeries = '';
        const uElementChildren = pageUElement.children;
        uElementChildren.forEach(child => {
            const topic = this.elementHasTopic(child);
            if (topic) {
                currentSeries = topic.number;
                tempChapterIndex[currentSeries] = {
                    topic: topic.name,
                    chapters: []
                };
            } else {
                const chapter = this.elementHasChapter(child);
                if (chapter) {
                    tempChapterIndex[currentSeries].chapters.push(chapter);
                }
            }
        });

        this.chapterIndex = tempChapterIndex;

        await browser.close();
    }


    /**
    * @param { Element } el child element of the <ul> of chapters located at BASE_URL
    * 
    * @returns an object representing a major topic's 100 series and name in the format { number: '00', name: 'GOVERNMENT' }
    *          or null if the text does not contain a major topic
    */
    elementHasTopic(el) {
        for (const topic in ILCS.MAJOR_TOPICS) {
            if (el.innerText.includes(ILCS.MAJOR_TOPICS[topic])) {
                return {
                    number: topic,
                    name: ILCS.MAJOR_TOPICS[topic]
                };
            }
        }

        return null;
    }

    /**
     * @param { Element } el assumed to be a child of the element returned by running querySelector('td ul') on BASE_URL
     * 
     * @returns chapter metadata object with the shape { chapterNumber, chapterName, chapterURL }
     *          null if `el.innerText` does not contain a chapter number
     *          null if `el.innerText` was null to begin with
    */
    elementHasChapter(el) {
        const chapterNumberRegEx = /d{1,3}/; // we should be safe assuming any sequence of 1-3 digits is a chapter number
        const chapterNumber = el.innerText.match(chapterNumberRegEx)[0];
        if (chapterNumber) {
            const chapterURL = el.querySelector('a').href;
            const chapterName = el.innerText.replace( ('CHAPTER ' + chapterNumber), '').trim();

            return { chapterNumber, chapterName, chapterURL };
        }

        return null;
    }


    /**
     * @param { HTMLUListElement } el the Element returned from running querySelector('td ul') on BASE_URL. Assumed to
     *                       at least not be null. Makes no assumptions about whether the child element is in a <li> or not.
     *                       It only cares that the innerText of `el
     * 
     * @returns { Boolean } true if `el` contains all of the ILCS major topics, false otherwise
    */
    async hasAllMajorTopics(el) {
        const elInnerText = await el.evaluate(element => element.innerText);
        for (const series in ILCS.MAJOR_TOPICS) {
            if (!elInnerText.includes(ILCS.MAJOR_TOPICS[series])) {
                return false;
            }
        }
        return true;
    }
}


export default ILCS;

const ilcs = new ILCS();
const index = await ilcs.init();
for(const chapter in index) {
    console.log(chapter);
}