import pkg from 'pg';
import 'dotenv/config';

const PG_URI = process.env.PG_URI;
const { Pool } = pkg;

const pool = new Pool({
  connectionString: PG_URI,
  ssl: { rejectUnauthorized: false },
});

pool
  .connect()
  .then((client) => {
    console.log('Successfully connected to database');
    client.release();
  })
  .catch((err) => {
    console.error(
      'Error connecting to the database during server startup:',
      err.message
    );
    process.exit(1);
  });

export const queryDatabase = async (_req, res, next) => {
  const { databaseQuery } = res.locals;
  console.log(databaseQuery);

  if (!databaseQuery) {
    const error = {
      log: 'Database query middleware did not receive a query 1',
      status: 500,
      message: { err: 'An error occurred before querying the database 1' },
    };
    return next(error);
  }

  try {
    const response = await pool.query(databaseQuery); // Access the query method
    console.log('Query successful:', response.rows);

    res.locals.recommendation = response.rows;
    return next();
  } catch (error) {
    
    return next(error)
  }
};
