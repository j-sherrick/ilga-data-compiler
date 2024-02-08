import { initILCSCrawler } from "../services/statutes/ILCSCrawler.js";
import { Chapter, Topic } from "../models/ILCSSchemas/ILCSChapterSchemas.js";
import { Act, Subtopic, Section } from "../models/ILCSSchemas/ILCSActSchemas.js";
import ILCSModelFactory from "../services/statutes/ILCSModelFactory.js";
import mongoose from "mongoose";
import readline from "readline";
import connectDB from "./connectILCS.js";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const crawler = await initILCSCrawler();

const ilcsCollection = connectDB();

/**
 * Saves the initial top level index of {@link Chapter} and {@link Topic} documents to the ILCS database.
 * For a description of the ILCS schema, see https://www.ilga.gov/commission/lrb/lrbnew.htm.  
 * 
 * @param { Chapter[] } chapters the array of Chapters initialized by {@link initILCSCollection}
 * @param { Topic[] } topics the array of Topics initialized by {@link initILCSCollection}
 * @param { boolean } resetChapters if true, the Chapter collection will be reset before saving
 * @param { boolean } resetTopics if true, the Topic collection will be reset before saving
 * @returns { boolean } true if the top level index of the ILCS has been saved to the database, false otherwise
 */
async function saveILCSTopLevelIndex(chapters, topics, resetChapters = false, resetTopics = false) {
    console.log(`${chapters.length} chapters and ${topics.length} topics have been initialized.`);
    let save = await rl.question("Do you want to save the top level index of the ILCS to the database? (yes/no) ");
    save = save.trim().toLowerCase();
    save = (save === "yes" || save === 'y') ? true : false;
    if (save) {
        try {
            if(resetChapters) Chapter.deleteMany({}, err => console.error(err));
            let chaptersResult = await Chapter.insertMany(chapters, { rawResult: true });

            if (resetTopics) Topic.deleteMany({}, err => console.error(err));
            let topicsResult = await Topic.insertMany(topics, { rawResult: true });

            console.log(`Inserted ${chaptersResult.insertedCount} chapters and ${topicsResult.insertedCount} topics into the database.`);
        } catch (error) {
            if (error instanceof mongoose.Error) {
                console.error("A database error occurred:", error.message);
            }
            else {
                console.error("An unknown error occurred:", error.message);
            }
            save = false;
        }
    }
    else {
        console.log("Controller did not perform save operation.");
        save = false;
    }
    return save;
}


/**
 * Saves the {@link Act} array for a {@link Chapter} to the ILCS database.
 * This array contains only the title, prefix, and URL of each act, and not the text of the act.
 * @param {Act[]} acts the array of Acts initialized by {@link initActs}
 * @returns { boolean } true if the acts have been saved to the database, false otherwise
 */
async function saveILCSActs(acts, resetCollection = false) {
    console.log(`This chapter has ${acts.length} acts.`);
    let save = await rl.question("Do you wish to save all acts to the database? (yes/no) ");
    save = save.trim().toLowerCase();
    save = (save === "yes" || save === 'y') ? true : false;
    if (save) {
        try {
            if(resetCollection) Act.deleteMany({}, err => console.error(err));

            let actsResult = await Act.insertMany(acts, { rawResult: true });
            console.log(`Inserted ${actsResult.insertedCount} acts into the database.`);
        } catch (error) {
            if (error instanceof mongoose.Error) {
                console.error("A database error occurred:", error.message);
            }
            else {
                console.error("An unknown error occurred:", error.message);
            }
            save = false;
        }
    }
    else {
        console.log("This chapter's acts have not been saved to the database.");
        save = false;
    }
    return save;
}

/**
 * Saves the {@link Subtopic} array for an {@link Act} to the ILCS database.
 * @param {Subtopic[]} subtopics the array of Subtopics initialized by {@link initActs}
 * @returns { boolean } true if the subtopics have been saved to the database, false otherwise
 */
