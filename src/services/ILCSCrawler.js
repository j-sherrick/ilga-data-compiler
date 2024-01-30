import puppeteer, { ElementHandle, Page } from 'puppeteer';

import {
    getILCSIndexString,
    getILCSAct,
    hasEntireAct,
} from './ILCSExtractor.js';

import {
    UL_CHILDREN,
    TD_P_ANCHORS,
    P_CHILDREN,
    TITLE,
    HREF,
    TOPIC,
    TOKEN,
    NL,
    ENTIRE_ACT_LINK
} from './constants/strings.js';

import ILCSObjectFactory from './ILCSObjectFactory.js';

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
        const acts = await chapterPage.$$eval(UL_CHILDREN, getILCSIndexString, TITLE, HREF, TOPIC, NL);
        chapterPage.close();
        return ILCSObjectFactory.getNewActsArray(acts);
    }

    async getSectionsFromUrl(url) {
        const actPage = await this.gotoWithDelay(url);
        let actText = '';
        const entirePage = await actPage.$$eval(TD_P_ANCHORS, hasEntireAct, ENTIRE_ACT_LINK);
        if (entirePage) {
            await actPage.goto(entirePage);
            actText = await actPage.$$eval(P_CHILDREN, getILCSAct, TOKEN);
            actPage.close();
            return ILCSObjectFactory.getNewSectionsArray(actText);
        }
        else {
            actText = await actPage.$$eval(P_CHILDREN, getILCSAct, TOKEN);
            actPage.close();
            return ILCSObjectFactory.getNewSectionsArray(actText);
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
    let index = await basePage.$$eval(UL_CHILDREN, getILCSIndexString, TITLE, HREF, TOPIC, NL);
    index = ILCSObjectFactory.getNewChaptersArray(index);
    return new ILCSCrawler(browser, index);
}

export default ILCSCrawler;