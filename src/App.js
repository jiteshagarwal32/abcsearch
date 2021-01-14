import './App.css';
import AutoComplete from './components/AutoComplete';
import Header from './components/Header';

function App() {
  return (
    <div >
       <Header/>
       <AutoComplete 
            suggestions={[
              "Alligator",
              "Tiger",
              "Lion",
              "Baboon",
              "Bask",
              "Crocodilian",
              "Death Roll",
              "Eggs",        
              "Jaws",
              "Reptile",
              "Solitary",
              "Tail",
              "Wetlands"
            ]}
       />
    </div>
  );
}

export default App;
