import React, { useEffect, useState } from 'react'

import styles from './Compendium.module.scss'

import {
  Link
} from "react-router-dom";


import DogBreedTile from '../../components/DogBreedTile/DogBreedTile'

import { dogBreeds } from '../../values/dogs'

function Compendium({ getDogData, dogData, setDogData }) {
  
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

  let numSeen = 0;

  // if(dogData == null) {
  //   console.log('COMPENDIUM 34: NULL')
  //   dogData = dogBreeds.reduce((accumulator, breedName) => {
  //     accumulator[breedName] = { seen: false };
  //     return accumulator;
  //   }, {});    
  // }

  useEffect (() => {
      console.log('use effect..')
      // const dogData = JSON.parse(localStorage.getItem('dogData')); 
      getDogData()
      console.log('compendium useEffect | DogData:', getDogData)
  }, [])

//   useEffect(() => {
//     const updateFromLocalStorage = async () => { 
//         const storedData = await getDogData();
//         setDogData(storedData); 
//     };
//     updateFromLocalStorage();
// }, []); // Include 'location' (from React Router) in the dependency array

  console.log("Compendium: DogData:", dogData)

  
  return (
    <div className={styles.backgroundColor}>
      <div className={styles.pageContent}>
          <div className={styles.pageTitle}>
              <h1>Compendium: ({numSeen}/70)</h1>
          </div>
    
          <div className={styles.dogGrid}>
            {breed_names.map((name) => {  
                let nameLower = name.toLowerCase()
                console.log('nameLower:', nameLower)
                let seen = false
                try {
                  console.log('trying:', dogData)
                  console.log('trying2:', dogData[name])
                  // Code that might potentially throw an error due to undefined values
                  seen = dogData[name].seen != undefined ? dogData[name].seen : false                
                } catch (error) {
                  // Handling code if an error occurs
                  console.error("An error occurred:", error); 
                }
                console.log('seen:', seen)
                return(
                  <DogBreedTile key={name} title={name} seen={seen}/>
                )              
            })}
          </div>




      </div>
    </div>
  )
}

export default Compendium


// const DogBreedTile = ({title}) => {
//   let tilePath = title.toLowerCase()
//   tilePath = tilePath.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
//   .map(x => x.toLowerCase())
//   .join('-');

//   return (
//         <Link to={tilePath} className={styles.tileLink}>
//           <div className={styles.dogTile}>
//             <div className={styles.tileImage}>
//             <img src={`/compendium/${title}/image.jpg`} alt={`Image of a ${title} missing`} /> 
//             </div>
              
//               <p>{title}</p>   
//               <div className={styles.checkmarkContainer}>
//                 <p>✔️</p>
//               </div>         
//           </div>
//         </Link>
//         )
// }