import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { queryOpenAI } from '../controller/openaiController.js';
import { queryDatabase } from '../controller/databaseController.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import 'dotenv/config';

// Get the current file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load test cases from the JSON file
const categories_test_cases_path = path.resolve(
  __dirname,
  './test_cases/categories_test_cases.json'
);
const categories_test_cases = JSON.parse(
  fs.readFileSync(categories_test_cases_path, 'utf-8')
);

const supabase = createClient(process.env.PG_URI, process.env.PG_API_Key_ADMIN);

async function evaluatePipeline() {
  const results = [];

  for (const testCase of categories_test_cases) {
    const { userQuery, expectedSQL, expectedResults } = testCase;

    // Simulate a fake request and response
    const fakeReq = {};
    const fakeRes = {
      locals: {
        naturalLanguageQuery: userQuery,
      },
      status: function () {
        return this;
      },
      json: function () {
        return this;
      },
    };

    const next = (err) => {
      if (err) console.error(err);
    };

    // Query OpenAI to generate the SQL
    await queryOpenAI(fakeReq, fakeRes, next);

    // Capture the generated SQL query
    const generatedSQL = fakeRes.locals.databaseQuery;

    // Query the database with the generated SQL
    fakeRes.locals.databaseQuery = generatedSQL;
    await queryDatabase(fakeReq, fakeRes, next);

    // Capture the recommendation results
    const recommendations = fakeRes.locals.recommendation;

    // Evaluate SQL correctness and recommendation relevance
    const isSQLCorrect = generatedSQL.trim() === expectedSQL.trim();
    const areRecommendationsRelevant =
      JSON.stringify(recommendations) === JSON.stringify(expectedResults);

    results.push({
      userQuery,
      generatedSQL,
      isSQLCorrect,
      recommendations,
      areRecommendationsRelevant,
    });
  }

  // Append results to the output file
  const outputPath = path.resolve(__dirname, './evaluation_results.json');

  const labeledResults = {
    test: `Test Run `,
    timestamp: new Date().toISOString(),
    results,
  };

  fs.writeFileSync(
    outputPath,
    JSON.stringify(labeledResults, null, 2),
    'utf-8'
  );

  console.log(`Evaluation Results appended to: ${outputPath}`);
}

evaluatePipeline().catch(console.error);
