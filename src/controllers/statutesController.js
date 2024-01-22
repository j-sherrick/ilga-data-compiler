import { initILCSCrawler } from "../services/crawlers";
import { Chapter, Act, Topic, Subtopic } from "../models/StatuteSchemas";


const crawler = await initILCSCrawler();
const chapters = crawler.chapters;