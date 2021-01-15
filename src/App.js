import React,{ useState,useEffect } from 'react';
import './App.css';
import AutoComplete from './components/AutoComplete';
import Header from './components/Header';



function App() {

  const [data,setData] = useState([])

  function getData() {
    const url = "https://jsonplaceholder.typicode.com/users";
    fetch(url)
      .then(data => data.json())
      .then(data => {
        setData(data.map((person) => person.name))
      })
  }

  useEffect(() => {
    getData();
  }, []);


  return (
    <div >
       <Header/>
       <AutoComplete 
          suggestions={data}
       />
    </div>
  );
}

export default App;
