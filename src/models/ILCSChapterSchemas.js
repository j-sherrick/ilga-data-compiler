import mongoose from 'mongoose';
const { Schema } = mongoose;

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