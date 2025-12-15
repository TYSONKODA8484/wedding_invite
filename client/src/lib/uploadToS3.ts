/**
 * Upload a file directly to S3 using a presigned URL
 * Returns the public S3 URL of the uploaded file
 */
export async function uploadFileToS3(
  file: File,
  folder: string
): Promise<string> {
  try {
    // Step 1: Request presigned URL from server (with auth token)
    console.log("Requesting presigned URL for:", file.name, "folder:", folder);
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Not authenticated. Please log in first.");
    }

    const response = await fetch("/api/upload-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        folder,
        filename: file.name,
        contentType: file.type,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to create upload URL: ${error.error}`);
    }

    const data = await response.json();
    const { uploadUrl, fileUrl } = data;

    console.log("Got presigned URL, uploading file...");

    // Step 2: PUT file directly to S3
    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload to S3 failed: ${uploadResponse.statusText}`);
    }

    console.log("File uploaded successfully to S3:", fileUrl);

    // Step 3: Return the public S3 URL
    return fileUrl;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
}

/**
 * Save the S3 URL to the project in the database
 */
export async function saveMediaUrlToProject(
  projectId: string,
  type: "music" | "photo",
  url: string,
  fieldId?: string,
  pageId?: string
): Promise<void> {
  try {
    const body: any = { type, url };
    if (fieldId) body.fieldId = fieldId;
    if (pageId) body.pageId = pageId;

    const response = await fetch(`/api/projects/${projectId}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to save media URL: ${error.error}`);
    }

    console.log(`${type} URL saved to project`);
  } catch (error) {
    console.error("Error saving media URL to project:", error);
    throw error;
  }
}
