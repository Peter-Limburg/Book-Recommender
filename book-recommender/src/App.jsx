import React, { useState } from 'react';
import './App.css';

function App() {
  //useState will go here
  //example:
  //User's input for openai
  // const [databaseQuery, setDatabaseQuery] = useState('');
  //User's query for user
  const [userQuery, setUserQuery] = useState('');
  //Recommendation is database query result
  const [recommendation, setRecommendation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // setDatabaseQuery('');
    setRecommendation([]);

    try {
      const converterResponse = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userQuery }),
      });
      console.log('user value query', userQuery);
      console.log('response of the fetch', converterResponse);

      if (!converterResponse.ok) {
        const parsedError = await converterResponse.json();
        setError(parsedError.err);
      }
      const parsedConverterResponse = await converterResponse.json();
      console.log(parsedConverterResponse);
      // setDatabaseQuery(parsedConverterResponse.databaseQuery);
      setRecommendation(parsedConverterResponse.recommendation);
    } catch (err) {
      setError('Error processing your request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container'>
      <header>
        <h1>Let&apos;s discover your next great read!</h1>
      </header>
      <div className='wrapper'>
        <form onSubmit={handleSubmit}>
          <label>
            I want to read a book about:{' '}
            <input
              type='text'
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder='Enter a description of what you are looking for'
            />
          </label>
          <button type='submit' disabled={loading}>
            {loading ? 'Getting Recommendation...' : 'Get Recommendation'}
          </button>
        </form>
        {/*Only shows error paragraph if error state exists*/}
        {error && <p className='error'>{error}</p>}

        {recommendation && (
          <div className='recommendation'>
            <h2>Recommendation:</h2>
            <ul>
              {recommendation.map((rec, index) => (
                <li key={index}>
                  <strong>Title:</strong> {rec.title} <br />
                  <strong>Author:</strong> {rec.author} <br />
                  <strong>Description:</strong> {rec.description} <br />
                  <strong>Categories:</strong> {rec.categories}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
