import React, { useState, useEffect  } from 'react';
import './App.css';

import Home from './pages/Home/Home'
import About from './pages/About/About'
import Compendium from './pages/Compendium/Compendium'
import Links from './pages/Links/Links'
import Navbar from './components/Navbar/Navbar';
import BreedPage from './pages/BreedInfoPage/BreedInfoPage';

import Footer from './components/Footer/Footer';

import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import {dogBreeds} from './values/dogs'; 

function App() {

  let location = useLocation();
  const [dogData, setDogData] = useState(null);

  useEffect(() => {
    const updateFromLocalStorage = async () => {
        let storedData = await getDogData();
         

        if(storedData == null) {
          storedData = createDogDataObject();
          localStorage.setItem('dogData', JSON.stringify(storedData));
        }
        setDogData(storedData);
    };
    updateFromLocalStorage();
}, [location]);

  function updateDogSeen(breedName) {
    let dogData = JSON.parse(localStorage.getItem('dogData'));
    dogData[breedName].seen = true;
    localStorage.setItem('dogData', JSON.stringify(dogData));
    setDogData(dogData);
  }

  const createDogDataObject = () => {
    return dogBreeds.reduce((accumulator, breedName) => {
      accumulator[breedName] = { seen: false };
      return accumulator;
    }, {});
  }

  function getDogData() {
    const storedData = localStorage.getItem('dogData');

    if (storedData === null) {
      return null;
    }

    return JSON.parse(storedData);
  }


  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path='/' element={<Home getDogData={getDogData} dogData={dogData} setDogData={setDogData} updateDogSeen={updateDogSeen} />} />
        <Route path='/about' element={<About />} />
        <Route path='/compendium' element={<Compendium getDogData={getDogData} setDogData={setDogData} dogData={dogData} />} />
        <Route path='/compendium/:breed' element={<BreedPage />} />
        <Route path='/links' element={<Links />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
