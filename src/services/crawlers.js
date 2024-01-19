import puppeteer, { ElementHandle, Page } from 'puppeteer';
import { getILCSIndexString, UL_CHILDREN} from './extractors.js';
import { parseChapterIndex, parseActIndex } from './parsers.js';


class ILCSCrawler {
    static BASE_URL = 'https://www.ilga.gov/legislation/ilcs/ilcs.asp';
    constructor(browser, chapters) {
        this.browser = browser;
        this.chapters = chapters;
    }

    async getActsFromChapter(chapter) {
        const actsPage = await this.browser.newPage();
        await actsPage.goto(chapter.url);
        const actIndexString = await actsPage.$$eval(UL_CHILDREN, getILCSIndexString);
        actsPage.close();
        return parseActIndex(actIndexString);
    }

    async close() {
        await this.browser.close();
    }
}

async function getChapterIndex(ilcsBasePage) {
    ilcsBasePage = await ilcsBasePage.$$eval(UL_CHILDREN, getILCSIndexString);
    return parseChapterIndex(ilcsBasePage);
}

async function initILCSCrawler() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(ILCSCrawler.BASE_URL);
    const chapters = await getChapterIndex(page);
    return new ILCSCrawler(browser, chapters);
}

const crawler = await initILCSCrawler();
console.log(crawler.chapters);
crawler.close();

export default ILCSCrawler;