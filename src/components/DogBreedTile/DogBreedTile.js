import styles from './DogBreedTile.module.scss'
import React from 'react'

import {
  Link
} from "react-router-dom";

const DogBreedTile = ({title, seen}) => {
    let tilePath = title.toLowerCase()
    tilePath = tilePath.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.toLowerCase())
    .join('-');
  
    return (
          <Link to={tilePath} className={styles.tileLink}>
            <div className={styles.dogTile}>
              <div className={styles.tileImage}>
              <img src={`/compendium/${title}/image.jpg`} alt={`${title} dog`} /> 
              </div>
                
              <p>{title}</p> 
              {seen ?
                <div className={styles.checkmarkContainer}>
                  <p>✔️</p>
                </div> :
                <></>
              }
                 

            </div>
            
          </Link>
          )
  }


export default DogBreedTile