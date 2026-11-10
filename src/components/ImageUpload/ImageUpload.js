import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { breedSlug } from '../../utils/breedSlug';
import { displayName } from '../../values/breedNames';
import styles from './ImageUpload.module.scss';

const API_URL = process.env.REACT_APP_API_URL;
// The API scales to zero when idle, so the first request may wait for it to start.
const FIRST_REQUEST_TIMEOUT_MS = 60000;
const REQUEST_TIMEOUT_MS = 20000;

const healthUrl = (apiUrl) => apiUrl.replace(/\/predict\/?$/, '/health');

// Photos from the dataset's held-out test set, which the model never trained on.
const SAMPLES = [
  { breed: 'Golden Retriever', src: '/samples/golden-retriever.jpg' },
  { breed: 'Corgi', src: '/samples/corgi.jpg' },
  { breed: 'Siberian Husky', src: '/samples/siberian-husky.jpg' },
  { breed: 'Dhole', src: '/samples/dhole.jpg' },
  { breed: 'French Bulldog', src: '/samples/french-bulldog.jpg' },
];

// Phone camera photos can be larger than the API's 10 MB limit and slow to upload on
// mobile data. The model only sees 224x224 pixels, so send a 1024px copy of large photos.
async function shrinkImage(file, maxSide = 1024) {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = maxSide / Math.max(bitmap.width, bitmap.height);
    if (scale >= 1) return file;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9));
    return blob ? new File([blob], 'photo.jpg', { type: 'image/jpeg' }) : file;
  } catch (error) {
    return file;
  }
}

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
  const [isDragging, setIsDragging] = useState(false);
  // The true breed when the photo is one of the samples; null for the visitor's own photos.
  const [sampleBreed, setSampleBreed] = useState(null);

  // Wake the API in the background as soon as the page loads.
  useEffect(() => {
    if (!API_URL) return;
    fetch(healthUrl(API_URL))
      .then((response) => setServerReady(response.ok))
      .catch(() => {});
  }, []);

  const handleImageChange = (event) => {
    // Nothing is chosen when the picker or camera is cancelled; keep the current photo.
    if (!event.target.files[0]) return;
    setSelectedImage(event.target.files[0]);
    setSampleBreed(null);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    // Ignore leaving into a child element of the drop area.
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setSampleBreed(null);
    } else if (file) {
      setErrorMessage('Please drop an image file (PNG or JPG).');
    }
  };

  // Paste an image copied from anywhere (for example "Copy image" in a browser).
  useEffect(() => {
    const handlePaste = (event) => {
      const item = [...event.clipboardData.items].find((i) => i.type.startsWith('image/'));
      if (item) {
        event.preventDefault();
        setSelectedImage(item.getAsFile());
        setSampleBreed(null);
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  useEffect(() => {
    setPrediction(null);
    setPredictionAccuracy(null);
    setTop5Predictions(null);
    setErrorMessage('');
  }, [selectedImage]);

  // Samples are classified right away but don't count toward the compendium.
  const handleSampleClick = async (sample) => {
    try {
      const blob = await (await fetch(sample.src)).blob();
      const file = new File([blob], sample.src.split('/').pop(), { type: blob.type });
      setSelectedImage(file);
      setSampleBreed(sample.breed);
      classify(file, { countAsSeen: false });
    } catch (error) {
      setErrorMessage('Could not load the sample photo.');
    }
  };

  const classify = async (image, { countAsSeen = true } = {}) => {
    setPredictionLoading(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('image', await shrinkImage(image));

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
      if (countAsSeen) {
        updateDogSeen(data.breed);
      }
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
      <div
        className={`${styles.uploadArea} ${isDragging ? styles.dragging : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
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
              <p className={styles.uploadHint}>or paste an image · PNG, JPG, JPEG (MAX. 10MB)</p>
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

      {/* Shown only on touch devices: opens the rear camera directly. */}
      <label htmlFor="camera-input" className={styles.cameraButton}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
        Take a photo
      </label>
      <input
        id="camera-input"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageChange}
        className={styles.fileInput}
      />

      {!selectedImage && errorMessage && (
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>{errorMessage}</p>
        </div>
      )}

      {selectedImage && (
        <div className={styles.previewContainer}>
          <button
            onClick={() => classify(selectedImage)}
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
                <p className={styles.breedName}>{displayName(prediction)}</p>
                {sampleBreed && (
                  <p className={styles.sampleCheck}>
                    Sample photo: {displayName(sampleBreed)}{' '}
                    {prediction === sampleBreed ? (
                      <span className={styles.sampleCorrect}>✓ correct</span>
                    ) : (
                      <span className={styles.sampleWrong}>✗ not quite</span>
                    )}
                  </p>
                )}
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
                        <Link
                          key={index}
                          to={`/compendium/${breedSlug(pred.breed)}`}
                          className={styles.otherPredictionItem}
                          title={`Read about the ${displayName(pred.breed)} in the compendium`}
                        >
                          <span className={styles.otherBreedName}>{displayName(pred.breed)}</span>
                          <span className={styles.otherConfidence}>
                            {Math.round(pred.confidence * 10000) / 100}%
                          </span>
                        </Link>
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

      <div className={styles.samples}>
        <p className={styles.samplesLabel}>No dog photo handy? Try one:</p>
        <div className={styles.samplesList}>
          {SAMPLES.map((sample) => (
            <button
              key={sample.src}
              onClick={() => handleSampleClick(sample)}
              disabled={predictionLoading}
              className={styles.sampleButton}
              aria-label={`Classify a sample photo of a ${sample.breed}`}
            >
              <img src={sample.src} alt="" className={styles.sampleImage} />
              <span className={styles.sampleName}>{sample.breed}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ImageUpload;
