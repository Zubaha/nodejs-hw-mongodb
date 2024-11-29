import dotenv from 'dotenv';
dotenv.config();
import { setupServer } from "./server.js";
import { initMongoConnection } from "./db/initMongoConnection.js";

const startServer = async () => {
  await initMongoConnection();
  setupServer();
};

startServer();
