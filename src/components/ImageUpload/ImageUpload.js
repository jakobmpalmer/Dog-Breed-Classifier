import React, { useState, useEffect } from 'react';

function ImageUpload() {
  const [selectedImage, setSelectedImage] = useState(null);

  const [predictionAccuracy, setPredictionAccuracy] = useState(null);
  const [prediction, setPrediction] = useState(null); // State for prediction


  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
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

      const response = await fetch('https://18.144.165.10/predict', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      console.log("Prediction:", data);
      setPrediction(data.breed); // Update state with prediction
      setPredictionAccuracy(Math.round(data.accuracy * 10000) / 100); // Update state with prediction
    } catch (error) {
      console.error("Error sending request:", error);
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
            
            {predictionAccuracy ? <h3>I am {predictionAccuracy}% sure</h3> : <h3></h3>}
            {prediction ? <h3>That this is a, <i>{prediction}</i></h3> : <h3></h3>}
          </div>
          
        </div>
        
      )}
    </div>
  );
}

export default ImageUpload;
