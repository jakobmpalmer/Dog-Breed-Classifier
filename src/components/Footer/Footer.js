import React from 'react'
import styles from './Footer.module.scss'

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <p className={styles.footerText}>
          Developed by <a href='https://www.linkedin.com/in/jakob-m-palmer/' target='_blank' rel="noopener noreferrer">Jakob M Paulson-Palmer</a>
        </p>
      </div>
    </footer>
  )
}

export default Footer