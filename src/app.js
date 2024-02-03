import 'dotenv/config';

import controller from './controllers/ILCSController.js';
import { initILCSCrawler } from './services/ILCSCrawler.js';

const { initILCSCollection, initActs, initSections, close } = controller;

async function main() {
    const { chapters, topics } = await initILCSCollection();
    for (let chapter of chapters) {
        const { acts, subtopics } = await initActs(chapter);
        for (let act of acts) {
            const sections = await initSections(act);
        }
    }
    await close();
}