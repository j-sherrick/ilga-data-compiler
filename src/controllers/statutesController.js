import { initILCSCrawler } from "../services/ILCSCrawler.js";
import ILCSModelFactory from "../services/ILCSModelFactory.js";
import readline from "readline";
import connectDB from "./connectDB.js";

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

const { getNewChaptersArray, getNewTopicsArray } = ILCSModelFactory;
const crawler = await initILCSCrawler();

async function initILCSCollection() {
    // await connectDB();

    let chapterObjects = crawler.chapters;
    let chapters = getNewChaptersArray(chapterObjects);
    let topics = getNewTopicsArray(chapterObjects, chapters);
}

export default {


}