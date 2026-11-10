import React, { useEffect, useState } from 'react';
import { remark } from 'remark';
import html from 'remark-html';
import { useParams, Link } from 'react-router-dom';
import styles from './BreedInfoPage.module.scss';
import BreedStatsBox from '../../components/BreedStatsBox/BreedStatsBox';
import { displayNameForSlug } from '../../values/breedNames';

const BreedInfoPage = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(null);
  const [stats, setStats] = useState(null);

  let { breed } = useParams();
  let breedName = breed
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  const breedFileName = breed;
  const title = displayNameForSlug(breed);

  useEffect(() => {
    const parseFrontmatter = (markdown) => {
      const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
      const match = markdown.match(frontmatterRegex);

      if (match) {
        const frontmatter = match[1];
        const content = match[2];

        const imageLinkMatch = frontmatter.match(/image_link:\s*(.+)/);
        const imageLink = imageLinkMatch ? imageLinkMatch[1].trim() : null;

        const imagesMatch = frontmatter.match(/images:\s*\n((?:\s+\w+:.*\n?)*)/);
        let parsedImages = null;

        if (imagesMatch) {
          parsedImages = {};
          const imagesSection = imagesMatch[1];

          const thumbnailMatch = imagesSection.match(/\s+thumbnail:\s*"?([^"\n]+)"?/);
          if (thumbnailMatch) parsedImages.thumbnail = thumbnailMatch[1].trim();

          const heroMatch = imagesSection.match(/\s+hero:\s*"?([^"\n]+)"?/);
          if (heroMatch) parsedImages.hero = heroMatch[1].trim();

          const galleryMatch = imagesSection.match(/\s+gallery:\s*\[(.*?)\]/);
          if (galleryMatch) {
            const galleryItems = galleryMatch[1].split(',').map(item => item.trim().replace(/"/g, ''));
            parsedImages.gallery = galleryItems.filter(item => item.length > 0);
          }
        }

        const imageCreditsMatch = frontmatter.match(/image_credits:\s*"?([^"\n]+)"?/);
        const imageCredits = imageCreditsMatch ? imageCreditsMatch[1].trim() : null;

        const statsMatch = frontmatter.match(/stats:\s*\n((?:\s+\w+:.*\n?)*)/);
        let parsedStats = null;

        if (statsMatch) {
          parsedStats = {};
          const statsSection = statsMatch[1];
          const statLines = statsSection.match(/\s+(\w+):\s*"?([^"\n]+)"?/g);

          if (statLines) {
            statLines.forEach(line => {
              const lineMatch = line.match(/\s+(\w+):\s*"?([^"\n]+)"?/);
              if (lineMatch) {
                const key = lineMatch[1];
                const value = lineMatch[2].replace(/"/g, '').trim();
                parsedStats[key] = value;
              }
            });
          }
        }

        return {
          imageLink,
          images: parsedImages,
          imageCredits,
          stats: parsedStats,
          content
        };
      }

      return {
        imageLink: null,
        images: null,
        imageCredits: null,
        stats: null,
        content: markdown
      };
    };

    const fetchMarkdown = async () => {
      const filePath = `/compendium/${breedName}/${breedFileName}.md`;
      setLoading(true);
      setImageUrl(null);

      try {
        const response = await fetch(filePath);
        const markdown = await response.text();
        const {
          imageLink,
          images,
          stats: parsedStats,
          content: markdownContent
        } = parseFrontmatter(markdown);

        setStats(parsedStats);

        const tryImagePaths = [];

        if (images?.hero) {
          tryImagePaths.push(`/compendium/${breedName}/${images.hero}`);
        }
        if (images?.thumbnail) {
          tryImagePaths.push(`/compendium/${breedName}/${images.thumbnail}`);
        }
        if (images?.gallery && images.gallery.length > 0) {
          tryImagePaths.push(`/compendium/${breedName}/${images.gallery[0]}`);
        }

        tryImagePaths.push(`/compendium/${breedName}/image.jpg`);

        const tryNextImage = (index) => {
          if (index >= tryImagePaths.length) {
            setImageUrl(imageLink || tryImagePaths[tryImagePaths.length - 1]);
            return;
          }

          const img = new Image();
          img.onload = () => {
            setImageUrl(tryImagePaths[index]);
          };
          img.onerror = () => {
            tryNextImage(index + 1);
          };
          img.src = tryImagePaths[index];
        };

        tryNextImage(0);

        remark()
          .use(html)
          .process(markdownContent, (err, result) => {
            if (err) {
              setContent('<p>Error loading breed content</p>');
            } else {
              setContent(result.toString());
            }
            setLoading(false);
          });
      } catch (error) {
        setContent('<p>Error loading breed content</p>');
        setLoading(false);
      }
    };

    fetchMarkdown();
  }, [breed, breedName, breedFileName]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageContent}>
        <Link to="/compendium" className={styles.backLink}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Compendium
        </Link>

        <div className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
        </div>

        <div className={styles.mediaContainer}>
          {imageUrl && (
            <div className={styles.imageContainer}>
              <img
                src={imageUrl}
                alt={`${title} dog`}
                className={styles.breedImage}
              />
            </div>
          )}

          {stats && <BreedStatsBox stats={stats} breedName={title} />}
        </div>

        {loading ? (
          <div className={styles.loadingContainer}>
            <p>Loading breed information...</p>
          </div>
        ) : (
          <div className={styles.contentContainer}>
            <div
              className={styles.markdownContent}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BreedInfoPage;
