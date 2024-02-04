import 'dotenv/config';

import controller from './controllers/ILCSController.js';
import { initILCSCrawler } from './services/ILCSCrawler.js';

const { initILCSCollection, initActs, initSections, close } = controller;

async function main() {
    const { chapters, topics } = await initILCSCollection();
    console.log(chapters);
    console.log(topics);
}

await main();