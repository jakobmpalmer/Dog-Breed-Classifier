from flask import Flask, request
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
from io import BytesIO
from flask_cors import CORS

import logging

model = None
model_path = './dog_breed_densenet_improved_acc0.9457.keras'

breed_names = ['Afghan', 'African Wild Dog', 'Airedale', 'American Hairless',
 'American Spaniel', 'Basenji', 'Basset', 'Beagle', 'Bearded Collie',
 'Bermaise', 'Bichon Frise', 'Blenheim', 'Bloodhound', 'Bluetick',
 'Border Collie', 'Borzoi', 'Boston Terrier', 'Boxer', 'Bull Mastiff',
 'Bull Terrier', 'Bulldog', 'Cairn', 'Chihuahua', 'Chinese Crested', 'Chow',
 'Clumber', 'Cockapoo', 'Cocker', 'Collie', 'Corgi', 'Coyote', 'Dalmation',
 'Dhole', 'Dingo', 'Doberman', 'Elk Hound', 'French Bulldog', 'German Sheperd',
 'Golden Retriever', 'Great Dane', 'Great Perenees', 'Greyhound',
 'Groenendael', 'Irish Spaniel', 'Irish Wolfhound', 'Japanese Spaniel',
 'Komondor', 'Labradoodle', 'Labrador', 'Lhasa', 'Malinois', 'Maltese',
 'Mex Hairless', 'Newfoundland', 'Pekinese', 'Pit Bull', 'Pomeranian', 'Poodle',
 'Pug', 'Rhodesian', 'Rottweiler', 'Saint Bernard', 'Schnauzer',
 'Scotch Terrier', 'Shar_Pei', 'Shiba Inu', 'Shih-Tzu', 'Siberian Husky',
 'Vizsla', 'Yorkie']

try:
    model = tf.keras.models.load_model(model_path)
    print(f"Model loaded successfully from {model_path}")
except Exception as e:
    print(f"Error loading model: {e}")

app = Flask(__name__)
CORS(app, origins=["*"])

log_handler = logging.StreamHandler()
log_handler.setLevel(logging.DEBUG)
app.logger.setLevel(logging.DEBUG)

@app.route('/')
def index():
    return "Dog Breed Classifier API v2 - Now with Top 5 Predictions!"

def densenet_preprocess(img):
    """Preprocess image for DenseNet model"""
    image_array = np.asarray(img)
    image_array = image_array.astype('float32') / 255.0

    # Resize to 224x224
    img = tf.image.resize(image_array, (224, 224))

    # ImageNet normalization
    mean_vec = [0.485, 0.456, 0.406]
    img -= mean_vec

    return img

@app.route('/predict', methods=['POST'])
def predict():
    """Predict dog breed with top 5 predictions"""

    # Check if model is loaded
    if model is None:
        return {'error': 'Model failed to load'}, 500

    if 'image' not in request.files:
        return {'error': 'No image file provided'}, 400

    # Load and preprocess image
    file = request.files['image']
    img = image.load_img(BytesIO(file.read()), target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array /= 255.0  # Normalize pixel values

    # Get predictions
    predictions = model.predict(img_array)
    predictions = predictions[0]  # Remove batch dimension

    # Get top 5 predictions
    top_5_indices = np.argsort(predictions)[-5:][::-1]  # Sort descending

    # Build response
    top_predictions = []
    for idx in top_5_indices:
        top_predictions.append({
            'breed': breed_names[idx],
            'confidence': float(predictions[idx])
        })

    # Get the top prediction
    top_breed = top_predictions[0]['breed']
    top_confidence = top_predictions[0]['confidence']

    # Log client info
    client_ip = request.remote_addr
    client_ip_noproxy = request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr)
    print(f'Client IP: {client_ip} | Real IP: {client_ip_noproxy}')
    print(f'Top prediction: {top_breed} ({top_confidence*100:.2f}%)')
    print('Top 5 predictions:')
    for i, pred in enumerate(top_predictions, 1):
        print(f"  {i}. {pred['breed']:20s} - {pred['confidence']*100:6.2f}%")

    return {
        'breed': top_breed,
        'accuracy': top_confidence,
        'top_5': top_predictions
    }

if __name__ == '__main__':
    print("Running Dog Breed Classifier API v2")
    app.run(host='0.0.0.0', port=5000)
