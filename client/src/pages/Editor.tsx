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

export default function Editor() {
  const [, params] = useRoute("/editor/:slug");
  const [, navigate] = useLocation();
  const slug = params?.slug;

  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [imageFiles, setImageFiles] = useState<Record<string, File>>({});
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({});
  const [customizationId, setCustomizationId] = useState<string | null>(null);
  
  // Preview/Download states
  const [showPreviewLoading, setShowPreviewLoading] = useState(false);
  const [previewProgress, setPreviewProgress] = useState(0);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [downloadEnabled, setDownloadEnabled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: templateData, isLoading, error } = useQuery<Template & { pages?: any[] }>({
    queryKey: ["/api/templates", slug],
    queryFn: async () => {
      const response = await fetch(`/api/templates/${slug}`);
      if (!response.ok) throw new Error("Failed to fetch template");
      return response.json();
    },
    enabled: !!slug,
  });

  // Check if user is logged in
  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
  });

  // Save customization mutation
  const saveCustomizationMutation = useMutation({
    mutationFn: async () => {
      let customizId = customizationId;
      if (!customizId) {
        const response = await fetch("/api/customizations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            templateId: templateData!.id,
            customizationName: `${templateData!.name} Customization`,
            status: "draft",
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to create customization: ${errorText}`);
        }

        const customization = await response.json();
        customizId = customization.id;
        setCustomizationId(customizId);
      }

      const pages = templateData!.pages || [];
      for (const page of pages) {
        const pageFieldValues: Record<string, string> = {};
        for (const field of page.editableFields) {
          const fieldKey = `${page.id}_${field.id}`;
          const value = fieldValues[fieldKey] || field.defaultValue || '';
          pageFieldValues[field.id] = value;
        }

        const pageResponse = await fetch(`/api/customizations/${customizId}/pages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            templatePageId: page.id,
            pageNumber: page.pageNumber,
            fieldValues: pageFieldValues,
          }),
        });

        if (!pageResponse.ok) {
          const errorText = await pageResponse.text();
          throw new Error(`Failed to save page ${page.pageNumber}: ${errorText}`);
        }
      }

      return customizId;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["/api/customizations"] });
    },
    onError: (error: any) => {
      if (error.message !== "Not authenticated") {
        toast({
          title: "Save failed",
          description: error.message || "Failed to save customization",
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

  const handlePreview = () => {
    // For now, skip saving and go directly to preview (frontend testing mode)
    // In production, this would save first, then trigger video generation
    
    // Start preview generation immediately
    setShowPreviewLoading(true);
    setPreviewProgress(0);

    // Simulate progress (in production, this would track actual video generation)
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
  };

  const handleDownload = () => {
    // Check if user is logged in
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Proceed with download
    toast({
      title: "Download started",
      description: "Your video is being downloaded...",
    });
    
    // Enable download button in editor
    setDownloadEnabled(true);
    
    // TODO: Implement actual download logic
    // For now, just close the modal
    setShowPreviewModal(false);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // Retry download after login
    handleDownload();
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
                {template.name}
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
              disabled={saveCustomizationMutation.isPending}
              data-testid="button-preview"
            >
              {saveCustomizationMutation.isPending ? (
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
        <div className="w-64 border-r bg-card hidden md:flex flex-col">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-foreground">Pages</h2>
            <p className="text-xs text-muted-foreground">{pages.length} pages total</p>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-2">
              {pages.map((page, index) => (
                <button
                  key={page.id}
                  onClick={() => setCurrentPageIndex(index)}
                  className={`w-full text-left rounded-md p-3 transition-colors hover-elevate ${
                    currentPageIndex === index
                      ? 'bg-primary/10 border-2 border-primary'
                      : 'bg-muted border-2 border-transparent'
                  }`}
                  data-testid={`page-list-item-${index}`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-12 h-16 bg-background rounded overflow-hidden">
                      <img
                        src={page.thumbnailUrl}
                        alt={page.pageName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-1">
                        {page.pageName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Page {page.pageNumber}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Center - Page Preview */}
        <div className="flex-1 flex flex-col bg-muted/30">
          <div className="flex-1 flex items-center justify-center p-4 md:p-6 overflow-auto">
            {currentPage && (
              <div className="relative w-full max-w-sm">
                <div className="aspect-[9/16] bg-card rounded-lg shadow-2xl overflow-hidden border-4 border-card max-h-[calc(100vh-250px)]">
                  {currentPage.media && currentPage.media.length > 0 && currentPage.media[0].url ? (
                    <img
                      src={currentPage.media[0].url}
                      alt={`Page ${currentPage.pageNumber} background`}
                      className="w-full h-full object-cover"
                      data-testid="page-preview-image"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground bg-muted">
                      Page {currentPage.pageNumber}
                    </div>
                  )}
                </div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="secondary" className="shadow-lg">
                    {currentPage.pageName}
                  </Badge>
                </div>
              </div>
            )}
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
