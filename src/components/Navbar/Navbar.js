import React from 'react';

import styles from './Navbar.module.scss'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Routes,
  Link
} from "react-router-dom";


import { COLOR_PALETTES }  from '../../values/colors'

function Navbar() {

//   const handleScrollTo = (event) => {
//     event.preventDefault(); // Prevent default jump behavior
//     const targetId = event.currentTarget.getAttribute('href');
//     const targetElement = document.querySelector(targetId);
//     if (targetElement) {
//       targetElement.scrollIntoView({ behavior: 'smooth' });
//     }
//   };


  return (
    <div 
        className={styles.mainContainer}>
      <div className={styles.navTitle}>
          <div className={styles.navTitleHighlight}>
            {/* <a href='https://jakobmpalmer.com' target='_blank'>Jakob Paulson-Palmer</a> */}
            <a href='https://www.linkedin.com/in/jakob-m-palmer/' target='_blank'>Jakob Paulson-Palmer</a>
          </div>
      </div>

      <div style={{
        display: 'flex',
        flex: 1,
        height: '100%',
        // padding: '15px',
        justifyContent: 'space-between', // Change to space-between
        alignItems: 'center' // Align items vertically in the middle
      }}>
        <div className={styles.navItem}>
            <Link to="/">Home</Link>
        </div>
        <div className={styles.navItem}>
            <Link to="/about">About</Link>
        </div>
        <div className={styles.navItem}>
            <Link to="/compendium">Compendium</Link>
        </div>
        <div className={styles.navItem}>
            <a href='https://github.com/jakobmpalmer' target='_blank'>Github</a>
        </div>
      </div>
    </div>
  )
}

export default Navbar;
