import 'module-alias/register';

import puppeteer from 'puppeteer';
import { Browser, HTTPResponse, Page } from 'puppeteer';
import { Extractor } from '@services/extractor.js';
import { UL_CHILDREN, P_CHILDREN } from '@services/constants/strings.js';

// The Illinois Compiled Statutes main chapter listing
const home = 'https://ilga.gov/legislation/ilcs/ilcs.asp';

// a collection of acts with no subtopics (CHAPTER 25 LEGISLATURE)
const acts = 'https://ilga.gov/legislation/ilcs/ilcs2.asp?ChapterID=6';

// a collection of acts categorized by subtopic (CHAPTER 225 PROFESSIONS, OCCUPATIONS, AND BUSINESS OPERATIONS)
const actsSubtopics = 'https://ilga.gov/legislation/ilcs/ilcs2.asp?ChapterID=24';

// the text of an entire act (215 ILCS 106/ Chilren's Health Insurance Program Act.)
const entireAct = 'https://ilga.gov/legislation/ilcs/ilcs3.asp?ActID=1255&ChapterID=22';

const browser: Browser = await puppeteer.launch();
const page: Page = await browser.newPage();

async function testTopLevel(): Promise<void> {
   let chapters = '';
   try {
      const res: HTTPResponse | null = await page.goto(home);
      if (!res) {
         throw new Error('HTTPResponse was null.');
      }
      if (!res.ok()) {
         throw new Error(`Error loading page! Status code: ${res.status()}`);
      }
      console.log('HTTP response was good!');
      chapters = await page.$$eval(UL_CHILDREN, Extractor.getChapterListing);
      console.log(chapters);
      if (!chapters) {
         throw new Error(`Chapter listing was empty after retrieval!`);
      }
   } catch (err) {
      console.error(err);
      return;
   } finally {
      console.log(`Chapters: ${chapters.length > 1 ? 'PASSED' : 'FAILED'}`);
   }
}

async function testActsWithSubtopics(): Promise<void> {
   let acts = '';
   try {
      const res: HTTPResponse | null = await page.goto(actsSubtopics);
      if (!res) {
         throw new Error('HTTPResponse was null.');
      }
      if (!res.ok()) {
         throw new Error(`Error loading page! Status code: ${res.status()}`);
      }
      console.log('HTTP response was good!');
      acts = await page.$$eval(UL_CHILDREN, Extractor.getActListing);
      console.log(acts);
      if (!acts) {
         throw new Error(`Chapter listing was empty after retrieval!`);
      }
   } catch (err) {
      console.error(err);
      return;
   } finally {
      console.log(`Acts - With Subtopics: ${acts.length > 1 ? 'PASSED' : 'FAILED'}`);
   }
}

// TODO: add checks that all required properties of the Act interface are fulfilled
async function testActsNoSubtopics(): Promise<void> {
   let acts = '';
   try {
      const res: HTTPResponse | null = await page.goto(actsSubtopics);
      if (!res) {
         throw new Error('HTTPResponse was null.');
      }
      if (!res.ok()) {
         throw new Error(`Error loading page! Status code: ${res.status()}`);
      }
      console.log('HTTP response was good!');
      acts = await page.$$eval(UL_CHILDREN, Extractor.getActListing);
      console.log(acts);
      if (!acts) {
         throw new Error(`Chapter listing was empty after retrieval!`);
      }
   } catch (err) {
      console.error(err);
      return;
   } finally {
      console.log(`Acts - No Subtopics: ${acts.length > 1 ? 'PASSED' : 'FAILED'}`);
   }
}
async function testEntireAct(): Promise<void> {
   let act = '';
   try {
      const res: HTTPResponse | null = await page.goto(entireAct);
      if (!res) {
         throw new Error('HTTPResponse was null.');
      }
      if (!res.ok()) {
         throw new Error(`Error loading page! Status code: ${res.status()}`);
      }
      console.log('HTTP response was good!');
      act = await page.$$eval(P_CHILDREN, Extractor.getActSections);
      console.log(act);
      if (!act) {
         throw new Error(`Chapter listing was empty after retrieval!`);
      }
   } catch (err) {
      console.error(err);
      return;
   } finally {
      console.log(`Entire Act: ${act.length > 1 ? 'PASSED' : 'FAILED'}`);
   }
}

// await testTopLevel();
// await testActsNoSubtopics();
// await testActsWithSubtopics();
await testEntireAct();

await browser.close();
