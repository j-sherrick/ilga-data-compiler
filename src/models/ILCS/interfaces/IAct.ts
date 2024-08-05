import { IChapter } from './IChapter.js';
import { ISection } from './ISection.js';
import { ISubtopic } from './ISubtopic.js';

export interface IAct {
    title: string,
    
    url?: string,
    
    prefix?: string,
    
    repealed?: boolean;
    
    chapter?: IChapter;

    sections?: ISection[];

    subtopic?: ISubtopic | string;
}