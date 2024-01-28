import { initILCSCrawler } from "../services/ILCSCrawler.js";
import { Chapter, Act, Topic, Subtopic } from "../models/StatuteSchemas.js";
import { parseActsToArray } from "../services/ILCSFactory.js";
import readline from "readline";
import connectDB from "./connectDB.js";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

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



function initILCSTopLevel(chapters, topics) {
    let currentTopic = {};
    let currentChapter = {};
    let topics = [];
    for (const chapter of chapters) {
        if (chapter.topic.name !== currentTopic.name) {
            currentTopic = getTopic(chapter.topic);
            topics.push(currentTopic);
            console.log(`\n\n${currentTopic.series}: ${currentTopic.name}`);
        }
        console.log(`|\n--- CHAPTER ${chapter.number} ${chapter.title}`);
        currentChapter = getChapter(chapter, currentTopic._id);
        currentTopic.chapters.push(currentChapter._id);
    }
}


export default {
    async initILCSCollection() {
        await connectDB();


        const crawler = await initILCSCrawler();
        let chapters  = crawler.chapters;
        let topics = [];
        initILCSTopLevel(chapters, topics);

        let currentTopic = {};
        let currentChapter = {};
        for (const chapter of chapters) {
            if (chapter.topic.name !== currentTopic.name) {
                currentTopic = getTopic(chapter.topic);
                console.log(`\n\n${currentTopic.series}: ${currentTopic.name}`);
            }
            console.log(`|\n--- CHAPTER ${chapter.number} ${chapter.title}`);
            currentChapter = getChapter(chapter, currentTopic._id);
            currentTopic.chapters.push(currentChapter._id);

        }
        //     let acts = await crawler.getActsFromUrl(chapter.url);
        //     acts = parseActsToArray(acts);
        //     acts = getActsArray(acts, currentChapter._id);      // Get array of Acts
        //     for (const act of acts) {
        //         currentChapter.acts.push(act._id);

        //         let sections = await crawler.getSectionsFromUrl(act.url);
        //         sections = parseActText(sections);
        //         sections = getSectionsArray(sections, act._id);  // Get array of Sections
        //         for (const section of sections) {
        //             act.sections.push(section._id);
        //         }
        //         await act.save();
        //     }
        // }
    }    
}