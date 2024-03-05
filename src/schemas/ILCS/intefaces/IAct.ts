import { Types } from "mongoose";

export interface IAct {
    prefix: string,

    title: string,

    repealed: boolean;
    
    chapter: Types.ObjectId;
    
    url?: string,

    sections?: Types.ObjectId[];

    subtopic?: Types.ObjectId;
}