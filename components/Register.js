import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Register({ setActiveTab }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://web422-backend.onrender.com/api/users/register', {
        username: username.trim(),  // Ensure to trim any whitespace
        password: password.trim(),
      }, {
        headers: {
          'Content-Type': 'application/json',  // Same header as in curl
        },
      });
      const token = response.data.token;

      // Store the token (example: in localStorage)
      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', username);
      // Handle successful registration (e.g., redirect to login)
      setActiveTab();
    } catch (error) {
      console.error('Registration failed:', error.response ? error.response.data : error.message);
      // Handle error (e.g., display error message)
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input
        type="email"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Register</button>
    </form>
  );
}
