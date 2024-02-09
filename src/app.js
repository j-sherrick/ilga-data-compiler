import 'dotenv/config';

import controller from './controllers/ILCSController.js';


async function main() {
    const { chapters, topics } = await controller.initILCSCollection();
    const indexSaved = await controller.saveILCSTopLevelIndex(chapters, topics, true, true);
    if (indexSaved) {
        for (const chapter of chapters) {
            let actsIndex = controller.initActs(chapter);
            let actsSaved = await controller.saveILCSActs(actsIndex, true);
            if (actsIndex.subtopics) {
                await controller.saveILCSSubtopics(actsIndex.subtopics, true);
            }
            if(actsSaved) {

                console.log(`Saved act index for CHAPTER ${chapter.number} ${chapter.title}`);

                for (const act of actsIndex.acts) {
                    let repealed = act.title.toLowercase.includes('repealed');
                    if(!repealed) {
                        let sectionsIndex = controller.initSections(act);
                        await controller.saveILCSActText(sectionsIndex, true);

                        console.log(`Saved ${chapter.number} ILCS ${act.prefix}/    ${act.title}`);

                    }
                    else {

                        console.log(`${chapter.number} ILCS ${act.prefix}/    has been repealed. Skipping...`)

                    }
                }
            }
        }
    }

    controller.close();
}

main();