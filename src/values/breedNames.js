import { dogBreeds } from './dogs';
import { breedSlug } from '../utils/breedSlug';

// Some dataset labels are misspelled or abbreviated. The model, the API, the URLs and
// the compendium folders all use the labels as they are; these are the names visitors see.
const DISPLAY_NAMES = {
  'Bermaise': 'Bernese Mountain Dog',
  'Dalmation': 'Dalmatian',
  'Elk Hound': 'Norwegian Elkhound',
  'German Sheperd': 'German Shepherd',
  'Great Perenees': 'Great Pyrenees',
  'Mex Hairless': 'Mexican Hairless',
  'Pekinese': 'Pekingese',
  'Shar_Pei': 'Shar Pei',
};

export const displayName = (label) => DISPLAY_NAMES[label] || label;

// The display name for a compendium page's URL slug, e.g. "dalmation" -> "Dalmatian".
export const displayNameForSlug = (slug) => {
  const label = dogBreeds.find((breed) => breedSlug(breed) === slug);
  return label ? displayName(label) : slug;
};
