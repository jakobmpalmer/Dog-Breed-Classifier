import React from 'react';
import styles from './Compendium.module.scss';
import DogBreedTile from '../../components/DogBreedTile/DogBreedTile';
import { dogBreeds } from '../../values/dogs';

function Compendium({ dogData }) {
  if (dogData === null) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loadingContainer}>
          <p className={styles.loadingText}>Loading Dog Data...</p>
        </div>
      </div>
    );
  }

  const numSeen = Object.values(dogData).filter(dog => dog.seen).length;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageContent}>
        <div className={styles.header}>
          <h1 className={styles.title}>Dog Breed Compendium</h1>
          <p className={styles.progress}>
            <span className={styles.progressCount}>{numSeen}</span> of <span className={styles.progressTotal}>70</span> breeds discovered
          </p>
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
