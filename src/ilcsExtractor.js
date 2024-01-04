import puppeteer, { Page } from 'puppeteer';

class ILGADataExtractor {

    static BASE_URL = 'https://www.ilga.gov/legislation/ilcs/ilcs.asp';

    static MAJOR_TOPIC_NAMES = [
        'GOVERNMENT',
        'EDUCATION',
        'REGULATION',
        'HUMAN NEEDS',
        'HEALTH AND SAFETY',
        'AGRICULTURE AND CONSERVATION',
        'TRANSPORTATION',
        'RIGHTS AND REMEDIES',
        'BUSINESS AND EMPLOYMENT'
    ];

    static MAJOR_TOPIC_NUMBERS = [
        '00',
        '100',
        '200',
        '300',
        '400',
        '500',
        '600',
        '700',
        '800'
    ];

    static SERIES = 0;
    static NUMBER = 0;
    static NAME = 1;
    static URL = 2;

    constructor() {
        this.getChaptersFromList = this.getChaptersFromList.bind(this);
        this.elementHasTopic = this.hasTopic.bind(this);
        this.elementHasChapter = this.hasChapter.bind(this);
        this.listHasTopics = this.listHasTopics.bind(this);
        this.init = this.init.bind(this);

        this.chapterIndex = null;
    }


    /**
    * @param { Element } el child element of the <ul> of chapters located at BASE_URL
    * 
    * @returns { Boolean } true if the element contains any of the major topics, false otherwise
    */
    hasTopic(el) {
        for (const topic in ILGADataExtractor.MAJOR_TOPIC_NAMES) {
            if (el.innerText.includes(topic)) {
                return true; 
            }
        }
        return false;
    }

    /**
     * 
     * @param { Element } el child element of the <ul> of chapters located at BASE_URL
     *  
     * @returns { Array } with the format [ '00', 'GOVERNMENT' ] 
     */
    getTopic(el) {
        for (let i = 0; i < ILGADataExtractor.MAJOR_TOPIC_NAMES.length; i++) {
            if (el.innerText.includes(ILGADataExtractor.MAJOR_TOPIC_NAMES[i])) {
                return [ILGADataExtractor.MAJOR_TOPIC_NUMBERS[i], ILGADataExtractor.MAJOR_TOPIC_NAMES[i]];
            }
        }
        return null;
    }

    /**
     * @param { Element } el child of the <ul> of chapters located at BASE_URL
     * 
     * @returns { Boolean } true if the word 'CHAPTER' is in the innerText of `el`, false otherwise
    */
    hasChapter(el) {
        return el.innerText.includes('CHAPTER');
    }

    /**
     * 
     * @param { Element } el child of the <ul> of chapters located at BASE_URL
     * 
     * @returns { Array } with the format:
     * 
     *             [
     *                '105',
     *                'SCHOOLS',
     *                'https://www.ilga.gov/legislation/ilcs/ilcs2.asp?ChapterID=17'
     *              ] 
     */
    getChapter(el) {
        const chapterNumberRegEx = /d{1,3}/; // we should be safe assuming any sequence of 1-3 digits is a chapter number
        const number = el.innerText.match(chapterNumberRegEx)[0];
        if (number) {
            const url = el.querySelector('a').href;
            const name = el.innerText.replace( ('CHAPTER ' + number), '').trim();

            return [number, name, url];
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
    async listHasTopics(el) {
        const elInnerText = await el.evaluate(element => element.innerText);
        for (const topic in ILGADataExtractor.MAJOR_TOPIC_NAMES) {
            if (!elInnerText.includes(topic)) {
                return false;
            }
        }
        return true;
    }

    getChaptersFromList(list) {
        const uElementChildren = list.children;
        let majorTopics = {};
        let series = '';

        for (const child of uElementChildren) {
            const topic = this.hasTopic(child);
            if (topic) {
                series = topic[SERIES];
                majorTopics[series] = {
                    name: topic[NAME],
                    chapters: []
                };
            }
            else {
                const chapter = this.hasChapter(child);
                if (chapter) {
                    majorTopics[series].chapters.push(chapter);
                }
            }
        }

        return JSON.stringify(majorTopics);
    }

    async init() {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const response = await page.goto(ILGADataExtractor.BASE_URL);
        console.log(response.status());

        const pageUElement = await page.waitForSelector('td ul');
        if (!this.listHasTopics(pageUElement)) return null;
        
        const result = await pageUElement.evaluate(this.getChaptersFromList);
        console.log(result);

        await browser.close();
    }
}


export default ILGADataExtractor;

const ilcs = new ILGADataExtractor();
const statutes = JSON.parse(await ilcs.init());
for(const chapter in statutes) {
    console.log(chapter);
}