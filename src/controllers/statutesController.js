import { initILCSCrawler } from "../services/ILCSCrawler.js";
import ILCSFactory from "../services/ILCSFactory.js";
import readline from "readline";
import connectDB from "./connectDB.js";

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

const { getChaptersArray, getTopicsArray } = ILCSFactory.modelFactory();

export default {

    async initILCSCollection() {
        // await connectDB();

        const crawler = await initILCSCrawler();
        let chapters  = getChaptersArray(crawler.chapters);

        crawler.close();
    }
}