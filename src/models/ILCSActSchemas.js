import mongoose from 'mongoose';
const { Schema } = mongoose;

const ActSchema = new Schema({
    prefix: String,
    title: String,
    url: String,
    chapter: {
        type: Schema.Types.ObjectId,
        ref: 'Chapter'
    },
    sections: [SectionSchema],
    subtopic: {
        type: Schema.Types.ObjectId,
        ref: 'Subtopic'
    }
});

const SubtopicSchema = new Schema({
    name: String,
    acts: [{
        type: Schema.Types.ObjectId,
        ref: 'Act'
    }]
});

const SectionSchema = new Schema({
    header: {
        number: String,
        reference: String
    },
    text: String,
    source: String,
    act: {
        type: Schema.Types.ObjectId,
        ref: 'Act'
    
    }
});

const Act = mongoose.model('Act', ActSchema);
const Subtopic = mongoose.model('Subtopic', SubtopicSchema);
const Section = mongoose.model('Section', SectionSchema);

export { Act, Subtopic, Section };