import mongoose from "mongoose";

const { mongoUser, mongoPW, mongoHost, mongoPort, mongoDB } = process.env;

// encode all portions of Mongo URI string
const MONGO_USER = encodeURIComponent(mongoUser);
const MONGO_PW = encodeURIComponent(mongoPW);
const MONGO_DB = encodeURIComponent(mongoDB);
const MONGO_HOST = encodeURIComponent(mongoHost);
const MONGO_PORT = encodeURIComponent(mongoPort);

const ILCS_DB_STRING = `mongodb://${MONGO_USER}:${MONGO_PW}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;

const connectDB = async () => {
    let connection = null;
    try {
        console.log(`Connecting to ${ILCS_DB_STRING}`);
        await mongoose.connect(ILCS_DB_STRING);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
    return connection;
};

export default connectDB;