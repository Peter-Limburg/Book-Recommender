import React, { useState } from 'react';
import './App.css';

function App() {
  //useState will go here
  //example:
  //User's input for openai
  const [databaseQuery, setDatabaseQuery] = useState('');
  //User's query for user
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState('');
  //Recommendation is database query result
  const [recommendation, setRecommendation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setDatabaseQuery('');
    setRecommendation([]);

    try {
      const converterResponse = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ naturalLanguageQuery }),
      });
      if (!converterResponse.ok) {
        const parsedError = await converterResponse.json();
        setError(parsedError.err);
      } else {
        const parsedConverterResponse = await converterResponse.json();
        setDatabaseQuery(parsedConverterResponse.databaseQuery);
        setRecommendation(parsedConverterResponse.recommendation);
      }
    } catch (err) {
      setError('Error processing your request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header>
        <h1>Let's discover your next great read!</h1>
      </header>
      <form onSubmit={handleSubmit}>
        <label>
          I want to read a book about:{' '}
          <input
            type='text'
            value={naturalLanguageQuery}
            onChange={(e) => setNaturalLanguageQuery(e.target.value)}
            placeholder='Enter a description of what you are looking for'
          />
        </label>
        <button type='submit' disabled={loading}>
          {loading ? 'Getting Recommendation...' : 'Get Recommendation'}
        </button>
      </form>
      {/*Only shows error paragraph if error state exists*/}
      {error && <p className='error'>{error}</p>}
      {/*Only shows recommendaiton paragraph if recommendation state exists*/}
      {recommendation && <p className='recommendation'>{recommendation}</p>}
    </div>
  );
}

export default App;
