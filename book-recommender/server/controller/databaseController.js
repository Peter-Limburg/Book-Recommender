import pkg from 'pg';
import 'dotenv/config';

const PG_URI = process.env.PG_URI;
const { Pool } = pkg;

// create a new pool here using the connection string above
const pool = new Pool({
  connectionString: PG_URI,
});

// Test connection on startup
pool
  .connect()
  .then((client) => {
    console.log('Successfully connected to database');
    client.release();
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });


export const queryDatabase = async (_req,res,next) => {
  
    const { databaseQuery } = `SELECT * FROM books WHERE books.authors = "Agatha Christie" `;
    

  if (!databaseQuery) {
    const error = {
      log: 'Database query middleware did not receive a query',
      status: 500,
      message: { err: 'An error occurred before querying the database' },
    };
    return next(error);
  }

  try {

    console.log('Executing query:', databaseQuery);
    const response = await pool.query(databaseQuery); 

    console.log('Query successful:', response.rows);

    res.locals.resultQuery = response.rows[0];
    console.log('res.locals.resultQuery:', res.locals.resultQuery);
    return next();

  } catch (error) {
      console.error('Database query error details:', {
        message: error.message,
        stack: error.stack,
      });
      return next(error);
    } 
    
  };


export function query(text,params,callback) {
  console.log('executed query', text);
  return pool.query(text, params, callback);
}

