import React, { useEffect, useState } from 'react';
import { remark } from 'remark';
import html from 'remark-html';
import { useParams } from 'react-router-dom';
import styles from './BreedInfoPage.module.scss';

const BreedInfoPage = () => {
  const [content, setContent] = useState('');
  let { breed } = useParams();
  breed = breed.replace('-', ' ');
  let breedName = breed.charAt(0).toUpperCase() + breed.slice(1);

  useEffect(() => {
    const fetchMarkdown = async () => {
      const filePath = `/compendium/${breedName}/${breed}.md`;

      try {
        const response = await fetch(filePath);
        const markdown = await response.text();

        remark()
          .use(html)
          .process(markdown, (err, result) => {
            if (err) {
              setContent('Error loading breed content');
            } else {
              setContent(result.toString());
            }
          });
      } catch (error) {
        setContent('Error loading breed content');
      }
    };

    fetchMarkdown();
  }, [breed, breedName]);

  return (
    <div className={styles.pageBackground}>
      <div className={styles.pageContent}>
        <div className={styles.pageTitle}>
          <h1>{breedName}s</h1>
        </div>
        <div className={styles.dogImage}>
          <img src={`/compendium/${breedName}/image.jpg`} alt={`${breedName} dog`} />
        </div>

        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
};

export default BreedInfoPage;
