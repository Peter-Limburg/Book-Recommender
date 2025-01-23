import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api', (req, res) => {});

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
