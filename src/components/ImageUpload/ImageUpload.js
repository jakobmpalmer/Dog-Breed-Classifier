import React, { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

function ImageUpload({ updateDogSeen }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [predictionAccuracy, setPredictionAccuracy] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [predictionLoading, setPredictionLoading] = useState(false);

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  useEffect(() => {
    if (prediction !== null || predictionAccuracy !== null) {
      setPrediction(null);
      setPredictionAccuracy(null);
    }
  }, [selectedImage, prediction, predictionAccuracy]); 

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
    } catch (error) {
      setErrorMessage('Unable to classify image. Please try again with a different photo.');
    } finally {
      setPredictionLoading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {selectedImage && (
        <div>
          <img alt="Preview" src={URL.createObjectURL(selectedImage)} />
          <div>
            <button onClick={handleButtonClick} disabled={predictionLoading}>
              {predictionLoading ? 'Analyzing...' : 'Send Image'}
            </button>

            {predictionLoading && (
              <div>
                <CircularProgress sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
                <svg width={0} height={0}>
                  <defs>
                    <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#e01cd5" />
                      <stop offset="100%" stopColor="#1CB5E0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            )}

            {prediction && (
              <div>
                <h3>I think this is a <i>{prediction}</i></h3>
                {predictionAccuracy && (
                  <h3>Confidence: {predictionAccuracy}%</h3>
                )}
              </div>
            )}

            {errorMessage && <h3>{errorMessage}</h3>}
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
