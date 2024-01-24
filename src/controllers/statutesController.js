import { initILCSCrawler } from "../services/crawlers.js";
import { Chapter, Act, Topic, Subtopic } from "../models/StatuteSchemas.js";
import readline from "readline";
import connectDB from "./connectDB.js";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function populateActArrays(chapters) {
 for (const chapter of chapters) {
     const acts = await ilcs.getActsFromChapter(chapter);
     chapter.acts = acts;
 }
}

export default {
    async  run() {
        const ilcs = await initILCSCrawler();
        const chapters = ilcs.chapters.map(chapter => new Chapter(chapter));
        console.log(`Found ${chapters.length} chapters`);
        console.log(`First chapter: ${JSON.stringify(chapters[0])}`);
    }    
}    