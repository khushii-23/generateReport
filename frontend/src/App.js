import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import BrowserRouter
import Login from './components/Login';
import Home from './components/Home';

function App() {
  return (
    <Router> {/* Wrap Routes with BrowserRouter */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
