import { initILCSCrawler } from "../services/crawlers.js";
import { Chapter, Act, Topic, Subtopic } from "../models/StatuteSchemas.js";
import readline from "readline";
import connectDB from "./connectDB.js";


export async function run() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    const ilcs = await initILCSCrawler();
    const chapters = ilcs.chapters.map(chapter => new Chapter(chapter));
    
}

export async function populateActs(chapters) {

}