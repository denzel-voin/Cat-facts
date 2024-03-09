import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [catFact, setCatFact] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  const fetchCatFact = async () => {
    try {
      const response = await axios.get('https://catfact.ninja/fact');
      setCatFact(response.data.fact);
    } catch (error) {
      console.error('Error fetching cat fact:', error);
    }
  };

  const fetchAge = async (inputName) => {
    try {
      const response = await axios.get(`https://api.agify.io/?name=${inputName}`);
      setAge(response.data.age);
    } catch (error) {
      console.error('Error fetching age:', error);
    }
  };

  const handleNameChange = (event) => {
    const inputName = event.target.value;
    setName(inputName);
    clearTimeout(typingTimeout);
    setLoading(true);
    if (inputName) {
      const timeout = setTimeout(() => {
        fetchAge(inputName);
        setLoading(false);
      }, 3000);
      setTypingTimeout(timeout);
    } else {
      setAge('');
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchAge(name);
  };

  useEffect(() => {
    fetchCatFact();
  }, []); // Fetch cat fact on initial render only

  return (
    <div>
      <div>
        <button onClick={fetchCatFact}>Get Cat Fact</button>
        <input type="text" value={catFact} readOnly onClick={(e) => e.target.setSelectionRange(0, 0)} />
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <input type="text" value={name} onChange={handleNameChange} placeholder="Enter your name" />
          <button type="submit" disabled={loading}>Get Age</button>
        </form>
        {loading && <p>Loading...</p>}
        {age && <p>Estimated age: {age}</p>}
      </div>
    </div>
  );
};

export default App;
