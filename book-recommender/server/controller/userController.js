export const parseNaturalLanguageQuery = async (req, res, next) => {
  try {
    const { userQuery } = req.body;
    // console.log(userQuery);

    // Check if the query exists
    if (!userQuery) {
      const error = {
        log: 'User query not provided',
        status: 400,
        message: { err: 'A user query is required.' },
      };
      return next(error);
    }

    // Check if the query is a string
    if (typeof userQuery !== 'string') {
      const error = {
        log: 'User query is not a string',
        status: 400,
        message: { err: 'The User query must be a string.' },
      };
      return next(error);
    }

    // Store the valid query for the next middleware
    res.locals.naturalLanguageQuery = userQuery.trim();
    console.log(
      'res.locals.naturalLanguageQuery',
      res.locals.naturalLanguageQuery
    );

    return next();
  } catch (err) {
    const error = {
      log: `Error in parseNaturalLanguageQuery: ${err.message}`,
      status: 500,
      message: { err: 'Internal server error' },
    };
    return next(error);
  }
};
