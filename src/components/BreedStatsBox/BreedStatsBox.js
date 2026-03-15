import React from 'react';
import styles from './BreedStatsBox.module.scss';

const BreedStatsBox = ({ stats, breedName }) => {
  // Don't render if no stats provided
  if (!stats || Object.keys(stats).length === 0) {
    return null;
  }

  // Badge color mapping
  const getBadgeClass = (category, value) => {
    if (!value) return '';

    const lowerValue = value.toLowerCase();

    if (category === 'exercise') {
      if (lowerValue === 'low') return styles.badgeBlue;
      if (lowerValue === 'moderate') return styles.badgeGreen;
      if (lowerValue === 'high') return styles.badgeOrange;
      if (lowerValue === 'very high') return styles.badgeRed;
    }

    if (category === 'trainability') {
      if (lowerValue === 'easy') return styles.badgeGreen;
      if (lowerValue === 'moderate') return styles.badgeBlue;
      if (lowerValue === 'difficult') return styles.badgeOrange;
      if (lowerValue === 'challenging') return styles.badgeRed;
    }

    if (category === 'grooming') {
      if (lowerValue === 'low') return styles.badgeGreen;
      if (lowerValue === 'moderate') return styles.badgeBlue;
      if (lowerValue === 'high') return styles.badgeOrange;
    }

    return styles.badgeDefault;
  };

  return (
    <div className={styles.statsCard}>
      <h3 className={styles.cardTitle}>{breedName} Statistics</h3>

      <div className={styles.statsList}>
        {/* Size and Weight Row */}
        {(stats.size || stats.weight) && (
          <div className={styles.statRow}>
            {stats.size && (
              <div className={styles.statItem}>
                <div className={styles.statIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 6H3M21 12H3M21 18H3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Size</span>
                  <span className={styles.statValue}>{stats.size}</span>
                </div>
              </div>
            )}

            {stats.weight && (
              <div className={styles.statItem}>
                <div className={styles.statIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Weight</span>
                  <span className={styles.statValue}>{stats.weight}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Lifespan and Exercise Row */}
        {(stats.lifespan || stats.exercise) && (
          <div className={styles.statRow}>
            {stats.lifespan && (
              <div className={styles.statItem}>
                <div className={styles.statIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 6V12L16 14" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Lifespan</span>
                  <span className={styles.statValue}>{stats.lifespan}</span>
                </div>
              </div>
            )}

            {stats.exercise && (
              <div className={styles.statItem}>
                <div className={styles.statIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Exercise</span>
                  <span className={`${styles.badge} ${getBadgeClass('exercise', stats.exercise)}`}>
                    {stats.exercise}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Grooming and Trainability Row */}
        {(stats.grooming || stats.trainability) && (
          <div className={styles.statRow}>
            {stats.grooming && (
              <div className={styles.statItem}>
                <div className={styles.statIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 12h20M6 12v10M18 12v10M10 12v10M14 12v10M2 6l10-4 10 4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Grooming</span>
                  <span className={`${styles.badge} ${getBadgeClass('grooming', stats.grooming)}`}>
                    {stats.grooming}
                  </span>
                </div>
              </div>
            )}

            {stats.trainability && (
              <div className={styles.statItem}>
                <div className={styles.statIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 12v5c3 3 9 3 12 0v-5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Trainability</span>
                  <span className={`${styles.badge} ${getBadgeClass('trainability', stats.trainability)}`}>
                    {stats.trainability}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BreedStatsBox;
