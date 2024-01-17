import mongoose from 'mongoose';
const { Schema } = mongoose;

const SectionSchema = new Schema({
    number: Number,
    source: String,
    text: String
});

const ActSchema = new Schema({
    prefix: Number,
    title: String,
    citation: String,
    sections: [SectionSchema],
    subtopic: {
        type: Schema.Types.ObjectId,
        ref: 'Subtopic'
    },
    chapter: {
        type: Schema.Types.ObjectId,
        ref: 'Chapter'
    }
});

const ChapterSchema = new Schema({
    number: Number,
    topic: {
        type: Schema.Types.ObjectId,
        ref: 'Topic'
    },
    acts: [{
        type: Schema.Types.ObjectId,
        ref: 'Act'
    }]
});