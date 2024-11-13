import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRoutes from './routes/contacts.js';
import authRoutes from './routes/auth.js';
import {errorHandler} from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

export const setupServer = () => {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(pino());
    app.use(cookieParser());

    app.use('/contacts', contactsRoutes);
    app.use('/auth', authRoutes);
    app.use('/api-docs', swaggerDocs());
    app.use(notFoundHandler);
    app.use(errorHandler);

    

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

   
    

};
