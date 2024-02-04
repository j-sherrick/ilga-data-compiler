import { initILCSCrawler } from "../services/ILCSCrawler.js";
import ILCSModelFactory from "../services/ILCSModelFactory.js";
import readline from "readline";
import connectDB from "./connectDB.js";

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

const { getNewChaptersArray, getNewTopicsArray, getNewActsArray, getNewSubtopicsArray } = ILCSModelFactory;
const crawler = await initILCSCrawler();

async function initILCSCollection() {
    // await connectDB();

    let chapterObjects = crawler.chapters;
    let chapters = getNewChaptersArray(chapterObjects);
    let topics = getNewTopicsArray(chapterObjects, chapters);
    return { chapters, topics };
}

async function initActs(chapter) {
    let actObjects = await crawler.getActsFromUrl(chapter.url);
    let acts = getNewActsArray(actObjects, chapter._id);
    if (actObjects.subtopic) {
        let subtopics = getNewSubtopicsArray(actObjects, acts);
        return { acts, subtopics };
    }
    return { acts };
}

async function initSections(act) {
    let sectionObjects = await crawler.getSectionsFromUrl(act.url);
    let sections = getNewSectionsArray(sectionObjects, act._id);
    return sections;
}

export async function close() {
    await crawler.close();
}

export default {
    initILCSCollection,
    initActs,
    initSections,
    close
}