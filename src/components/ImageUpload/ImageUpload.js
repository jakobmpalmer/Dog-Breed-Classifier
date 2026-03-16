import React, { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import styles from './ImageUpload.module.scss';

function ImageUpload({ updateDogSeen }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [predictionAccuracy, setPredictionAccuracy] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [top5Predictions, setTop5Predictions] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [predictionLoading, setPredictionLoading] = useState(false);

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  useEffect(() => {
    setPrediction(null);
    setPredictionAccuracy(null);
    setTop5Predictions(null);
    setErrorMessage('');
  }, [selectedImage]);

  const handleButtonClick = async () => {
    setPredictionLoading(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const apiUrl = process.env.REACT_APP_API_URL;
      if (!apiUrl) {
        throw new Error('API URL not configured');
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction from server');
      }

      const data = await response.json();
      setPrediction(data.breed);
      updateDogSeen(data.breed);
      setPredictionAccuracy(Math.round(data.accuracy * 10000) / 100);
      if (data.top_5) {
        setTop5Predictions(data.top_5);
      }
    } catch (error) {
      setErrorMessage('Unable to classify image. Please try again with a different photo.');
    } finally {
      setPredictionLoading(false);
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <div className={styles.uploadArea}>
        <label htmlFor="file-input" className={styles.uploadLabel}>
          {selectedImage ? (
            <div className={styles.imageWrapper}>
              <img
                alt="Preview"
                src={URL.createObjectURL(selectedImage)}
                className={styles.previewImage}
              />
            </div>
          ) : (
            <>
              <div className={styles.uploadIcon}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <p className={styles.uploadText}>Click to upload or drag and drop</p>
              <p className={styles.uploadHint}>PNG, JPG, JPEG (MAX. 10MB)</p>
            </>
          )}
        </label>
        <input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className={styles.fileInput}
        />
      </div>

      {selectedImage && (
        <div className={styles.previewContainer}>
          <button
            onClick={handleButtonClick}
            disabled={predictionLoading}
            className={`${styles.classifyButton} ${predictionLoading ? styles.loading : ''}`}
          >
            {predictionLoading ? 'Analyzing...' : 'Classify Image'}
          </button>

          {predictionLoading && (
            <div className={styles.loadingContainer}>
              <CircularProgress
                size={40}
                sx={{
                  color: 'var(--color-primary)'
                }}
              />
            </div>
          )}

          {prediction && (
            <div className={styles.resultContainer}>
              <div className={styles.resultCard}>
                <h3 className={styles.resultTitle}>Classification Result</h3>
                <p className={styles.breedName}>{prediction}</p>
                {predictionAccuracy && (
                  <div className={styles.confidenceContainer}>
                    <span className={styles.confidenceLabel}>Confidence:</span>
                    <span className={styles.confidenceValue}>{predictionAccuracy}%</span>
                  </div>
                )}

                {top5Predictions && top5Predictions.length > 1 && (
                  <div className={styles.otherPredictionsContainer}>
                    <h4 className={styles.otherPredictionsTitle}>Other Possibilities:</h4>
                    <div className={styles.otherPredictionsList}>
                      {top5Predictions.slice(1).map((pred, index) => (
                        <div key={index} className={styles.otherPredictionItem}>
                          <span className={styles.otherBreedName}>{pred.breed}</span>
                          <span className={styles.otherConfidence}>
                            {Math.round(pred.confidence * 10000) / 100}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {errorMessage && (
            <div className={styles.errorContainer}>
              <p className={styles.errorMessage}>{errorMessage}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
