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
 */

// Base URL for the generated files in object storage
const GENERATED_BASE_PATH = "/api/media/Ind/generated";

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
