import { Types } from "mongoose";

export interface ISection {
    header: {
        number: string,
        reference?: string
    },

    text: string,

    source?: string,

    act?: Types.ObjectId;
}