async function saveILCSSubtopics(subtopics, resetCollection = false) {
    console.log(`This act has ${subtopics.length} subtopics.`);
    let save = await rl.question("Do you wish to save all subtopics to the database? (yes/no) ");
    save = save.trim().toLowerCase();
    save = (save === "yes" || save === 'y') ? true : false;
    if (save) {
        try {
            if(resetCollection) {
                Subtopic.deleteMany({}, err => console.error(err));
            }
            let subtopicsResult = await Subtopic.insertMany(subtopics, { rawResult: true });
            console.log(`Inserted ${subtopicsResult.insertedCount} subtopics into the database.`);
        } catch (error) {
            if (error instanceof mongoose.Error) {
                console.error("A database error occurred:", error.message);
            }
            else {
                console.error("An unknown error occurred:", error.message);
            }
            save = false;
        }
    }
    else {
        console.log("This act's subtopics have not been saved to the database.");
        save = false;
    }
    return save;
}


/**
 * Saves the {@link Section} array referenced within each {@link Act} object, to the ILCS database.
 * This array contains the entire written text of the act.
 * For a description of the ILCS schema, see https://www.ilga.gov/commission/lrb/lrbnew.htm.
 * @param { Section[] } sections the array of Sections initialized by {@link initSections}
 * @returns { boolean } true if the sections have been saved to the database, false otherwise
 */
async function saveILCSActText(sections) {
    // console.log(`This act has ${sections.length} sections of text.`);
    let save = true;
    // save = save.trim().toLowerCase();
    // save = (save === "yes" || save === 'y') ? true : false;
    if (save) {
        try {
            let sectionsResult = await Section.insertMany(sections, { rawResult: true });
            console.log(`Inserted ${sectionsResult.insertedCount} sections into the database.`);
        } catch (error) {
            if (error instanceof mongoose.Error) {
                console.error("A database error occurred:", error.message);
            }
            else {
                console.error("An unknown error occurred:", error.message);
            }
            save = false;
        }
    }
    else {
        console.log("This act's sections have not been saved to the database.");
        save = false;
    }
    return save;
}

/**
 * @typedef {Object} ILCSCollection
 * @property {Chapter[]} chapters - the array of Chapter objects containing information about the chapters of the ILCS
 * @property {Topic[]} topics - the array of Topic objects containing information about which chapters belong to which topics
 */

/**
 * Initializes the top level {@link Chapter} and {@link Topic} documents of the ILCS collection.
 * @returns { ILCSCollection } an object containing the topics and chapters of the top level of the ILCS
 */
async function initILCSCollection() {
    // await connectDB();
    let chapterObjects = crawler.chapters;
    let chapters = ILCSModelFactory.getNewChaptersArray(chapterObjects);
    let topics = ILCSModelFactory.getNewTopicsArray(chapterObjects, chapters);
    return { chapters, topics };
}

/**
 * @typedef {Object} ILCSActsCollection
 * @property {Act[]} acts - the array of {@link Act} objects containing information about the acts from a chapter
 * @property {Subtopic[]} subtopics - the optional array of {@link Subtopic} objects containing information about the subtopics of an act
 */

/**
 * Initializes the {@link Act} documents of the ILCS collection, and {@link Subtopic} documents, if present.
 * @param {Chapter} chapter 
 * @returns {ILCSActsCollection} an object containing the acts and subtopics of a chapter
 */
async function initActs(chapter) {
    let actObjects = await crawler.getActsFromUrl(chapter.url);
    let acts = ILCSModelFactory.getNewActsArray(actObjects, chapter._id);
    if (actObjects[0].subtopic) {
        let subtopics = ILCSModelFactory.getNewSubtopicsArray(actObjects, acts);
        return { acts, subtopics };
    }
    return { acts };
}

/**
 * Initializes the {@link Section} documents from an {@link Act}.
 * These sections represent the entire written text of an act.
 * @param {Act} act 
 * @returns 
 */
async function initSections(act) {
    let sectionObjects = await crawler.getSectionsFromUrl(act.url);
    let sections = ILCSModelFactory.getNewSectionsArray(sectionObjects, act._id);
    return sections;
}

export async function close() {
    await crawler.close();
    await ilcsCollection.close();

}

export default {
    saveILCSTopLevelIndex,
    saveILCSActs,
    saveILCSSubtopics,
    saveILCSActText,
    initILCSCollection,
    initActs,
    initSections,
    close
}