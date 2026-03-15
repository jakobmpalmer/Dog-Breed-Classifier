import React, { useEffect, useState } from 'react';
import { remark } from 'remark';
import html from 'remark-html';
import { useParams, Link } from 'react-router-dom';
import styles from './BreedInfoPage.module.scss';
import BreedStatsBox from '../../components/BreedStatsBox/BreedStatsBox';

const BreedInfoPage = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(null);
  const [wikipediaFallback, setWikipediaFallback] = useState(null);
  const [stats, setStats] = useState(null);

  let { breed } = useParams();
  // Properly capitalize each word for directory name (e.g., "american-hairless" → "American Hairless")
  let breedName = breed
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  // Keep original param with dashes for filename
  const breedFileName = breed;

  useEffect(() => {
    const parseFrontmatter = (markdown) => {
      const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
      const match = markdown.match(frontmatterRegex);

      if (match) {
        const frontmatter = match[1];
        const content = match[2];

        // Parse image_link (legacy fallback)
        const imageLinkMatch = frontmatter.match(/image_link:\s*(.+)/);
        const imageLink = imageLinkMatch ? imageLinkMatch[1].trim() : null;

        // Parse images section (new structure)
        const imagesMatch = frontmatter.match(/images:\s*\n((?:\s+\w+:.*\n?)*)/);
        let parsedImages = null;

        if (imagesMatch) {
          parsedImages = {};
          const imagesSection = imagesMatch[1];

          // Parse individual image fields
          const thumbnailMatch = imagesSection.match(/\s+thumbnail:\s*"?([^"\n]+)"?/);
          if (thumbnailMatch) parsedImages.thumbnail = thumbnailMatch[1].trim();

          const heroMatch = imagesSection.match(/\s+hero:\s*"?([^"\n]+)"?/);
          if (heroMatch) parsedImages.hero = heroMatch[1].trim();

          // Parse gallery array
          const galleryMatch = imagesSection.match(/\s+gallery:\s*\[(.*?)\]/);
          if (galleryMatch) {
            const galleryItems = galleryMatch[1].split(',').map(item => item.trim().replace(/"/g, ''));
            parsedImages.gallery = galleryItems.filter(item => item.length > 0);
          }
        }

        // Parse image credits
        const imageCreditsMatch = frontmatter.match(/image_credits:\s*"?([^"\n]+)"?/);
        const imageCredits = imageCreditsMatch ? imageCreditsMatch[1].trim() : null;

        // Parse stats section
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
      setWikipediaFallback(null);

      try {
        const response = await fetch(filePath);
        const markdown = await response.text();
        const {
          imageLink,
          images,
          imageCredits,
          stats: parsedStats,
          content: markdownContent
        } = parseFrontmatter(markdown);

        // Store Wikipedia fallback if available
        setWikipediaFallback(imageLink);

        // Store stats if available
        setStats(parsedStats);

        // Smart image resolution with fallback priority:
        // 1. images.hero (from frontmatter)
        // 2. images.thumbnail (fallback)
        // 3. images.gallery[0] (first gallery image)
        // 4. Hardcoded /compendium/{breed}/image.jpg (convention)
        // 5. image_link (Wikipedia fallback)

        const tryImagePaths = [];

        // Add frontmatter image paths if available
        if (images?.hero) {
          tryImagePaths.push(`/compendium/${breedName}/${images.hero}`);
        }
        if (images?.thumbnail) {
          tryImagePaths.push(`/compendium/${breedName}/${images.thumbnail}`);
        }
        if (images?.gallery && images.gallery.length > 0) {
          tryImagePaths.push(`/compendium/${breedName}/${images.gallery[0]}`);
        }

        // Always add the hardcoded convention as fallback
        tryImagePaths.push(`/compendium/${breedName}/image.jpg`);

        // Try images in priority order
        const tryNextImage = (index) => {
          if (index >= tryImagePaths.length) {
            // All local images failed, use Wikipedia fallback if available
            setImageUrl(imageLink || tryImagePaths[tryImagePaths.length - 1]);
            return;
          }

          const img = new Image();
          img.onload = () => {
            setImageUrl(tryImagePaths[index]);
          };
          img.onerror = () => {
            // Try next image in fallback chain
            tryNextImage(index + 1);
          };
          img.src = tryImagePaths[index];
        };

        // Start trying images from the first one
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
          <h1 className={styles.title}>{breedName}s</h1>
        </div>

        <div className={styles.mediaContainer}>
          {imageUrl && (
            <div className={styles.imageContainer}>
              <img
                src={imageUrl}
                alt={`${breedName} dog`}
                className={styles.breedImage}
              />
            </div>
          )}

          {stats && <BreedStatsBox stats={stats} breedName={breedName} />}
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
