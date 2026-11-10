// URL slug for a breed's compendium page, e.g. "Shih-Tzu" -> "shih-tzu", "Elk Hound" -> "elk-hound".
export function breedSlug(breed) {
  return breed
    .toLowerCase()
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((part) => part.toLowerCase())
    .join('-');
}
