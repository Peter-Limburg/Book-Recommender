import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { parseNaturalLanguageQuery } from './controller/userController.js';
import { queryDatabase } from './controller/databaseController.js';
import { queryOpenAI } from './controller/openaiController.js';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173', // Your frontend's URL
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow cookies and credentials
  })
);
app.use(express.json());

app.post(
  '/api',
  parseNaturalLanguageQuery,
  queryOpenAI,
  queryDatabase,
  (req, res) => {
    return res.status(200).json(res.locals.recommendation);
  }
);

const errorHandler = (err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = { ...defaultErr, ...err };
  console.log(errorObj.log);
  res.status(errorObj.status).json(errorObj.message);
};

app.use(errorHandler);

export default app;
