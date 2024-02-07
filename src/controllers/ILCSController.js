import { initILCSCrawler } from "../services/ILCSCrawler.js";
import { Chapter, Topic } from "../models/Chapter.js";
import ILCSModelFactory from "../services/ILCSModelFactory.js";
import mongoose from "mongoose";
import readline from "readline";
import connectDB from "./connectDB.js";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const crawler = await initILCSCrawler();

/**
 * Saves the initial top level index of Chapters and Topics to the ILCS database. For a description of the ILCS schema, see https://www.ilga.gov/commission/lrb/lrbnew.htm.  
 * 
 * @param { Chapter[] } chapters the array of Chapters initialized by {@link initILCSCollection}
 * @param { Topic[] } topics the array of Topics initialized by {@link initILCSCollection}
 * @returns { boolean } true if the top level index of the ILCS has been saved to the database, false otherwise
 */
async function saveILCSTopLevelIndex(chapters, topics) {
    console.log(`${chapters.length} chapters and ${topics.length} topics have been initialized.`);
    let save = await rl.question("Do you want to save the top level index of the ILCS to the database? (yes/no) ");
    save = save.trim().toLowerCase();
    save = (save === "yes" || save === 'y') ? true : false;
    if (save) {
        try {
            let chaptersResult = await Chapter.insertMany(chapters, { rawResult: true });
            let topicsResult = await Topic.insertMany(topics, { rawResult: true });
            console.log(`Inserted ${chaptersResult.insertedCount} chapters and ${topicsResult.insertedCount} topics into the database.`);
        } catch (error) {
            if (error instanceof mongoose.Error) {
                console.error("An database error occurred:", error.message);
            }
            else {
                console.error("An unknown error occurred:", error.message);
            }
            save = false;
        }
    }
    else {
        console.log("The top level index of the ILCS has not been saved to the database.");
    }
    return save;
}

/**
 * @param { Act } act 
 */
async function saveILCSAct(act) {

}

async function initILCSCollection() {
    // await connectDB();
    let chapterObjects = crawler.chapters;
    let chapters = ILCSModelFactory.getNewChaptersArray(chapterObjects);
    let topics = ILCSModelFactory.getNewTopicsArray(chapterObjects, chapters);
    return { chapters, topics };
}

async function initActs(chapter) {
    let actObjects = await crawler.getActsFromUrl(chapter.url);
    let acts = ILCSModelFactory.getNewActsArray(actObjects, chapter._id);
    if (actObjects[0].subtopic) {
        let subtopics = ILCSModelFactory.getNewSubtopicsArray(actObjects, acts);
        return { acts, subtopics };
    }
    return { acts };
}

async function initSections(act) {
    let sectionObjects = await crawler.getSectionsFromUrl(act.url);
    let sections = ILCSModelFactory.getNewSectionsArray(sectionObjects, act._id);
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