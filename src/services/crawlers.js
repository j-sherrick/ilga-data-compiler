import puppeteer, { ElementHandle, Page } from 'puppeteer';

import {
    getILCSIndexString,
    getILCSAct,
    hasEntireAct,
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
    constructor(browser, index) {
        this._browser = browser;
        this._index = index;
    }

    get chapters() {
        let chaptersCopy = [];
        chaptersCopy = this._index;
        return chaptersCopy;
    }

    async gotoWithDelay(url, delay = 300) {
        const page = await this._browser.newPage();
        await new Promise(resolve => setTimeout(resolve, delay));
        await page.goto(url);
        return page;
    }

    async getActsFromUrl(url) {
        const chapterPage = await this.gotoWithDelay(url);
        const acts = await chapterPage.$$eval(UL_CHILDREN, getILCSIndexString);
        chapterPage.close();
        return parseActsToArray(acts);
    }

    async getSectionsFromUrl(url) {
        const actPage = await this.gotoWithDelay(url);
        let actText = '';
        const entirePage = await actPage.$$eval(TD_P_ANCHORS, hasEntireAct);
        if (entirePage) {
            await actPage.goto(entirePage);
            actText = await actPage.$$eval(P_CHILDREN, getILCSAct);
            actPage.close();
            return parseActText(actText);
        }
        else {
            actText = await actPage.$$eval(P_CHILDREN, getILCSAct);
            actPage.close();
            return parseActText(actText);
        }
    }
    
    async close() {
        await this._browser.close();
    }
}

export async function initILCSCrawler() {
    const browser = await puppeteer.launch();
    const basePage = await browser.newPage();
    await basePage.goto(ILCSCrawler.BASE_URL);
    let index = await basePage.$$eval(UL_CHILDREN, getILCSIndexString);
    index = parseChapterIndex(index);
    return new ILCSCrawler(browser, index);
}

export default ILCSCrawler;