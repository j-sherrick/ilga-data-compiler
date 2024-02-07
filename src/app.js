import 'dotenv/config';

import controller from './controllers/ILCSController.js';


async function main() {
    const { chapters, topics } = await controller.initILCSCollection();
    const indexSaved = controller.saveILCSTopLevelIndex(chapters, topics);
    if (indexSaved) {
        for (const chapter of chapters) {
            let actsIndex = controller.initActs(chapter);
            let actsSaved = controller.saveILCSActs(actsIndex);
            if (actsIndex.subtopics) {
                controller.saveILCSSubtopics(actsIndex.subtopics);
            }
            if(actsSaved) {
                console.log(`Saved act index for CHAPTER ${chapter.number} ${chapter.title}`);
                for (const act of actsIndex.acts) {
                    let repealed = act.title.toLowercase.includes('repealed');
                    if(!repealed) {
                        let sectionsIndex = controller.initSections(act);
                        controller.saveILCSActText(sectionsIndex);
                        console.log(`Saved ${chapter.number} ILCS ${act.prefix}/    ${act.title}`);
                    }
                    else {
                        console.log(`${chapter.number} ILCS ${act.prefix}/    has been repealed. Skipping...`)
                    }
                }
            }
        }
    }

    close();
}

await main();