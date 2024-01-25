import { initILCSCrawler } from "../services/crawlers.js";
import { Chapter, Act, Topic, Subtopic } from "../models/StatuteSchemas.js";
import readline from "readline";
import connectDB from "./connectDB.js";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function saveActsToChapter(acts, chapter) {
    for (const act of acts) {
        const newAct = saveAct(act, chapter._id);
        chapter.acts.push(newAct._id);
    }
    await chapter.save();
}

async function saveAct(act, chapterId) {
    const newAct = new Act({
        prefix: act.prefix,
        title: act.title,
        url: act.url,
        chapter: chapterId
    });
    await newAct.save();
    
    return newAct;
}

function printChapters(chapters) {
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