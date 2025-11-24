import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import type { Template } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, X, Download, Eye, ArrowLeft, ChevronLeft, ChevronRight, Upload, Image as ImageIcon, Crop, ZoomIn, ZoomOut, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { AuthModal } from "@/components/AuthModal";
import { PageViewer } from "@/components/PageViewer";
import { PaymentModal as PaymentModalComponent } from "@/components/PaymentModal";

interface EditableField {
  id: string;
  type: 'text' | 'textarea' | 'image';
  label: string;
  defaultValue?: string;
  maxLength?: number;
}

interface CropBox {
  srcX: number;
  srcY: number;
  srcWidth: number;
  srcHeight: number;
  canvasWidth: number;
  canvasHeight: number;
}

// Shared utility to compute crop box for both preview and export
function computeCropBox(
  imgWidth: number,
  imgHeight: number,
  aspectRatio: string,
  zoomPercent: number
): CropBox {
  const zoomFactor = Math.max(1, zoomPercent / 100);

  let targetAspect = 1;
  if (aspectRatio === '16:9') targetAspect = 16 / 9;
  else if (aspectRatio === '9:16') targetAspect = 9 / 16;
  else if (aspectRatio === '1:1') targetAspect = 1;
  else targetAspect = imgWidth / imgHeight;

  const canvasWidth = 800;
  const canvasHeight = Math.round(canvasWidth / targetAspect);

  const imgAspect = imgWidth / imgHeight;
  let baseSrcWidth, baseSrcHeight;

  if (imgAspect > targetAspect) {
    baseSrcHeight = imgHeight;
    baseSrcWidth = baseSrcHeight * targetAspect;
  } else {
    baseSrcWidth = imgWidth;
    baseSrcHeight = baseSrcWidth / targetAspect;
  }

  const srcWidth = baseSrcWidth / zoomFactor;
  const srcHeight = baseSrcHeight / zoomFactor;

  const srcX = (imgWidth - baseSrcWidth) / 2 + (baseSrcWidth - srcWidth) / 2;
  const srcY = (imgHeight - baseSrcHeight) / 2 + (baseSrcHeight - srcHeight) / 2;

  return { srcX, srcY, srcWidth, srcHeight, canvasWidth, canvasHeight };
}

interface CropModalProps {
  imageUrl: string;
  onConfirm: (croppedImage: string) => void;
  onCancel: () => void;
}

