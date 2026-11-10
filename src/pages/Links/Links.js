import React from 'react';
import styles from './Links.module.scss';

// Cards with a logoBackground show the whole image (sized by logoSize) on that
// color; the others show it as a full-size photo.
const LINK_GROUPS = [
  {
    title: 'Project',
    links: [
      {
        name: 'Source Code',
        image: '/links/github.svg',
        logoBackground: '#181717',
        site: 'GitHub',
        url: 'https://github.com/jakobmpalmer/Dog-Breed-Classifier',
        description: 'The React app behind this site.',
      },
      {
        name: 'Training Notebook',
        image: '/links/kaggle.svg',
        logoBackground: '#20BEFF',
        site: 'Kaggle',
        url: 'https://www.kaggle.com/code/jakobmp/dog-breed-classification-densenet',
        description: 'How the DenseNet121 model was trained and evaluated.',
      },
      {
        name: 'Model and Model Card',
        image: '/links/huggingface.svg',
        logoBackground: '#0B0F19',
        site: 'Hugging Face',
        url: 'https://huggingface.co/jakobmp/dog-breed-densenet121',
        description: 'The trained model in ONNX format, with its accuracy and preprocessing.',
      },
      {
        name: 'Dataset',
        image: '/links/dataset.jpg',
        site: 'Kaggle',
        url: 'https://www.kaggle.com/datasets/gpiosenka/70-dog-breedsimage-data-set',
        description: 'The 70 dog breeds image dataset the model was trained on.',
      },
    ],
  },
  {
    title: 'Me',
    links: [
      {
        name: 'Portfolio',
        image: '/links/portfolio.png',
        logoBackground: '#DBEAFE',
        logoSize: '90%',
        logoX: '2%',
        site: 'jakobmpalmer.com',
        url: 'https://jakobmpalmer.com',
        description: 'My other projects.',
      },
      {
        name: 'LinkedIn',
        image: '/links/linkedin.svg',
        logoBackground: '#0A66C2',
        site: 'jakob-m-palmer',
        url: 'https://www.linkedin.com/in/jakob-m-palmer/',
        description: 'My experience and background.',
      },
      {
        name: 'GitHub',
        image: '/links/github-profile.jpg',
        imagePosition: 'left center',
        site: 'jakobmpalmer',
        url: 'https://github.com/jakobmpalmer',
        description: 'All of my public code.',
      },
    ],
  },
];

function Links() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.content}>
        <h1>Project Links</h1>

        {LINK_GROUPS.map((group) => (
          <section key={group.title} className={styles.group}>
            <h2>{group.title}</h2>
            <div className={styles.linkGrid}>
              {group.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.linkCard} ${link.logoBackground ? styles.logoCard : ''}`}
                  style={{
                    backgroundImage: `url("${link.image}")`,
                    backgroundColor: link.logoBackground,
                    backgroundPosition: link.imagePosition,
                    '--logo-size': link.logoSize,
                    '--logo-x': link.logoX,
                  }}
                >
                  <span className={styles.linkPanel}>
                    <span className={styles.linkSite}>{link.site}</span>
                    <span className={styles.linkName}>{link.name}</span>
                    <span className={styles.linkDescription}>{link.description}</span>
                  </span>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export default Links;
