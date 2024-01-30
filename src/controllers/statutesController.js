import { initILCSCrawler } from "../services/ILCSCrawler.js";
import ILCSModelFactory from "../services/ILCSModelFactory.js";
import readline from "readline";
import connectDB from "./connectDB.js";

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

const { getNewChaptersArray, getNewTopicsArray, getNewActsArray } = ILCSModelFactory;
const crawler = await initILCSCrawler();

export async function initILCSCollection() {
    // await connectDB();

    let chapterObjects = crawler.chapters;
    let chapters = getNewChaptersArray(chapterObjects);
    let topics = getNewTopicsArray(chapterObjects, chapters);
    return { chapters, topics };
}

export async function initActs(chapter) {
    let actObjects = await crawler.getActsFromUrl(chapter.url);
    let acts = getNewActsArray(actObjects, chapter._id);
}

export default {


}