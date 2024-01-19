import mongoose from 'mongoose';
const { Schema } = mongoose;

const SectionSchema = new Schema({
    number: String,
    source: String,
    text: String
});

const ActSchema = new Schema({
    prefix: String,
    title: String,
    citation: String,
    url: String,
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
    number: String,
    url: String,
    title: String,
    topic: {
        type: Schema.Types.ObjectId,
        ref: 'Topic'
    },
    acts: [{
        type: Schema.Types.ObjectId,
        ref: 'Act'
    }]
});

const TopicSchema = new Schema({
    series: String,
    name: String,
    chapters: [{
        type: Schema.Types.ObjectId,
        ref: 'Chapter'
    }]
});

const SubtopicSchema = new Schema({
    name: String,
    acts: [{
        type: Schema.Types.ObjectId,
        ref: 'Act'
    }]
});