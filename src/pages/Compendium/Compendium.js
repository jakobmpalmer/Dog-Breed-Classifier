import React from 'react';
import styles from './Compendium.module.scss';
import DogBreedTile from '../../components/DogBreedTile/DogBreedTile';
import { dogBreeds } from '../../values/dogs';

function Compendium({ dogData }) {
  if (dogData === null) {
    return <div>Loading Dog Data...</div>;
  }

  const numSeen = Object.values(dogData).filter(dog => dog.seen).length;

  return (
    <div className={styles.backgroundColor}>
      <div className={styles.pageContent}>
        <div className={styles.pageTitle}>
          <h1>Compendium: ({numSeen}/70)</h1>
        </div>

        <div className={styles.dogGrid}>
          {dogBreeds.map((name) => {
            const seen = dogData[name]?.seen ?? false;
            return (
              <DogBreedTile key={name} title={name} seen={seen} />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Compendium;
