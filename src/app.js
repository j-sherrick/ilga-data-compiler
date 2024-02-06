import 'dotenv/config';

import controller from './controllers/ILCSController.js';
import { initILCSCrawler } from './services/ILCSCrawler.js';

const { initILCSCollection, initActs, initSections, close } = controller;

async function main() {
    const { chapters, topics } = await initILCSCollection();
    let GeneralProvisions = chapters[1];
    let { acts, subtopics } = await initActs(GeneralProvisions);
    // console.log(acts);
    console.log(acts);
    console.log(subtopics);
    close();
}

await main();