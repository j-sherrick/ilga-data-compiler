import puppeteer, { ElementHandle, Page } from 'puppeteer';
import { getILCSIndexString, UL_CHILDREN, P_CHILDREN } from './extractors.js';
import { parseChapterIndex, parseActIndex } from './parsers.js';

const BASE_URL = 'https://www.ilga.gov/legislation/ilcs/ilcs.asp';

let browser;
let ilcsPage;

async function initILCSPage() {
    if (!browser) {
        browser = await puppeteer.launch();
    }

    if (!ilcsPage) {
        ilcsPage = await browser.newPage();
        await ilcsPage.goto(BASE_URL);
    }
}

async function closeBrowser() {
    return await browser.close();
}

async function getChapterIndex() {
    ilcsPage = await ilcsPage.$$eval(UL_CHILDREN, getILCSIndexString);
    return parseChapterIndex(ilcsPage);
}

async function init() {
    await initILCSPage();
    return await getChapterIndex();
}

async function getActsFromChapter(chapter) {
    const actsPage = await browser.newPage();
    await actsPage.goto(chapter.url);
    const actIndexString = await actsPage.$$eval(UL_CHILDREN, getILCSIndexString);
    actsPage.close();
    return parseActIndex(actIndexString);
}

export async function run() {
    const chapters = await init();
    const firstChapter = chapters[0];
    const acts = await getActsFromChapter(firstChapter);
    console.log(firstChapter);
    console.log(acts);
    closeBrowser();
}

run();