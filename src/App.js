import React, { useState, useEffect  } from 'react';
import logo from './logo.svg';
import './App.css';

import Home from './pages/Home/Home'
import About from './pages/About/About'
import Compendium from './pages/Compendium/Compendium'
import Navbar from './components/Navbar/Navbar';
import BreedPage from './pages/BreedInfoPage/BreedInfoPage';

import Footer from './components/Footer/Footer';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";


import { COLOR_PALETTES }  from './values/colors'
import {dogBreeds} from './values/dogs'; 

function App() {

  let location = useLocation(); // Get the current location
  const [dogData, setDogData] = useState(null);

  useEffect(() => {
    const updateFromLocalStorage = async () => { 
        // const storedData = await getDogData();
        let storedData = await getDogData();
         

        if(storedData == null) {
          storedData = createDogDataObject();
          localStorage.setItem('dogData', JSON.stringify(storedData));
        }
        setDogData(storedData); // <-- Maybe Unecessary
    };
    updateFromLocalStorage();
}, [location]); // Include 'location' (from React Router) in the dependency array

  function updateDogSeen(breedName) {
    let dogData = JSON.parse(localStorage.getItem('dogData'));
    dogData[breedName].seen = true; 
    localStorage.setItem('dogData', JSON.stringify(dogData)); 
    setDogData(dogData)
    console.log('updateDogSeen:', dogData)
  }

  const createDogDataObject = () => {
    return dogBreeds.reduce((accumulator, breedName) => {
      accumulator[breedName] = { seen: false };
      return accumulator;
    }, {});
  }

  function getDogData() {
    setDogData(JSON.parse(localStorage.getItem('dogData')));
    console.log('getDogData:', dogData) 
    // if(dogData == null) {
    //   console.log('99: DogData NULL!!', dogBreeds)
    //     setDogData(createDogDataObject())        
    // }                    
    return dogData; 
  }


  return (
    <div className="App">
      {/* <Router> */}
        <Navbar />
        <Routes>
          <Route path='/' element={<Home getDogData={getDogData} dogData={dogData} setDogData={setDogData} updateDogSeen={updateDogSeen} />} />
          <Route path='/about' element={<About />} />
          <Route path='/compendium' element={<Compendium getDogData={getDogData} setDogData={setDogData} dogData={dogData} />} />
          <Route path='/compendium/:breed' element={<BreedPage />} />
        </Routes>
      
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        
      </header> */}
        
      {/* </Router> */}
      <Footer />
    </div>
  );
}

export default App;
