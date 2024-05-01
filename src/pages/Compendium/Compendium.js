import React from 'react'

import styles from './Compendium.module.scss'

import {
  Link
} from "react-router-dom";


function Compendium() {

let breed_names = ['Afghan', 'African Wild Dog', 'Airedale', 'American Hairless',
 'American Spaniel', 'Basenji', 'Basset', 'Beagle', 'Bearded Collie',
 'Bermaise', 'Bichon Frise', 'Blenheim', 'Bloodhound', 'Bluetick',
 'Border Collie', 'Borzoi', 'Boston Terrier', 'Boxer', 'Bull Mastiff',
 'Bull Terrier', 'Bulldog', 'Cairn', 'Chihuahua', 'Chinese Crested', 'Chow',
 'Clumber', 'Cockapoo', 'Cocker', 'Collie', 'Corgi', 'Coyote', 'Dalmation',
 'Dhole', 'Dingo', 'Doberman', 'Elk Hound', 'French Bulldog', 'German Sheperd',
 'Golden Retriever', 'Great Dane', 'Great Perenees', 'Greyhound',
 'Groenendael', 'Irish Spaniel', 'Irish Wolfhound', 'Japanese Spaniel',
 'Komondor', 'Labradoodle', 'Labrador', 'Lhasa', 'Malinois', 'Maltese',
 'Mex Hairless', 'Newfoundland', 'Pekinese', 'Pit Bull', 'Pomeranian', 'Poodle',
 'Pug', 'Rhodesian', 'Rottweiler', 'Saint Bernard', 'Schnauzer',
 'Scotch Terrier', 'Shar_Pei', 'Shiba Inu', 'Shih-Tzu', 'Siberian Husky',
 'Vizsla', 'Yorkie']




  return (
    <div className={styles.backgroundColor}>
      <div className={styles.pageContent}>
          <div className={styles.pageTitle}>
              <h1>Compendium</h1>
          </div>
    
          <div className={styles.dogGrid}>
            {breed_names.map((name) => {                        
                return(
                  <DogBreedTile key={name} title={name} />
                )              
            })}
          </div>

          

      </div>
    </div>
  )
}

export default Compendium


const DogBreedTile = ({title}) => {
  let tilePath = title.toLowerCase()
  tilePath = tilePath.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
  .map(x => x.toLowerCase())
  .join('-');

  return (
        <Link to={tilePath}>
          <div className={styles.dogTile}>
            
              <p>{title}</p>            
          </div>
        </Link>
        )
}