import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './LockScreen.css';

const LockScreen = () => {
  const { unlockScreen } = useAuth();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleUnlock = (e) => {
    e.preventDefault();
    if (unlockScreen(pin)) {
      setPin('');
      setError('');
    } else {
      setError('Falscher PIN');
    }
  };

  return (
    <div className="lock-screen-overlay">
      <div className="lock-screen-box">
        <h1>🔒 Bildschirm gesperrt</h1>
        <p>Bitte PIN eingeben, um fortzufahren.</p>
        <form onSubmit={handleUnlock}>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="PIN"
            maxLength="4"
            required
          />
          <button type="submit">Entsperren</button>
        </form>
        {error && <p className="lock-screen-error">{error}</p>}
      </div>
    </div>
  );
};

export default LockScreen;