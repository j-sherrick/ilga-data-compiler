import mongoose, { Schema, Types } from 'mongoose';

interface ISection {
    header: {
        number: string,
        reference?: string
    },

    text: string,

    source?: string,

    act: Types.ObjectId;
}

const SectionSchema = new Schema<ISection>({
    header: {
        number: {
            type: String,
            required: true
        },

        reference: String
    },

    text: {
        type: String,
        required: true
    },

    source: String,

    act: {
        type: Schema.Types.ObjectId,
        ref: 'Act',
        required: true
    }
});

const Section = mongoose.model('Section', SectionSchema);

export { Section, ISection };