import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/ui/Home';
import GuardTypes from './components/ui/WorkerTypes';
import Companies from './components/ui/Companies';
import Guards from './components/ui/Guards';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
          <Route index element = {<Home />} />
          <Route path="/home" element = {<Home />} />
          <Route path="/companies-for-hire" element = {<Companies />} />
          <Route path="/companies" element = {<Companies />} />
          <Route path="/fleet-worker-register" element = {<Guards />} />
        </Routes>
      </BrowserRouter>
    </div>

  );
}

export default App;