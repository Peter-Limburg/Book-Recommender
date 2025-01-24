import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const db_tables = `
    CREATE TABLE books (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        authors TEXT NOT NULL,
        categories TEXT NOT NULL,
        thumbnail TEXT,
        description TEXT,
        published_date INT,
        rating FLOAT,
        num_pages INT
    );`;

export const queryOpenAI = async (req, res, next) => {
  const { naturalLanguageQuery } = res.locals;

  if (!naturalLanguageQuery) {
    const error = {
      log: 'OpenAI query middleware did not receive a query.',
      status: 500,
      message: { err: 'An error occured before querying OpenAI.' },
    };
    return next(error);
  }

  const prompt = `
    You are a helpful assistant. Convert natural language queries into SQL queries for a PostgreSQL database.
    You MUST only respond with valid SQL. Do NOT return markdown, only return SQL.
    If you are not able to produce a valid SQL for given input, then return an empty string.
    ONLY return "SELECT" queries. Do not wrap your output in any sort of strings or labels.

    Follow these steps in order:

    1. Parse the user input:
        - Reword the user input to obtain information that are relevant to the database schema. Eliminate any unnecessary words or phrases that do not relate to the database schema.

    2. Use the database schema as your ground truth:
        - The schema database you will be using, refer to this as your absolute reference: ${db_tables}

    3. Generate the SQL query:
        - Based the database schema and analyzed user input, create a SQL query that will return three results.
        - When using "SELECT" you MUST "SELECT" title, author, description, and categories.
        - The SQL query MUST be a "SELECT" query designed to return three rows of data from the database.
        - Do not return any SQL queries that are capabale of altering data. Return queries that are solely "SELECT" queries. Do not return nested SQL queries.
        - Ensure that the spelling of important key details (such as title, author, description) are consistent. 

    4. Return the SQL query:
        - Return the SQL query that you generated. Do not return any other information or data.
    `;
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      logprobs: true,
      top_logprobs: 3,
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        {
          role: 'user',
          content: naturalLanguageQuery,
        },
      ],
      n: 3,
    });

    // debugging
    console.log('AopenAI Response: ', completion.choices[0]?.message);

    const databaseQuery = completion.choices[0]?.message?.content;
    res.locals.databaseQuery = databaseQuery.trim();

    console.log('Generated SQL Query:', databaseQuery);

    return next();
  } catch (err) {
    const error = {
      log: `queryOpenAIL: Error: OpenAI error: ${err.message}`,
      status: 500,
      message: {
        err: 'An error occurred while querying OpenAI',
      },
    };
    return next(error);
  }
};
