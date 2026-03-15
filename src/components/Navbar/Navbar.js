import React from 'react';
import { Link } from "react-router-dom";
import styles from './Navbar.module.scss';

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <div className={styles.navBrand}>
          <Link to='/'>
            Jakob Paulson-Palmer
          </Link>
        </div>

        <div className={styles.navLinks}>
          <Link to="/" className={styles.navLink}>Home</Link>
          <Link to="/about" className={styles.navLink}>About</Link>
          <Link to="/compendium" className={styles.navLink}>Compendium</Link>
          <a href='https://github.com/jakobmpalmer' target='_blank' rel="noopener noreferrer" className={styles.navLink}>
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
