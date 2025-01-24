import { promises as fs } from 'fs';
import * as path from 'node:path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const loggingService = async (req, res, next) => {
  if (
    !res.locals.naturalLanguageQuery ||
    !res.locals.databaseQuery ||
    !res.locals.recommendation
  ) {
    const error = {
      log: 'Necessary input was not provided',
      status: 400,
      message: { err: 'An error occured while trying to log the output' },
    };
    return next(error);
  }

  const { naturalLanguageQuery, databaseQuery } = res.locals;
  const databaseQueryResult = res.locals.recommendation;

  console.log('naturalLanguageQuery: ', naturalLanguageQuery);
  try {
    const data = await fs.readFile(
      path.resolve(__dirname, '../loggingService.json'),
      'utf8'
    );
    if (!data) {
      await fs.appendFile(
        path.resolve(__dirname, '../loggingService.json'),
        `[\n${JSON.stringify({
          naturalLanguageQuery,
          databaseQuery,
          databaseQueryResult,
        })}]`
      );
    } else {
      const stat = await fs.stat(
        path.resolve(__dirname, '../loggingService.json')
      );
      const fileSize = stat.size;
      // ']' need to remove this at the end of the file.
      await fs.truncate(
        path.resolve(__dirname, '../loggingService.json'),
        fileSize - 2
      );
      await fs.appendFile(
        path.resolve(__dirname, '../loggingService.json'),
        `,\n${JSON.stringify({
          naturalLanguageQuery,
          databaseQuery,
          databaseQueryResult,
        })}\n]`
      );
    }

    console.log('Data written to file');
    return next();
  } catch (err) {
    console.log(err);
    const error = {
      log: 'unable to write to logfile.',
      status: 500,
      message: { err: 'An error occured while writing to the logfile' },
    };
    return next(error);
  }
};
