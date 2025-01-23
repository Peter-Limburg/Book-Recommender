import React, { useState } from 'react';
import './App.css';

function App() {
  //useState will go here
  //example:
  const [userQuery, setUserQuery] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const handleSubmit = async (e) => {};

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
