# Multi-Image Support - Example and Documentation

## Overview
The compendium now supports flexible image management through frontmatter configuration with smart fallback logic.

## New Frontmatter Structure

### Full Example (All Optional Fields)
```yaml
---
images:
  thumbnail: "image.jpg"              # Used for compendium grid tiles
  hero: "image1.jpg"                  # Used for breed detail page
  gallery: ["image2.jpg", "image3.jpg"]  # For future gallery feature
image_link: "https://upload.wikimedia.org/..."  # Wikipedia fallback
image_credits: "Photo by John Doe"    # Attribution text
stats:
  size: "Large (22-24 inches)"
  weight: "50-70 lbs"
  lifespan: "10-13 years"
  exercise: "High"
  trainability: "Moderate"
  grooming: "Moderate"
---
```

### Minimal Example (Backward Compatible)
```yaml
---
image_link: https://upload.wikimedia.org/...
stats:
  size: "Medium (18-20 inches)"
  weight: "40-55 lbs"
  lifespan: "12-14 years"
  exercise: "Moderate"
  trainability: "Easy"
  grooming: "Low"
---
```

### No Frontmatter (Still Works)
Breeds without any frontmatter will use the hardcoded convention `/compendium/{BreedName}/image.jpg`

## Image Resolution Priority

### For Breed Detail Pages
1. `images.hero` (from frontmatter)
2. `images.thumbnail` (fallback)
3. `images.gallery[0]` (first gallery image)
4. `/compendium/{breed}/image.jpg` (hardcoded convention)
5. `image_link` (Wikipedia fallback)
6. Shows placeholder if all fail

### For Compendium Tiles
1. Custom `thumbnailPath` prop (if provided by parent)
2. `/compendium/{breed}/image.jpg` (default convention)
3. Shows placeholder icon if fails

## Example: Airedale with Multiple Images

If Airedale has both `image.jpg` and `image1.jpg`, you can configure:

```yaml
---
images:
  hero: "image1.jpg"           # Use image1.jpg for detail page
  thumbnail: "image.jpg"       # Use image.jpg for compendium tile
  gallery: ["image.jpg", "image1.jpg"]  # Both available for future gallery
image_link: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Airedale_Terrier.jpg/800px-Airedale_Terrier.jpg"
image_credits: "Wikimedia Commons"
stats:
  size: "Large (22-24 inches)"
  weight: "50-70 lbs"
  lifespan: "10-13 years"
  exercise: "High"
  trainability: "Moderate"
  grooming: "Moderate"
---
```

## Migration Strategy

### Phase 1 (Current - No Changes Required)
- All existing breeds work without any frontmatter changes
- Backward compatible with current `image.jpg` convention
- Existing `image_link` and `stats` frontmatter still works

### Phase 2 (Optional - Add New Structure)
- Update individual breed markdown files with `images` object
- Specify different images for different purposes
- Add image credits for attribution

### Phase 3 (Future - Gallery UI)
- Implement image gallery component on breed detail pages
- Use `images.gallery` array to show multiple images
- Add lightbox/zoom functionality

## Benefits

✅ **Flexible** - Support any image filename, not just `image.jpg`
✅ **Professional** - Different images for tiles vs detail pages
✅ **Future-Proof** - Gallery array ready for future features
✅ **Backward Compatible** - Zero breaking changes
✅ **Graceful** - Smart fallback handles missing images
✅ **Attributable** - Proper image credits support

## Files Modified

1. **src/pages/BreedInfoPage/BreedInfoPage.js**
   - Enhanced `parseFrontmatter()` to parse `images` object
   - Implemented smart image resolution with fallback chain
   - Added image credits parsing

2. **src/components/DogBreedTile/DogBreedTile.js**
   - Added optional `thumbnailPath` prop
   - Maintains fallback to hardcoded `image.jpg`

## Testing Verification

To verify the implementation works:

1. **Backward Compatibility Test**
   - Open existing breeds (Beagle, Boxer) - should display normally
   - No frontmatter changes required

2. **New Structure Test**
   - Add `images` object to Airedale frontmatter
   - Verify hero image displays correctly
   - Verify fallback works if hero is missing

3. **Missing Image Test**
   - Open breed with no images (African-Wild-Dog)
   - Should gracefully show placeholder or Wikipedia fallback
