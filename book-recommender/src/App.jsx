import React, { useState } from 'react';
import './App.css';

interface parsedConverterResponse {
  databaseQuery: string;
}
function App() {
  //useState will go here
  //example:
  const [userQuery, setUserQuery] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRecommendation('');

    try {
      const converterResponse = await fetch('/api', {
        method: 'POST',
headers : {
  'Content-Type': 'application/json',
},
body: JSON.stringify({userQuery}),
      });
      if (converterResponse.status !== 200) {
        const parsedError = await converterResponse.json();
        setError(parsedError.err);
      } else {
        const parsedConverterResponse = await converterResponse.json();

    };


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
            value={userQuery}
            placeholder='Enter a description of what you are looking for'
          />
        </label>
        <button type='submit'>Get book recommendation</button>
      </form>
      <div>
        <h2>Recommendation:</h2>
        <p>{recommendation}</p>
      </div>
    </div>
  );
}

export default App;
