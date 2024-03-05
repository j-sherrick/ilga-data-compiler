import puppeteer, { ElementHandle, Page, Browser } from 'puppeteer';


import ILCSObjectFactory from './utils/ObjectFactory.js';

export class ILCSCrawler {
    public static BASE_URL = 'https://www.ilga.gov/legislation/ilcs/ilcs.asp';

    private browser: Browser;

    private page: Page;

    private constructor() {}

    private async initialize(): Promise<void> {
        this.browser = await puppeteer.launch();
        this.page = await this.browser.newPage();
        await this.page.goto(ILCSCrawler.BASE_URL);
    }

    public static async create(): Promise<ILCSCrawler> {
        const crawler = new ILCSCrawler();
        await crawler.initialize();
        return crawler;
    }

    public async gotoWithDelay(url: string, delay = 300): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, delay));
        await this.page.goto(url);
    }
    
    public async close() {
        await this.browser.close();
    }
}