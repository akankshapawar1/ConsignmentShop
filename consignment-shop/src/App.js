import React, { useState } from 'react';

// Inlined styles
const styles = {
  
  //... (other styles)
  form: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    background: '#fff',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  //... (other styles)
};

function Login() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      body: JSON.stringify({ action: "login", user_id: userId, password })
    };

    try {
      const response = await fetch('https://q15htzftq3.execute-api.us-east-1.amazonaws.com/beta/login', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (response.status === 401) {
        throw new Error('Invalid username or password');
      }
      const responseBody = JSON.parse(data.body);
      setMessage(responseBody.message);
      if (responseBody.isSiteManager && data.statusCode === 200) {
        window.location.href = 'sitemanager_page.html'; 
      } else if (data.statusCode === 200 && responseBody.isSiteManager === false) {
        window.location.href = 'storeowner_page.html';
      }
    } catch (error) {
      setMessage(error.body);
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Computer Consignment Shop</h2>
      <h2 style={{ textAlign: 'center' }}>Login</h2>
      <form style={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="user_id">Username:</label>
        <input
          type="text"
          id="user_id"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default Login;
