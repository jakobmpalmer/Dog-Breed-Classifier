import React from 'react'

import ImageUpload from '../../components/ImageUpload/ImageUpload'
import styles from './Home.module.scss'

function Home({ updateDogSeen, setDogData, getDogData }) {
  return (
    <div className={styles.pageContent}>
        <h1>Upload an Image of a Dog</h1>
        <ImageUpload />
        
    </div>
  )
}

export default Home