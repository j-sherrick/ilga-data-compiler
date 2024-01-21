import mongoose from "mongoose";

const { MONGO_USER, MONGO_PW, MONGO_DB, MONGO_HOST, MONGO_PORT } = process.env;

const ILCS_DB_STRING = `mongodb://${MONGO_USER}:${MONGO_PW}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;

const connectDB = async () => {
    try {
        await mongoose.connect(ILCS_DB_STRING);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

export default connectDB;