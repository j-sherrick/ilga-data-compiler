import mongoose, { Schema, Types } from "mongoose";
import { ISubtopic } from "../interfaces/ISubtopic";

const SubtopicSchema = new Schema<ISubtopic>({
    name: {
        type: String,
        required: true
    },
    acts: [{
        type: Schema.Types.ObjectId,
        ref: 'Act'
    }]
});

const Subtopic = mongoose.model('Subtopic', SubtopicSchema);

export { Subtopic };