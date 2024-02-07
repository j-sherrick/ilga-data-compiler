import 'dotenv/config';

import controller from './controllers/ILCSController.js';
import { initILCSCrawler } from './services/ILCSCrawler.js';


async function main() {
    const { chapters, topics } = await controller.initILCSCollection();
    const indexSaved = controller.saveILCSTopLevelIndex(chapters, topics);
    if (indexSaved) {
        for (chapter of chapters) {
            let acts = controller.initActs(chapter);
        }
    }

    close();
}

await main();