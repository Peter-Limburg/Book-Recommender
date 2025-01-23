import OpenAI from 'openai';
import dotenv from 'dotenv';
// import { RequestHandler } from 'express';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const db_tables = `
    Minibooks Table Schema:
    - id: int8
    - title: text
    - authors: text
    - categories: text
    - thumbnail: text
    - description: text
    - published_date: int8
    - rating: float8
    - num_pages: int8
    `;

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

  const prompt = 'You are a natural language databse interface.';
  try {
    const completion = await openai.chat.completion.create({
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
    });

    // debugging
    // console.log('AopenAI Response: ', completion.choices[0]?.message);
    // console.log('logs: ', completion.choices[0]?.logprobs?.content);

    if (!completion.choices[0]?.message.content) {
      const error = {
        log: 'OpenAI did not return a completion.',
        status: 500,
        message: {
          err: 'An error occured while querying OpenAI',
        },
      };
      return next(error);
    }

    res.locals.databaseQuery = completion.choices[0].message.conent?.toString();

    return next();
  } catch (err) {
    const error = {
      log: `queryOpenAIL: Error: OpenAI error: ${err.message}`,
      status: 500,
      message: {
        err: 'An error occurred while querying OpenAI',
      },
    };
    next(error);
  }
};
