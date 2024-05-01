import React, { useState, useEffect } from 'react';

import CircularProgress, {
  circularProgressClasses,
} from '@mui/material/CircularProgress';


function ImageUpload() {
  const [selectedImage, setSelectedImage] = useState(null);

  const [predictionAccuracy, setPredictionAccuracy] = useState(null);
  const [prediction, setPrediction] = useState(null); // State for prediction

  const [errorMessage, setErrorMessage] = useState(null);

  const [predictionLoading, setPredictionLoading] = useState(null);
  


  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
    console.log(prediction)
  };

  useEffect(() => {
    // Reset prediction and accuracy only if they were previously set
    if (prediction !== null || predictionAccuracy !== null) {
      setPrediction(null);
      setPredictionAccuracy(null);
    }
  }, [selectedImage]); 

  const handleButtonClick = async () => {
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      // const response = await fetch('https:// 54.215.128.159/predict', {
      // const response = await fetch ("https://ec2-54-215-128-159.us-west-1.compute.amazonaws.com/predict", {
        const response = await fetch ("https://api.jakobmpalmer.com/predict", {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      console.log("Prediction:", data);
      setPrediction(data.breed); // Update state with prediction
      setPredictionAccuracy(Math.round(data.accuracy * 10000) / 100); // Update state with prediction
      setErrorMessage('')
    } catch (error) {
      console.error("Error sending request:", error);
      setErrorMessage('That didnt work\n', error)
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {selectedImage && (
        <div>
          <img alt="Preview" src={URL.createObjectURL(selectedImage)} />
          <div>
            <button onClick={handleButtonClick}>Send Image</button>
            {predictionLoading ? 
              function GradientCircularProgress() {
                return (
                  <React.Fragment>
                    <svg width={0} height={0}>
                      <defs>
                        <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#e01cd5" />
                          <stop offset="100%" stopColor="#1CB5E0" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <CircularProgress sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
                  </React.Fragment>
                );
              } : <h3></h3>}
            {/* {predictionAccuracy ? <h3>I am {predictionAccuracy}% sure</h3> : <h3></h3>} */}
            {prediction  ? <h3>I think this is a, <i>{prediction}</i></h3> : <h3></h3>}
            <h3>{errorMessage}</h3>
          </div>
          
        </div>
        
      )}
    </div>
  );
}

export default ImageUpload;
