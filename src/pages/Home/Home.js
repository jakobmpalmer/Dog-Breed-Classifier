import React from 'react'

import ImageUpload from '../../components/ImageUpload/ImageUpload'
import styles from './Home.module.scss'

function Home({ updateDogSeen, setDogData, getDogData }) {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>Dog Breed Classifier</h1>
          <p className={styles.subtitle}>Upload an image to identify the dog breed using AI</p>
        </div>
        <ImageUpload updateDogSeen={updateDogSeen}/>
      </div>
    </div>
  )
}

export default Home