import React from 'react';
import './Login.css'

const Login = () => {
   return (
      <div>
         <h2>Computer Consignment Shop</h2>
         <h2>Login</h2>

      <form>
      <label>Username:</label>
      <input type="text" id="user_id" required />

      <br />
      <label>Password:</label>
      <input type="password" id="password" required></input>

      <br />
      <button type="submit">Login</button>
      </form>

      <p id="message"></p>
      </div>
   )
}

export default Login;
