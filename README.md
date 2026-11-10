# Dog Breed Classifier

Upload a photo of a dog and get its breed, from 70 breeds, with a confidence score and the
top 5 predictions.

**Live site:** https://dogclassifier.jakobmpalmer.com

<!-- Screenshots: add one of the upload/prediction view and one of the compendium here. -->

## The model

I trained a DenseNet121 image classifier on Kaggle, starting from ImageNet weights. I replaced
its output layer with my own classification head (global average pooling, a 1,024-unit dense
layer with L1 regularization, and a 70-way softmax) and fine-tuned the whole network on about
7,900 images of 70 breeds, including wild canids like the dhole, coyote and African wild dog.
To keep it from overfitting, I used data augmentation (shear, zoom and horizontal flips), L1
regularization and a low learning rate.

- **Test accuracy:** 96.4% on 700 held-out images (100% top-5)
- **Training notebook:** [Kaggle](https://www.kaggle.com/code/jakobmp/dog-breed-classification-densenet)
- **Model and model card:** [Hugging Face](https://huggingface.co/jakobmp/dog-breed-densenet121)
  (exported to ONNX)
- **Dataset:** [70 Dog Breeds Image Data Set](https://www.kaggle.com/datasets/gpiosenka/70-dog-breedsimage-data-set)

## The app

- **Classifier** (`/`): upload a photo and see the predicted breed, its confidence and the
  next four most likely breeds.
- **Compendium** (`/compendium`): a guide to all 70 breeds that tracks which ones you've
  identified. Each breed has its own page at `/compendium/:breed`.
- **About** (`/about`): how the project works.

The backend is a Flask API that runs the model with ONNX Runtime on Google Cloud Run. It
scales to zero when idle, so the app pings it when the page loads to wake it up before the
first prediction.

## Tech stack

- **Model:** TensorFlow/Keras, DenseNet121 transfer learning, trained on Kaggle
- **Frontend:** React 18, Material UI 5, React Router 6, SCSS modules, remark for the breed
  guides; hosted on Vercel
- **Backend:** Flask, ONNX Runtime, Docker, Google Cloud Run (originally AWS EC2)

## Running locally

Requires Node.js.

```bash
npm install
cp .env.example .env.local   # sets REACT_APP_API_URL to the API's /predict endpoint
npm start
```

The app opens at http://localhost:3000, which the deployed API accepts requests from.
`REACT_APP_API_URL` is read when the dev server starts or the app is built, so restart
`npm start` after changing it. `npm run build` makes a production build in `build/`.

## How it was built

I trained the model and built the original app and its AWS backend. I later used AI coding
tools to clean up and build out the frontend, and to migrate the backend from AWS EC2 to
ONNX Runtime on Google Cloud Run.
