import { useState } from 'react';
import RE from '../constants/images/RE.png'; // Import the background image
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('devcell@somaiya.edu');
  const [password, setPassword] = useState('devcell');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate=useNavigate();

  const handleLogin = () => {
    if (!username.includes('@somaiya.edu')) {
      setErrorMessage('Invalid Username');
      return;
    }

    if (password !== 'devcell') {
      setErrorMessage('Incorrect password. The password must be "devcell".');
      return;
    }

    setErrorMessage('');
    navigate('/home');
  };

  // Inline style for background image
  const backgroundStyle = {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  };

  // Inline style for the img tag
  const imgStyle = {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: '-1',
  };

  return (
    <div style={backgroundStyle}>
      <img src={RE} alt="Background" style={imgStyle} />
      <div style={{ maxWidth: '400px', width: '100%', padding: '20px', backgroundColor: 'rgba(255, 255, 255, 0.8)',marginLeft:'50vw', borderRadius: '8px' }}>
        <h2 style={{ textAlign: 'center' }}>Login</h2>
        <div style={{ marginBottom: '20px' }}>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ced4da', marginTop: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ced4da', marginTop: '8px' }}
          />
        </div>
        {errorMessage && (
          <p style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>{errorMessage}</p>
        )}
        <button
          onClick={handleLogin}
          style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' }}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;