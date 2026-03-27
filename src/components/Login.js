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
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: 'var(--bg)',
      color: 'var(--text1)',
      padding: '20px',
    }}>
      <div style={{
        backgroundColor: 'var(--bg2)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '40px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        width: '100%',
        maxWidth: '400px',
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '30px',
          color: 'var(--text1)',
          fontSize: '1.5rem',
          fontWeight: '600',
        }}>
          Iniciar Sesión
        </h2>
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
        }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              marginBottom: '15px',
              padding: '12px',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              backgroundColor: 'var(--bg)',
              color: 'var(--text1)',
              fontSize: '1rem',
              outline: 'none',
            }}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              marginBottom: '20px',
              padding: '12px',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              backgroundColor: 'var(--bg)',
              color: 'var(--text1)',
              fontSize: '1rem',
              outline: 'none',
            }}
          />
          <button type="submit" style={{
            padding: '12px',
            backgroundColor: 'var(--accent)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--accent-hover)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--accent)'}
          >
            Iniciar Sesión
          </button>
          {error && <p style={{
            color: '#ff6b6b',
            marginTop: '15px',
            textAlign: 'center',
            fontSize: '0.9rem'
          }}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;