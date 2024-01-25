import { initILCSCrawler } from "../services/crawlers.js";
import { Chapter, Act, Topic, Subtopic } from "../models/StatuteSchemas.js";
import readline from "readline";
import connectDB from "./connectDB.js";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function populateActs(chapters, crawler) {
    for (const chapter of chapters) {
        const acts = await crawler.getActsFromChapter(chapter);
        console.log(`Found ${acts.length} acts in chapter ${chapter.number}: ${chapter.title}`);
        let answer = await new Promise(resolve => {
               rl.question("Do you want to save these acts? (y/n)", resolve);
        });
        answer = answer.toLowerCase();
        if (answer === 'y' || answer === 'yes') {
               console.log(`Saving ${acts.length} acts to the database...`);
               for (const act of acts) {
                   console.log(`Saving ${chapter.number} ILCS ${act.prefix}/\t${act.title}...`);
               }
        }
        if (answer === 'n' || answer === 'no') {
            console.log(`Skipping ${acts.length} acts in CHAPTER ${chapter.number} ${chapter.title}`);
        }
       //  chapter.acts = acts;
    }
}

function printChaptersWithTopics(chapters) {
    let currentTopic ={};
    for (const chapter of chapters) {
        if (chapter.topic.name !== currentTopic.name) {
            currentTopic = chapter.topic;
            console.log(`\n\n${currentTopic.series}: ${currentTopic.name}`);
        }
        console.log(`|\n--- CHAPTER ${chapter.number} ${chapter.title}`);
    }
}

export default {
    async run() {
        const crawler = await initILCSCrawler();
        const chapters  = crawler.chapters;
        await printChaptersWithTopics(chapters);
        rl.close();
        crawler.close();
    }    
}    