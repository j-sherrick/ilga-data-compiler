import puppeteer, { ElementHandle, Page } from 'puppeteer';

import {
    getILCSIndexString,
    getILCSAct,
    getEntireActUrl,
    P_CHILDREN,
    UL_CHILDREN,
    TD_P_ANCHORS
} from './extractors.js';

import {
    parseChapterIndex,
    parseActsToArray,
    parseActText
} from './parsers.js';


class ILCSCrawler {
    static BASE_URL = 'https://www.ilga.gov/legislation/ilcs/ilcs.asp';
    constructor(browser, chapters) {
        this._browser = browser;
        this._chapters = this.initChapterIndex(browser);
    }

    get chapters() {
        const chaptersCopy = [];
        for (const chapter of this._chapters) {
            chaptersCopy.push({...chapter});
        }
        return chaptersCopy;
    }

    async gotoWithDelay(url, delay = 300) {
        const page = await this._browser.newPage();
        await new Promise(resolve => setTimeout(resolve, delay));
        await page.goto(url);
        return page;
    }

    async getActsFromChapter(chapter) {
        const chapterPage = await this.gotoWithDelay(chapter.url);
        const acts = await chapterPage.$$eval(UL_CHILDREN, getILCSIndexString);
        chapterPage.close();
        return parseActsToArray(acts);
    }

    async getTextFromAct(act) {
        const actPage = await this.gotoWithDelay(act.url);
        const hasArticles = await actPage.$$eval(TD_P_ANCHORS, actHasArticles);
        actPage.close();
        return hasArticles;
    }

    async initChapterIndex(browser) {
        let basePage = await browser.newPage();
        await basePage.goto(ILCSCrawler.BASE_URL);
        let indexString = await basePage.$$eval(UL_CHILDREN, getILCSIndexString);
        return parseChapterIndex(indexString);
    }

    async close() {
        await this._browser.close();
    }
}


export async function initILCSCrawler() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    return new ILCSCrawler(browser);
}

export default ILCSCrawler;