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
} from "react-router-dom";


import { COLOR_PALETTES }  from './values/colors'

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/compendium' element={<Compendium />} />
          <Route path='/compendium/:breed' element={<BreedPage />} />
        </Routes>
      
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        
      </header> */}
        
      </Router>
      <Footer />
    </div>
  );
}

export default App;
