import 'dotenv/config';

import controller from './controllers/ILCSController.js';
import { initILCSCrawler } from './services/ILCSCrawler.js';

const { initILCSCollection, initActs, initSections, close } = controller;

async function main() {
    const { chapters, topics } = await initILCSCollection();
    let GeneralProvisions = chapters[1];
    let { acts, subtopics } = await initActs(GeneralProvisions);

    let Act1 = acts[0];
    let sections = await initSections(Act1);
    console.log(sections);

    close();
}

await main();