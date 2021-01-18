import React,{ useState,useEffect } from 'react';
import './App.css';
import AutoComplete from './components/AutoComplete/AutoComplete';

function App() {

  return (
    <div>
      <h1>ABC - Search</h1>
      <AutoComplete /* suggestions={data}  */ />
    </div>
  );
}

export default App