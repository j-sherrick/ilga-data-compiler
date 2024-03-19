import { Types } from "mongoose";

export interface IChapter {
    
    title:string;
    
    topic:Types.ObjectId | string;
    
    url:string;
    
    number?:string;
    
    acts?:Types.ObjectId[];
}