import { initILCSCrawler } from "../services/ILCSCrawler.js";
import ILCSModelFactory from "../services/ILCSModelFactory.js";
import readline from "readline";
import connectDB from "./connectDB.js";

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

const { getNewChaptersArray, getNewTopicsArray } = ILCSModelFactory;

export default {

    async initILCSCollection() {
        // await connectDB();

        const crawler = await initILCSCrawler();
        let chapters = crawler.chapters;
        chapters = getNewChaptersArray(chapters);
        console.log(chapters.length);
        console.log(chapters);
        for (const chapter of chapters) {
            console.log(chapter.title);
        }

        crawler.close();
    }
}