/**
 * Dummy Render Service
 * 
 * This simulates the After Effects rendering pipeline by mapping
 * placeholder files to project previewUrl and finalUrl based on template type.
 * 
 * Storage files (in Ind/generated/):
 * - card_preview.png - for card template previews
 * - card_final.png - for card template final files
 * - video_preview.mp4 - for video template previews
 * - video_final.mp4 - for video template final files
 * 
 * Editor Page Preview files (in Ind/preview/):
 * - ed_p1.png, ed_p2.png, ed_p3.png, ed_p4.png - cycling preview images for editor
 */

// Base URL for the generated files in object storage
const GENERATED_BASE_PATH = "/api/media/Ind/generated";
const PREVIEW_BASE_PATH = "/api/media/Ind/preview";

// Number of preview images available for cycling
const PREVIEW_IMAGE_COUNT = 4;

export interface RenderResult {
  previewUrl: string;
  finalUrl: string;
}

/**
 * Get the placeholder URLs for a project based on template type
 * @param templateType - 'card' or 'video'
 * @returns Object with previewUrl and finalUrl
 */
export function getPlaceholderUrls(templateType: string): RenderResult {
  if (templateType === 'card') {
    return {
      previewUrl: `${GENERATED_BASE_PATH}/card_preview.png`,
      finalUrl: `${GENERATED_BASE_PATH}/card_final.png`,
    };
  } else {
    // Default to video for any non-card type
    return {
      previewUrl: `${GENERATED_BASE_PATH}/video_preview.mp4`,
      finalUrl: `${GENERATED_BASE_PATH}/video_final.mp4`,
    };
  }
}

/**
 * Simulate rendering a project
 * In a real implementation, this would trigger the AE rendering pipeline
 * For now, it just returns the placeholder URLs
 * 
 * @param projectId - The project ID
 * @param templateType - 'card' or 'video'
 * @returns Promise<RenderResult>
 */
export async function renderProject(projectId: string, templateType: string): Promise<RenderResult> {
  // Simulate some processing time (optional, can remove for instant response)
  // await new Promise(resolve => setTimeout(resolve, 100));
  
  console.log(`[Render Service] Generating placeholder URLs for project ${projectId} (type: ${templateType})`);
  
  const urls = getPlaceholderUrls(templateType);
  
  console.log(`[Render Service] Generated URLs:`, urls);
  
  return urls;
}

export interface PagePreviewResult {
  previewUrl: string;
  nextIndex: number;
}

/**
 * Get the next preview image URL for a page in the editor
 * Cycles through ed_p1.png → ed_p2.png → ed_p3.png → ed_p4.png → ed_p1.png
 * 
 * @param currentIndex - Current preview index (0-3, will cycle)
 * @returns Object with previewUrl and nextIndex
 */
export function getPagePreviewUrl(currentIndex: number): PagePreviewResult {
  // Ensure index is within bounds (0-3)
  const normalizedIndex = currentIndex % PREVIEW_IMAGE_COUNT;
  // Preview images are 1-indexed (ed_p1.png, ed_p2.png, etc.)
  const imageNumber = normalizedIndex + 1;
  
  const previewUrl = `${PREVIEW_BASE_PATH}/ed_p${imageNumber}.png`;
  // Calculate next index (wraps around after 4)
  const nextIndex = (normalizedIndex + 1) % PREVIEW_IMAGE_COUNT;
  
  console.log(`[Render Service] Page preview: index ${currentIndex} → image p${imageNumber} → next index ${nextIndex}`);
  
  return {
    previewUrl,
    nextIndex,
  };
}

/**
 * Simulate rendering a single page preview
 * In a real implementation, this would render the page with customizations
 * For now, it cycles through dummy preview images
 * 
 * @param projectId - The project ID
 * @param pageId - The page ID being previewed
 * @param currentIndex - Current preview index for this page
 * @returns Promise<PagePreviewResult>
 */
export async function renderPagePreview(
  projectId: string, 
  pageId: string, 
  currentIndex: number
): Promise<PagePreviewResult> {
  // Simulate some processing time to show loading state
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log(`[Render Service] Rendering page preview for project ${projectId}, page ${pageId}`);
  
  return getPagePreviewUrl(currentIndex);
}
