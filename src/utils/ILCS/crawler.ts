import puppeteer, { Page, Browser } from 'puppeteer';

export class ILCSCrawler {
   public static BASE_URL = 'https://www.ilga.gov/legislation/ilcs/ilcs.asp';

   private browser: Browser | null;

   private page: Page | null;

   private constructor() {
      this.browser = null;
      this.page = null;
   }

   private async initialize(): Promise<void> {
      this.browser = await puppeteer.launch();
      this.page = await this.browser.newPage();
      await this.page.goto(ILCSCrawler.BASE_URL);
   }

   private async initUrlList(): Promise<void> {}

   public static async create(): Promise<ILCSCrawler> {
      const crawler = new ILCSCrawler();
      await crawler.initialize();
      return crawler;
   }

   public async gotoWithDelay(url: string, delay = 300): Promise<void> {
      await new Promise((resolve) => setTimeout(resolve, delay));
      if (this.page) {
         await this.page.goto(url);
      }
   }

   public async close() {
      if (this.browser) {
         await this.browser.close();
      }
   }
}

function hasEntireAct(aNodes: HTMLAnchorElement[], viewEntireAct: string): string {
   let href = '';
   for (const aNode of aNodes) {
      if (aNode.innerText.toLowerCase().includes(viewEntireAct)) {
         href = aNode.href;
         break;
      }
   }
   return href;
}
