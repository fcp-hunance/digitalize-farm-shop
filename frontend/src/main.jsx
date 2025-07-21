import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';

const App = () => {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Frontend is running ✅</h1>
      <p>This is the Digitalize Farm Shop frontend.</p>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
