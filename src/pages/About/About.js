import React from 'react';
import { Link } from 'react-router-dom';
import styles from './About.module.scss';

function About() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.content}>
        <h1>About This Project</h1>

        <section className={styles.section}>
          <h2>Project Overview</h2>
          <p>
            I built this end-to-end computer vision system after earning my Data Science certificate
            to refine my practical ML engineering skills. The goal was to experience the complete
            pipeline—from training a deep learning model, to creating a purpose-built frontend,
            to deploying both a web application and ML backend API. This project demonstrates
            full-stack capabilities spanning data science, web development, and cloud infrastructure.
          </p>
        </section>

        <section className={styles.section}>
          <h2>How It Works</h2>
          <p>
            The frontend is built with React, featuring image upload and real-time breed prediction
            display with confidence scores. The backend is a Flask API, originally on AWS EC2, now
            served from Google Cloud Run with ONNX Runtime. It serves a DenseNet121 model with
            custom classification layers. Transfer learning
            leverages ImageNet pre-trained weights, fine-tuned on 7,946 dog images across 70 breeds.
            Data augmentation (shear, zoom, horizontal flip) and L1 regularization combat overfitting.
            The API accepts image uploads, preprocesses them exactly as in training (resizing to
            224×224 and scaling pixel values to the 0–1 range), and returns breed predictions with
            confidence scores.
          </p>
        </section>

        <section className={styles.section}>
          <h2>The ML Model</h2>
          <p>
            The classifier uses <strong>DenseNet121</strong> architecture with transfer learning
            from ImageNet weights. I added a custom classification head (global average pooling,
            a 1,024-unit dense layer and a 70-way softmax) and fine-tuned the whole network on a
            curated dataset of 70 dog breeds from Kaggle, including both common domestic breeds and wild canids
            (Coyote, Dhole, Dingo, African Wild Dog). The model was trained using TensorFlow/Keras
            with the Adam optimizer and categorical crossentropy loss.
          </p>
          <p className={styles.metricPlaceholder}>
            <strong>96.4%</strong> test accuracy on 700 held-out images (100% top-5).
          </p>
        </section>

        <section className={styles.section}>
          <h2>Deployment</h2>
          <p>
            The ML model is deployed as a Flask REST API. The API handles image preprocessing,
            model inference, and returns JSON responses with breed predictions and confidence
            scores. It originally ran on an AWS EC2 instance; it is now served from Google Cloud Run
            with ONNX Runtime, which scales to zero when idle so it costs nothing between requests.
            Deploying and managing the backend infrastructure taught me valuable lessons about cloud
            hosting, API design, and managing compute costs for ML workloads.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Challenges Overcome</h2>

          <div className={styles.challenge}>
            <h3>Data Augmentation & Overfitting</h3>
            <p>
              Initial training showed severe overfitting—high training accuracy but poor validation
              performance. I implemented comprehensive data augmentation strategies (random shear, zoom,
              horizontal flips) and added L1 regularization to the custom classification layers. This
              significantly improved generalization to unseen images.
            </p>
          </div>

          <div className={styles.challenge}>
            <h3>Real-World Data Complexity</h3>
            <p>
              Computer vision in practice presents challenges that clean datasets don't reveal. Some
              individual dogs don't exhibit typical breed characteristics, breed mixes confuse the
              classifier, and photo quality/angles vary dramatically. This taught me that model
              performance on curated test sets doesn't always translate directly to production use cases.
            </p>
          </div>

          <div className={styles.challenge}>
            <h3>Backend Deployment & API Design</h3>
            <p>
              Deploying the Flask API on AWS EC2 required learning server configuration, dependency
              management, and API endpoint design. Managing the backend to handle image uploads, run
              inference efficiently, and return predictions reliably presented real-world engineering
              challenges beyond the model training itself.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Tech Stack</h2>
          <ul className={styles.techList}>
            <li><strong>Frontend:</strong> React, Material-UI, React Router, SCSS</li>
            <li><strong>Backend:</strong> Flask REST API, ONNX Runtime, Google Cloud Run (originally AWS EC2)</li>
            <li><strong>ML:</strong> DenseNet121 (transfer learning), ImageNet pre-trained weights</li>
            <li><strong>Data:</strong> 7,946 training images, 70 dog breeds (Kaggle dataset)</li>
            <li><strong>Tools:</strong> Python, scikit-learn, Jupyter Notebooks (Kaggle)</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Links</h2>
          <p>
            The source code, training notebook, model and dataset are all on the{' '}
            <Link to="/links">Project Links</Link> page.
          </p>
        </section>
      </div>
    </div>
  );
}

export default About;
