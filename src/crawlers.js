import puppeteer, { ElementHandle, Page } from 'puppeteer';
import { getILCSIndexString, ULISTCHILDREN, PCHILDREN, getILCSAct } from './extractors.js';
import { normalizeNbsp, normalizeNewlines } from './parsers.js';

const CHAPTER_INDEX_URL = 'https://www.ilga.gov/legislation/ilcs/ilcs.asp';

const ACT_INDEX_URL = 'https://www.ilga.gov/legislation/ilcs/ilcs2.asp?ChapterID=5';

const ACT_TEXT_URL = 'https://www.ilga.gov/legislation/ilcs/ilcs3.asp?ActID=3658&ChapterID=5'


// const chapterIndexPage = await browser.newPage();
// await chapterIndexPage.goto(CHAPTER_INDEX_URL);
// const actIndexString = await chapterIndexPage.$$eval(ULISTCHILDREN, getILCSIndexString);
// console.log(actIndexString);

const browser = await puppeteer.launch();

const actPage = await browser.newPage();
await actPage.goto(ACT_TEXT_URL);
const actTextString = normalizeNewlines(await actPage.$$eval(PCHILDREN, getILCSAct));
console.log(actTextString);

browser.close();