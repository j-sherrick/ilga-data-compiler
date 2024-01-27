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
    if (act.subtopic) {
        const subtopic = await Subtopic.findOne({ name: act.subtopic });
        if (subtopic) {
            newAct.subtopic = subtopic._id;
            subtopic.acts.push(newAct._id);
            await subtopic.save();
        } else {
            console.log(`Subtopic ${act.subtopic} not found`);
        }
    }
    await newAct.save();

    return newAct;
}

async function saveSectionsToAct(sections, act) {
    for (const section of sections) {
        const newSection = saveSection(section, act._id);
        act.sections.push(newSection._id);
    }
    await act.save();

    return act;
}

async function compileStatutes(chapters, crawler) {
    let currentTopic = chapters[0].topic;
    for (const chapter of chapters) {
        
    }
}

async function createTopic(topic, chapterId) {
    const newTopic = new Topic({
        series: topic.series,
        name: topic.name
    });
    newTopic.chapters.push(chapterId);

    return newTopic;
}

export default {
    async run() {
        const crawler = await initILCSCrawler();
        const chapters  = crawler.chapters;
        
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
        chapter: chapterId
    });
}

function getActsArray(acts, chapterId) {
    let actsArray = [];
    for (const act of acts) {
        actsArray.push(getAct(act, chapterId));
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

function getSubtopic(subtopic, actId) {
    const newSubtopic = new Subtopic({
        name: subtopic.name,
        acts: []
    });
    newSubtopic.acts.push(actId);
    return newSubtopic;
}

async function getActsArrayFromChapter(chapter, crawler) {
    const acts = await crawler.getActsFromChapter(chapter);
    return getActsArray(acts, chapter._id);
}