function CropModal({ imageUrl, onConfirm, onCancel }: CropModalProps) {
  const [zoom, setZoom] = useState([100]);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1' | 'free'>('16:9');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const updatePreview = () => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      const cropBox = computeCropBox(img.width, img.height, aspectRatio, zoom[0]);

      canvas.width = cropBox.canvasWidth;
      canvas.height = cropBox.canvasHeight;

      if (ctx) {
        ctx.drawImage(
          img,
          cropBox.srcX, cropBox.srcY, cropBox.srcWidth, cropBox.srcHeight,
          0, 0, cropBox.canvasWidth, cropBox.canvasHeight
        );
        setPreviewUrl(canvas.toDataURL('image/png'));
      }
    };

    img.src = imageUrl;
  };

  useEffect(() => {
    updatePreview();
  }, [zoom, aspectRatio, imageUrl]);

  const handleConfirm = () => {
    if (previewUrl) {
      onConfirm(previewUrl);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Crop & Resize Image</DialogTitle>
          <DialogDescription>
            Adjust zoom and crop area for your image
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <canvas ref={previewCanvasRef} className="hidden" />
          
          <div className="relative bg-muted rounded-md overflow-hidden flex items-center justify-center min-h-[300px]">
            {previewUrl ? (
              <img 
                src={previewUrl}
                alt="Crop preview"
                className="max-w-full max-h-[500px] object-contain"
              />
            ) : (
              <p className="text-muted-foreground">Loading preview...</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <ZoomOut className="w-4 h-4" />
                Zoom
                <ZoomIn className="w-4 h-4" />
              </Label>
              <span className="text-sm text-muted-foreground">{zoom[0]}%</span>
            </div>
            <Slider
              value={zoom}
              onValueChange={setZoom}
              min={100}
              max={200}
              step={5}
              data-testid="slider-zoom"
            />
          </div>

          <div className="space-y-2">
            <Label>Aspect Ratio</Label>
            <div className="flex gap-2">
              {(['16:9', '9:16', '1:1', 'free'] as const).map((ratio) => (
                <Button
                  key={ratio}
                  variant={aspectRatio === ratio ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAspectRatio(ratio)}
                  data-testid={`button-aspect-${ratio}`}
                >
                  {ratio === 'free' ? 'Free' : ratio}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} data-testid="button-crop-cancel">
            Cancel
          </Button>
          <Button onClick={handleConfirm} data-testid="button-crop-confirm">
            <Crop className="w-4 h-4 mr-2" />
            Apply Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ImageUploadFieldProps {
  fieldName: string;
  preview: string | null;
  onSelect: (file: File) => void;
  onRemove: () => void;
}

function ImageUploadField({ fieldName, preview, onSelect, onRemove }: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
  const [tempFile, setTempFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImageUrl(reader.result as string);
        setTempFile(file);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropConfirm = (croppedDataUrl: string) => {
    fetch(croppedDataUrl)
      .then(res => res.blob())
      .then(blob => {
        const croppedFile = new File([blob], tempFile?.name || 'cropped-image.png', { type: 'image/png' });
        onSelect(croppedFile);
        setShowCropModal(false);
        setTempImageUrl(null);
        setTempFile(null);
      });
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setTempImageUrl(null);
    setTempFile(null);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      {showCropModal && tempImageUrl && (
        <CropModal
          imageUrl={tempImageUrl}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}
      <div className="space-y-2">
        {preview ? (
          <div className="relative aspect-video rounded-md overflow-hidden bg-muted border border-border">
            <img 
              src={preview} 
              alt={`Preview for ${fieldName}`}
              className="w-full h-full object-cover"
              data-testid={`img-preview-${fieldName}`}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleUploadClick}
                data-testid={`button-replace-${fieldName}`}
              >
                <Upload className="w-3 h-3 mr-1" />
                Replace
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={onRemove}
                data-testid={`button-remove-${fieldName}`}
              >
                <X className="w-3 h-3 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="aspect-video bg-muted rounded-md flex flex-col items-center justify-center border-2 border-dashed border-border cursor-pointer hover-elevate active-elevate-2 transition-colors"
            onClick={handleUploadClick}
            data-testid={`dropzone-${fieldName}`}
          >
            <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-xs text-muted-foreground font-medium">Click to upload image</p>
            <p className="text-xs text-muted-foreground/70 mt-1">JPG, PNG, or GIF</p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          data-testid={`input-file-${fieldName}`}
        />
        {!preview && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleUploadClick}
            data-testid={`button-upload-${fieldName}`}
          >
            <Upload className="w-4 h-4 mr-2" />
            Choose Image
          </Button>
        )}
      </div>
    </>
  );
}

interface PreviewLoadingScreenProps {
  progress: number;
  onClose: () => void;
}

function PreviewLoadingScreen({ progress, onClose }: PreviewLoadingScreenProps) {
  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="text-center space-y-6">
          {/* Progress Circle */}
          <div className="flex justify-center">
            <div className="relative w-32 h-32">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-muted"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
                  className="text-primary transition-all duration-500"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-foreground">{progress}%</span>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="bg-primary/5 border border-primary/20 rounded-md p-4">
            <p className="text-primary font-medium">
              Video Creation in Progress! Thanks for your patience - the best is yet to come! 🎉 👰
            </p>
          </div>

          {/* What's Next Checklist */}
          <div className="text-left space-y-3">
            <h3 className="font-semibold text-foreground text-lg">What's next?</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Wait for 2-3 minutes. System will create the video.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Preview the video
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Pay only when you like the Preview.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Please do not click anywhere else video generation will stop.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Video will also be available under "My Videos".
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

interface PreviewModalProps {
  previewUrl: string;
  onClose: () => void;
  onDownload: () => void;
  downloadEnabled: boolean;
}

function PreviewModal({ previewUrl, onClose, onDownload, downloadEnabled }: PreviewModalProps) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Preview</DialogTitle>
            <Button
              variant="default"
              onClick={onDownload}
              disabled={!downloadEnabled}
              data-testid="button-modal-download"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Without Watermark
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview Image/Video */}
          <div className="relative bg-muted rounded-md overflow-hidden flex items-center justify-center min-h-[400px]">
            <img 
              src={previewUrl}
              alt="Preview"
              className="max-w-full max-h-[600px] object-contain"
              data-testid="preview-modal-image"
            />
          </div>

          {/* Disclaimer */}
          <div className="bg-primary text-primary-foreground rounded-md p-3 text-sm text-center">
            This is a low-quality preview for illustration only. The final video will be high quality. 
            Please review carefully content cannot be changed after payment.
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} data-testid="button-modal-close">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Helper to check if string is a UUID v4
function isUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

export default function Editor() {
  const [, params] = useRoute("/editor/:slug");
  const [, navigate] = useLocation();
  const slug = params?.slug;
  const isEditingProject = slug ? isUUID(slug) : false;

  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [imageFiles, setImageFiles] = useState<Record<string, File>>({});
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({});
  const [projectId, setProjectId] = useState<string | null>((isEditingProject && slug) ? slug : null);
  
  // Preview/Download states
  const [showPreviewLoading, setShowPreviewLoading] = useState(false);
  const [previewProgress, setPreviewProgress] = useState(0);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [downloadEnabled, setDownloadEnabled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingPreview, setPendingPreview] = useState(false);
  const [isAuthVerifying, setIsAuthVerifying] = useState(false);
  
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Fetch project data if editing an existing project
  const { data: projectData, isLoading: projectIsLoading } = useQuery({
    queryKey: ["/api/projects", slug],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/projects/${slug}`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch project");
      return response.json();
    },
    enabled: isEditingProject,
  });

  // Fetch template data (either from new template or existing project's template)
  const { data: templateData, isLoading: templateIsLoading, error } = useQuery<Template & { pages?: any[] }>({
    queryKey: ["/api/templates", isEditingProject ? projectData?.templateId : slug],
    queryFn: async () => {
      const templateId = isEditingProject ? projectData?.templateId : slug;
      const response = await fetch(`/api/templates/${templateId}`);
      if (!response.ok) throw new Error("Failed to fetch template");
      return response.json();
    },
    enabled: isEditingProject ? !!projectData?.templateId : !!slug,
  });

  // Combined loading state: show loading while waiting for project and template data
  const isLoading = isEditingProject ? (projectIsLoading || templateIsLoading) : templateIsLoading;

  // Load existing project customization data when editing
  useEffect(() => {
    if (projectData && projectData.customization) {
      console.log("Loading customization data from project:", projectData.customization);
      
      // Load field values from customization.pages
      const newFieldValues: Record<string, string> = {};
      if (projectData.customization.pages) {
        for (const [pageId, fields] of Object.entries(projectData.customization.pages)) {
          if (typeof fields === 'object') {
            for (const [fieldId, value] of Object.entries(fields as Record<string, any>)) {
              newFieldValues[`${pageId}_${fieldId}`] = value || '';
            }
          }
        }
      }
      setFieldValues(newFieldValues);
      
      // Load image previews
      if (projectData.customization.images) {
        setImagePreviews(projectData.customization.images);
      }
    }
  }, [projectData]);

  // Preload all page images to eliminate loading delays
  useEffect(() => {
    if (templateData?.pages) {
      templateData.pages.forEach((page) => {
        // Preload page thumbnails
        if (page.thumbnailUrl) {
          const thumbnailImg = new Image();
          thumbnailImg.src = page.thumbnailUrl;
        }
        // Preload page background images from media array
        const backgroundMedia = page.media?.find((m: any) => m.position === 'background');
        if (backgroundMedia?.url) {
          const bgImg = new Image();
          bgImg.src = backgroundMedia.url;
        }
      });
    }
  }, [templateData]);

  // Check if user is logged in
  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
  });

  // Save project mutation
  const saveProjectMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error("Not authenticated");
      }

      // Collect all customization data from all pages
      const pages = templateData!.pages || [];
      const customizationData: Record<string, any> = {
        pages: {},
        images: {},
      };

      for (const page of pages) {
        const pageFieldValues: Record<string, string> = {};
        for (const field of page.editableFields) {
          const fieldKey = `${page.id}_${field.id}`;
          const value = fieldValues[fieldKey] || field.defaultValue || '';
          pageFieldValues[field.id] = value;
        }
        customizationData.pages[page.id] = pageFieldValues;
      }

      // Add image file data
      customizationData.images = imagePreviews;

      if (projectId) {
        // Update existing project - set status to preview_requested
        console.log("Updating project:", projectId, "with customization:", customizationData);
        const response = await apiRequest("PUT", `/api/projects/${projectId}`, {
          customization: customizationData,
          status: "preview_requested",
        });
        console.log("Project updated successfully:", response);
        return response;
      } else {
        // Create new project - initially set to preview_requested status
        console.log("Creating new project with customization:", customizationData);
        const response: any = await apiRequest("POST", "/api/projects", {
          templateId: templateData!.id,
          customization: customizationData,
          status: "preview_requested",
        });
        if (response && response.id) {
          setProjectId(response.id);
          console.log("New project created with ID:", response.id);
        }
        return response;
      }
    },
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      console.log("Project saved successfully:", project);
      toast({
        title: "Saved",
        description: "Your customizations have been saved to database.",
      });
    },
    onError: (error: any) => {
      if (error.message !== "Not authenticated") {
        toast({
          title: "Save failed",
          description: error.message || "Failed to save project",
          variant: "destructive",
        });
      }
    },
  });

  const template = templateData;
  const pages = templateData?.pages || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" data-testid="loading-editor">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Loading editor...</p>
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4" data-testid="error-editor">
        <Card className="p-12 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-destructive" />
          </div>
          <h3 className="font-playfair text-2xl font-bold text-foreground mb-2">
            Template Not Found
          </h3>
          <p className="text-muted-foreground mb-6">
            Unable to load the editor for this template.
          </p>
          <Button onClick={() => navigate("/templates")} data-testid="button-back-templates">
            Back to Templates
          </Button>
        </Card>
      </div>
    );
  }

  const currentPage = pages[currentPageIndex];
  const editableFields: EditableField[] = currentPage?.editableFields as EditableField[] || [];

  const handleFieldChange = (fieldId: string, value: string) => {
    setFieldValues(prev => ({ ...prev, [`${currentPage.id}_${fieldId}`]: value }));
  };

  const getFieldValue = (fieldId: string) => {
    const fieldKey = `${currentPage.id}_${fieldId}`;
    if (fieldValues[fieldKey] !== undefined) {
      return fieldValues[fieldKey];
    }
    const field = currentPage.editableFields.find((f: any) => f.id === fieldId);
    return field?.defaultValue || '';
  };

  const handleImageSelect = (fieldId: string, file: File) => {
    const fieldKey = `${currentPage.id}_${fieldId}`;
    setImageFiles(prev => ({
      ...prev,
      [fieldKey]: file
    }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviews(prev => ({
        ...prev,
        [fieldKey]: reader.result as string
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = (fieldId: string) => {
    const fieldKey = `${currentPage.id}_${fieldId}`;
    setImageFiles(prev => {
      const updated = { ...prev };
      delete updated[fieldKey];
      return updated;
    });
    setImagePreviews(prev => {
      const updated = { ...prev };
      delete updated[fieldKey];
      return updated;
    });
  };

  const getImagePreview = (fieldId: string): string | null => {
    return imagePreviews[`${currentPage.id}_${fieldId}`] || null;
  };

  const handlePreview = async (verifiedUser?: any) => {
    console.log("handlePreview called, verifiedUser:", verifiedUser, "user state:", user);
    
    // Prevent duplicate preview requests
    if (saveProjectMutation.isPending) {
      console.log("Save already in progress, skipping");
      return;
    }
    
    // Check if user is logged in - verify both user data AND auth token
    const currentUser = verifiedUser || user || queryClient.getQueryData(["/api/auth/user"]);
    const authToken = localStorage.getItem('auth_token');
    console.log("Current user data:", currentUser, "Has token:", !!authToken);
    
    // Show auth modal if no user OR no token (and not currently verifying)
    if ((!currentUser || !authToken) && !isAuthVerifying) {
      console.log("User not logged in, showing auth modal");
      setPendingPreview(true);
      setShowAuthModal(true);
      return;
    }

    try {
      console.log("User is logged in, proceeding with preview");
      
      // IMPORTANT: Save project with customization data to database
      // This must complete successfully before showing generation screen
      const savedProject = await saveProjectMutation.mutateAsync();
      
      console.log("Project saved to database:", savedProject);
      
      // Start preview generation loading screen
      setShowPreviewLoading(true);
      setPreviewProgress(0);

      // Simulate progress (in production, this would call After Effects API)
      // TODO: Replace with actual API call to video generation service
      const progressInterval = setInterval(() => {
        setPreviewProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            // Show preview modal when complete
            setTimeout(() => {
              setShowPreviewLoading(false);
              setPreviewUrl(currentPage.thumbnailUrl); // Mock preview URL
              setShowPreviewModal(true);
              // Enable download button once preview is generated
              setDownloadEnabled(true);
            }, 500);
            return 100;
          }
          return prev + 10;
        });
      }, 300);
    } catch (error: any) {
      console.error("Preview failed:", error);
      
      // If authentication error (check for common auth error patterns), show auth modal
      const isAuthError = error.message?.includes("authenticated") || 
                          error.message?.includes("Unauthorized") ||
                          error.status === 401 ||
                          error.message?.includes("Session expired");
      
      if (isAuthError) {
        console.log("Authentication error during preview, showing auth modal");
        setPendingPreview(true);
        setShowAuthModal(true);
      } else {
        toast({
          title: "Preview failed",
          description: error.message || "Failed to generate preview. Please try again.",
          variant: "destructive",
        });
      }
      setShowPreviewLoading(false);
    }
  };

  const handleDownload = () => {
    // Close preview modal and show payment modal
    setShowPreviewModal(false);
    setShowPaymentModal(true);
  };

  const handleAuthSuccess = async () => {
    console.log("Auth success - user logged in");
    setShowAuthModal(false);
    setIsAuthVerifying(true);
    
    try {
      // Wait a moment to ensure localStorage has the auth token
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Force fetch user data to ensure we have it (don't rely on refetchQueries)
      console.log("Fetching user data after login...");
      const freshUserData = await queryClient.fetchQuery({
        queryKey: ["/api/auth/user"],
        queryFn: async () => {
          const token = localStorage.getItem('auth_token');
          const response = await fetch("/api/auth/user", { 
            credentials: "include",
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }
          return response.json();
        },
      });
      console.log("Fresh user data fetched:", freshUserData);
      
      // Invalidate user query to update navbar and other components
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      // Verify we have the token before proceeding
      const hasToken = !!localStorage.getItem('auth_token');
      console.log("Token available after auth:", hasToken);
      
      // If pending preview, trigger it with verified user data
      if (pendingPreview) {
        console.log("Preview was pending, triggering it now with verified user data");
        setPendingPreview(false);
        
        // Double-check we have what we need before calling handlePreview
        if (freshUserData && hasToken) {
          // Pass the verified user data directly to handlePreview
          handlePreview(freshUserData);
        } else {
          console.error("Missing user data or token after auth, cannot proceed with preview");
          toast({
            title: "Authentication Issue",
            description: "Please try clicking Preview again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      toast({
        title: "Authentication Error",
        description: "Please try clicking Preview again.",
        variant: "destructive",
      });
    } finally {
      // Always reset authVerifying flag
      setIsAuthVerifying(false);
    }
  };

  const goToNextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background" data-testid="editor-page">
      {/* Preview Loading Screen */}
      {showPreviewLoading && (
        <PreviewLoadingScreen
          progress={previewProgress}
          onClose={() => setShowPreviewLoading(false)}
        />
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <PreviewModal
          previewUrl={previewUrl}
          onClose={() => setShowPreviewModal(false)}
          onDownload={handleDownload}
          downloadEnabled={true}
        />
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Payment Modal */}
      {projectId && (
        <PaymentModalComponent
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          projectId={projectId}
          templateName={template.templateName}
          amount={template.price}
          currency={template.currency}
          onSuccess={() => {
            toast({
              title: "Payment Successful!",
              description: "Your video is now ready to download.",
            });
            setDownloadEnabled(true);
          }}
        />
      )}

      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/template/${template.slug}`)}
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-semibold text-foreground text-lg line-clamp-1" data-testid="text-template-title">
                {template.templateName}
              </h1>
              <p className="text-sm text-muted-foreground">
                Page {currentPageIndex + 1} of {pages.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePreview}
              disabled={saveProjectMutation.isPending}
              data-testid="button-preview"
            >
              {saveProjectMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </>
              )}
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              disabled={!downloadEnabled}
              onClick={handleDownload}
              data-testid="button-download"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Page List */}
        <div className="w-20 md:w-28 border-r bg-card hidden sm:flex flex-col">
          <div className="p-3 border-b text-center">
            <h2 className="text-xs font-semibold text-foreground">Pages</h2>
            <p className="text-[10px] text-muted-foreground mt-0.5">{pages.length} total</p>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-2">
              {pages.map((page, index) => (
                <button
                  key={page.id}
                  onClick={() => setCurrentPageIndex(index)}
                  className={`w-full group relative rounded-md transition-all duration-200 hover-elevate ${
                    currentPageIndex === index
                      ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                      : 'hover:ring-1 hover:ring-muted-foreground/20'
                  }`}
                  data-testid={`page-list-item-${index}`}
                >
                  <div className="relative aspect-[9/16] overflow-hidden rounded-md bg-muted">
                    <img
                      src={page.thumbnailUrl}
                      alt={page.pageName}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                    {currentPageIndex === index && (
                      <div className="absolute inset-0 bg-primary/20 pointer-events-none" />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-1">
                      <p className="text-[10px] font-semibold text-white text-center">
                        P{page.pageNumber}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Center - Page Preview */}
        <div className="flex-1 flex flex-col bg-gradient-to-br from-muted/30 via-background to-muted/20">
          <div className="flex-1 flex items-center justify-center p-6 md:p-8 lg:p-12">
            <div className="relative w-full h-full max-w-2xl">
              {/* Template Name Badge */}
              <div className="flex items-center justify-center mb-4">
                <Badge variant="secondary" className="text-sm font-medium px-4 py-1.5 shadow-sm">
                  {template.templateName}
                  {currentPage && <span className="ml-2">• Page {currentPage.pageNumber} of {pages.length}</span>}
                </Badge>
              </div>
              
              {/* Page Viewer with Zoom Controls */}
              {currentPage ? (
                <PageViewer 
                  page={currentPage}
                  className="h-full"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="aspect-[9/16] bg-muted rounded-xl shadow-lg flex items-center justify-center max-w-md">
                    <p className="text-muted-foreground">No page selected</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Page Navigation */}
          <div className="border-t bg-card p-4">
            <div className="flex items-center justify-between max-w-md mx-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPageIndex === 0}
                data-testid="button-previous-page"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                {currentPageIndex + 1} / {pages.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPageIndex === pages.length - 1}
                data-testid="button-next-page"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Editable Fields */}
        <div className="w-80 border-l bg-card hidden lg:flex flex-col">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-foreground">Edit Fields</h2>
            <p className="text-xs text-muted-foreground">
              {editableFields.length} fields on this page
            </p>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {editableFields.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-sm">
                    No editable fields on this page
                  </p>
                </div>
              ) : (
                editableFields.filter(field => field?.id).map((field, index) => (
                  <div key={index} className="space-y-1.5" data-testid={`field-${field.id}`}>
                    {field.type === 'textarea' ? (
                      <>
                        <Textarea
                          id={field.id}
                          value={getFieldValue(field.id)}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          maxLength={field.maxLength}
                          rows={3}
                          className="resize-none"
                          data-testid={`input-${field.id}`}
                        />
                        {field.maxLength && (
                          <div className="flex justify-end">
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                              {getFieldValue(field.id).length} / {field.maxLength}
                            </span>
                          </div>
                        )}
                      </>
                    ) : field.type === 'image' ? (
                      <ImageUploadField
                        fieldName={field.id}
                        preview={getImagePreview(field.id)}
                        onSelect={(file) => handleImageSelect(field.id, file)}
                        onRemove={() => handleImageRemove(field.id)}
                      />
                    ) : (
                      <>
                        <Input
                          id={field.id}
                          type="text"
                          value={getFieldValue(field.id)}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          maxLength={field.maxLength}
                          data-testid={`input-${field.id}`}
                        />
                        {field.maxLength && (
                          <div className="flex justify-end">
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                              {getFieldValue(field.id).length} / {field.maxLength}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
