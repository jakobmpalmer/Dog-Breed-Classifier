import React from 'react';
import { Link } from "react-router-dom";
import styles from './Navbar.module.scss';

function Navbar() {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.navTitle}>
        <div className={styles.navTitleHighlight}>
          <a href='https://www.linkedin.com/in/jakob-m-palmer/' target='_blank' rel="noopener noreferrer">
            Jakob Paulson-Palmer
          </a>
        </div>
      </div>

      <div style={{
        display: 'flex',
        flex: 1,
        height: '100%',
        justifyContent: 'space-between',
        alignItems: 'center'
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
          <a href='https://github.com/jakobmpalmer' target='_blank' rel="noopener noreferrer">Github</a>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
