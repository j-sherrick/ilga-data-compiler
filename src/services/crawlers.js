import puppeteer, { ElementHandle, Page } from 'puppeteer';
import { getILCSIndexString, UL_CHILDREN, P_CHILDREN } from './extractors.js';
import { parseChapterIndex, parseActIndex } from './parsers.js';
import { get } from 'mongoose';

const BASE_URL = 'https://www.ilga.gov/legislation/ilcs/ilcs.asp';

let browser;
let ilcsPage;

async function initILCSPage() {
    browser = await puppeteer.launch();
    ilcsPage = await browser.newPage();
    await ilcsPage.goto(BASE_URL);
}

async function getChapterIndex() {
    ilcsPage = await ilcsPage.$$(UL_CHILDREN, getILCSIndexString);
    return parseChapterIndex(ilcsPage);
}

async function getActsFromChapter(chapter) {
    await ilcsPage.goto(chapter.url);
    let actIndexString = await ilcsPage.$$(UL_CHILDREN, getILCSIndexString);
    return parseActIndex(actIndexString);
}

browser.close();