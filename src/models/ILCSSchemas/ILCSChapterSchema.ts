import mongoose, { Schema, Types } from 'mongoose';

interface IChapter {
    number: string;

    url:    string;

    title:  string;

    topic: Types.ObjectId;

    acts: Types.ObjectId[];
}

const ChapterSchema = new Schema<IChapter>({
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

const Chapter = mongoose.model('Chapter', ChapterSchema);

export { Chapter, IChapter };