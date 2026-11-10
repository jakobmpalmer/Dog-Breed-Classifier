import styles from './DogBreedTile.module.scss'
import React, { useState } from 'react'
import { Link } from "react-router-dom";

const DogBreedTile = ({title, seen, thumbnailPath}) => {
    const [imageError, setImageError] = useState(false);

    let tilePath = title.toLowerCase()
    tilePath = tilePath.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.toLowerCase())
    .join('-');

    // The same folder the breed page reads from, e.g. "shih-tzu" -> "Shih Tzu".
    const folder = tilePath
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

    const imageSrc = thumbnailPath || `/compendium/${folder}/image.jpg`;

    return (
      <Link to={tilePath} className={styles.tileLink}>
        <div className={styles.tileCard}>
          <div className={styles.imageContainer}>
            {!imageError ? (
              <img
                src={imageSrc}
                alt={`${title} dog`}
                className={styles.tileImage}
                onError={() => setImageError(true)}
              />
            ) : (
              <div className={styles.imagePlaceholder}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
            )}
            {seen && (
              <div className={styles.seenBadge}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="currentColor" />
                  <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
          <div className={styles.tileContent}>
            <h3 className={styles.tileTitle}>{title}</h3>
          </div>
        </div>
      </Link>
    )
}

export default DogBreedTile