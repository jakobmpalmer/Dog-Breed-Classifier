import React, { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import styles from './ImageUpload.module.scss';

const API_URL = process.env.REACT_APP_API_URL;
// The API scales to zero when idle, so the first request may wait for it to start.
const FIRST_REQUEST_TIMEOUT_MS = 60000;
const REQUEST_TIMEOUT_MS = 20000;

const healthUrl = (apiUrl) => apiUrl.replace(/\/predict\/?$/, '/health');

// Returns the response, or null if the request failed or timed out.
async function postImage(formData, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(API_URL, { method: 'POST', body: formData, signal: controller.signal });
  } catch (error) {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function ImageUpload({ updateDogSeen }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [predictionAccuracy, setPredictionAccuracy] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [top5Predictions, setTop5Predictions] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [serverReady, setServerReady] = useState(false);
  const [warmingUp, setWarmingUp] = useState(false);

  // Wake the API in the background as soon as the page loads.
  useEffect(() => {
    if (!API_URL) return;
    fetch(healthUrl(API_URL))
      .then((response) => setServerReady(response.ok))
      .catch(() => {});
  }, []);

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

      if (!API_URL) {
        throw new Error('API URL not configured');
      }

      setWarmingUp(!serverReady);
      const timeoutMs = serverReady ? REQUEST_TIMEOUT_MS : FIRST_REQUEST_TIMEOUT_MS;
      let response = await postImage(formData, timeoutMs);
      if (!response || response.status >= 500) {
        // Retry once: the server may still have been starting up.
        setWarmingUp(true);
        response = await postImage(formData, timeoutMs);
      }

      if (!response || !response.ok) {
        throw new Error('Failed to get prediction from server');
      }
      setServerReady(true);

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
      setWarmingUp(false);
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
              {warmingUp && (
                <p className={styles.warmingMessage}>
                  Warming up the model, this can take a few seconds the first time
                </p>
              )}
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
