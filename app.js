import * as dotenv from 'dotenv';
import express, {json} from "express";
import mongoose from "mongoose";
import morgan from 'morgan'
import cors from 'cors';
import { config } from './src/config/index.js';
import {customRouter} from "./src/routes/customerRoutes.js";


dotenv.config();
const app = express();
const PORT = config.port || 3000;

mongoose
    .connect(config.mongodb_connection_url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {console.log('Connected to MongoDB');})
    .catch(err => console.error('Error connecting to MongoDB:', err));

app.use(json());

app.use(morgan('tiny'))
app.use(cors());

app.use('/api/v1/customer', customRouter)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});