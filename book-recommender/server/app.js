import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { queryDatabase } from './controller/databaseController.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api', queryDatabase, (req, res) => {
  return res.status(200).json(res.locals.recommendation)
});

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
