import puppeteer from 'puppeteer';
import { Browser, HTTPResponse, Page } from 'puppeteer';
import { Extractor } from '@services/extractor.js';
import { P_CHILDREN } from '@services/constants/strings.js';

// The Illinois Compiled Statutes main chapter listing
const home = 'https://ilga.gov/legislation/ilcs/ilcs.asp';

// a collection of acts with no subtopics (CHAPTER 25 LEGISLATURE)
const acts = 'https://ilga.gov/legislation/ilcs/ilcs2.asp?ChapterID=6';

// a collection of acts categorized by subtopic (CHAPTER 225 PROFESSIONS, OCCUPATIONS, AND BUSINESS OPERATIONS)
const actsSubtopics = 'https://ilga.gov/legislation/ilcs/ilcs2.asp?ChapterID=24';

const browser: Browser = await puppeteer.launch();
const page: Page = await browser.newPage();

async function testTopLevel(): Promise<void> {
   let list: any = '';
   try {
      const ret: HTTPResponse | null = await page.goto(home);
      if (!ret) {
         throw new Error('HTTPResponse was null.');
      }
      if (!ret.ok()) {
         throw new Error(`Error loading page! Status code: ${ret.status()}`);
      }

      list = await page.$$eval(P_CHILDREN, Extractor.getChapterListing);
      if (!list) {
         throw new Error(`Chapter listing was empty after retrieval!`);
      }
   } catch (err) {
      console.error(err);
      return;
   } finally {
      console.log(list);
   }
}

await testTopLevel();

await browser.close();
