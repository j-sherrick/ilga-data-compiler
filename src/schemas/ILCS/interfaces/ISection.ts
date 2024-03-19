import { Types } from "mongoose";

export interface ISection {
    title: string,

    text: string,

    source?: string,

    act?: Types.ObjectId;
}