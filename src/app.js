import 'dotenv/config';
import puppeteer from 'puppeteer';
import { getILCSAct, P_CHILDREN} from './services/extractors.js';
import { parseActText } from './services/parsers.js';
// import connectDB from "./controllers/connectDB.js";
const ACT = 'https://www.ilga.gov/legislation/ilcs/ilcs3.asp?ActID=193&ChapterID=4';

const browser = await puppeteer.launch();
const actPage = await browser.newPage();
await actPage.goto(ACT);

let act = await actPage.$$eval(P_CHILDREN, getILCSAct);
act = parseActText(act);
for (let section of act) {
    console.log(section);
}
browser.close();