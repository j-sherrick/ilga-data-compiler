import { Types } from "mongoose";

export interface IAct {
    title: string,
    
    url?: string,
    
    prefix?: string,
    
    repealed?: boolean;
    
    chapter?: Types.ObjectId;

    sections?: Types.ObjectId[];

    subtopic?: Types.ObjectId | string;
}