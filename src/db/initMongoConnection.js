import mongoose from 'mongoose';



export const initMongoConnection = async () => {
    const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;

    const mongoUrl = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

    try {
        await mongoose.connect(mongoUrl);
        console.log('Mongo connection successfully established!');
    } catch (error) {
        console.error('Mongo connection failed:', error.message);
        process.exit(1);
    }
};