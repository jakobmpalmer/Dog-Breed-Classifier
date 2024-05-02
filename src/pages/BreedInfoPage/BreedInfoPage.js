import React, { useEffect, useState } from 'react';
import {remark} from 'remark'; // No 'default' here

import html from 'remark-html';
import { useParams } from 'react-router-dom'; 

import styles from './BreedInfoPage.module.scss'

const BreedInfoPage = () => {
  const [content, setContent] = useState('');
  let { breed } = useParams();
  breed = breed.replace('-', ' ')
  let breedName = breed.charAt(0).toUpperCase() + breed.slice(1);  

  useEffect(() => {
    const fetchMarkdown = async () => {
      const filePath = `/compendium/${breedName}/${breed}.md`; // Assuming files in 'public'
      // const filePath = `/api/md/${breedName}/${breed}`; // Target API route
      console.log('filepath: ', filePath)
      try {
        const response = await fetch(filePath);
        const markdown = await response.text();
        
        console.log('response:', response)
        // console.log(filePath)
        // console.log('markdown:', markdown)
        remark()
          .use(html)
          .process(markdown, (err, result) => {
            if (err) {
              console.error(err);
            } else {
              setContent(result.toString());
            }
          });         
      } catch (error) {
       console.error('Error fetching markdown:', error);
       setContent('Error loading breed content'); 
      }
    };

    fetchMarkdown();
  }, [breed]); 

  console.log(breed)
  

  // function updateDogSeen(breedName) {
  //   const dogData = JSON.parse(localStorage.getItem('dogData')); // Fetch from localStorage
  //   dogData[breedName].seen = !dogData[breedName].seen; // Toggle the 'seen' property
  //   localStorage.setItem('dogData', JSON.stringify(dogData)); // Save back to localStorage
  // }

  return (
    <div className={styles.pageBackground}>
      <div className={styles.pageContent}>
        <div className={styles.pageTitle}>
          <h1>{breedName}s</h1>  
        </div>
        <div className={styles.dogImage}>
          <img src={`/compendium/${breedName}/image.jpg`} alt="Missing image"></img>
        </div>
        
        <div dangerouslySetInnerHTML={{ __html: content }} />    
      </div>
    </div>
  );
};

export default BreedInfoPage;
