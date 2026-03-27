import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validEmail = process.env.REACT_APP_AUTH_EMAIL || 'admin@example.com';
  const validPassword = process.env.REACT_APP_AUTH_PASSWORD || '123456';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (email.trim() === validEmail && password === validPassword) {
      onLogin();
    } else {
      setError('Email o contraseña incorrectos');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: 'var(--bg)',
      color: 'var(--text1)',
    }}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        width: '300px',
      }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            marginBottom: '10px',
            padding: '10px',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            backgroundColor: 'var(--bg2)',
            color: 'var(--text1)',
          }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            marginBottom: '10px',
            padding: '10px',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            backgroundColor: 'var(--bg2)',
            color: 'var(--text1)',
          }}
        />
        <button type="submit" style={{
          padding: '10px',
          backgroundColor: 'var(--accent)',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}>
          Iniciar Sesión
        </button>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;