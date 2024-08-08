import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Login({setActiveTab}) {
  const [username, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('https://web422-backend.onrender.com/api/users/login', {
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
      console.error('Login failed:', error);
      // Handle error (e.g., show error message)
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={username}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}
