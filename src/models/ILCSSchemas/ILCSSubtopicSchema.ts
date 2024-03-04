import mongoose, { Schema } from "mongoose";

const SubtopicSchema = new Schema({
    name: String,
    acts: [{
        type: Schema.Types.ObjectId,
        ref: 'Act'
    }]
});