import { initILCSCrawler } from "../services/crawlers.js";
import { Chapter, Act, Topic, Subtopic } from "../models/StatuteSchemas.js";
import { parseActsToArray } from "../services/parsers.js";
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

function getSection(section, actId) {
    const newSection = new Section({
        header: {
            number: section.header.number,
            reference: section.header.reference
        },
        text: section.text,
        source: section.source,
        act: actId
    });
    return newSection;
}

function getSectionsArray(sections, actId) {
    let sectionsArray = [];
    for (const section of sections) {
        sectionsArray.push(getSection(section, actId));
    }
    return sectionsArray;
}

function getAct(act, chapterId) {
    const newAct = new Act({
        prefix: act.prefix,
        title: act.title,
        url: act.url,
        chapter: chapterId,
        sections: [],
    });
}

function getActsArray(acts, chapterId) {
    let actsArray = [];
    let subtopicsArray = [];

    let currentAct = {};
    let currentSubtopic = {};

    for (const act of acts) {
        currentAct = getAct(act, chapterId);
        if(act.subtopic) {
            if (act.subtopic.name !== currentSubtopic.name) {
                currentSubtopic = getSubtopic(act.subtopic);

                currentSubtopic.acts.push(currentAct._id);
                subtopicsArray.push(currentSubtopic);
                console.log(`\n\n${currentSubtopic.name}`);

                currentAct.subtopic = currentSubtopic._id;
            }
        }
        actsArray.push(currentAct);
    }
    return actsArray;
}

function getChapter(chapter, topicId) {
    const newChapter = new Chapter({
        number: chapter.number,
        url: chapter.url,
        title: chapter.title,
        topic: topicId,
        acts: []
    });
    return newChapter;
}

function getTopic(topic) {
    const newTopic = new Topic({
        series: topic.series,
        name: topic.name,
        chapters: []
    });
    return newTopic;
}

function getSubtopic(subtopic) {
    const newSubtopic = new Subtopic({
        name: subtopic.name,
        acts: []
    });
    return newSubtopic;
}

export default {
    async initILCSCollection() {
        await connectDB();


        const crawler = await initILCSCrawler();
        const chapters  = crawler.chapters;
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


            let acts = await crawler.getActsFromUrl(chapter.url);
            acts = parseActsToArray(acts);
            acts = getActsArray(acts, currentChapter._id);      // Get array of Acts
            for (const act of acts) {
                currentChapter.acts.push(act._id);

                let sections = await crawler.getSectionsFromUrl(act.url);
                sections = parseActText(sections);
                sections = getSectionsArray(sections, act._id);  // Get array of Sections
                for (const section of sections) {
                    act.sections.push(section._id);
                }
                await act.save();
            }
        }
    }    
}