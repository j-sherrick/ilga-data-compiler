import { Types } from "mongoose";

export interface IChapter {
    number:string;

    url:string;

    title:string;

    topic?:Types.ObjectId;

    acts?:Types.ObjectId[];
}