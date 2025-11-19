import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import type { Template, TemplatePage } from "@shared/schema";
import { Loader2, X, Save, Eye, ArrowLeft, ChevronLeft, ChevronRight, Upload, Image as ImageIcon, Crop, ZoomIn, ZoomOut } from "lucide-react";
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
  // Clamp zoom to ≥ 100% (zoom-in only for MVP)
  const zoomFactor = Math.max(1, zoomPercent / 100);

  // Determine target aspect ratio
  let targetAspect = 1;
  if (aspectRatio === '16:9') targetAspect = 16 / 9;
  else if (aspectRatio === '9:16') targetAspect = 9 / 16;
  else if (aspectRatio === '1:1') targetAspect = 1;
  else targetAspect = imgWidth / imgHeight; // free

  // Canvas dimensions (fixed width for output)
  const canvasWidth = 800;
  const canvasHeight = Math.round(canvasWidth / targetAspect);

  // Calculate base source crop region (aspect-correct, centered)
  const imgAspect = imgWidth / imgHeight;
  let baseSrcWidth, baseSrcHeight;

  if (imgAspect > targetAspect) {
    // Image wider - crop width
    baseSrcHeight = imgHeight;
    baseSrcWidth = baseSrcHeight * targetAspect;
  } else {
    // Image taller - crop height
    baseSrcWidth = imgWidth;
    baseSrcHeight = baseSrcWidth / targetAspect;
  }

  // Apply zoom by shrinking source region (zoom in = show less of image = enlarged view)
  const srcWidth = baseSrcWidth / zoomFactor;
  const srcHeight = baseSrcHeight / zoomFactor;

  // Center the zoomed crop box
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
  const [zoom, setZoom] = useState([100]); // 100-200% (zoom-in only)
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1' | 'free'>('16:9');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // Update preview whenever zoom or aspect ratio changes
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

  // Update preview when zoom or aspect ratio changes
  useEffect(() => {
    updatePreview();
  }, [zoom, aspectRatio, imageUrl]);

  const handleConfirm = () => {
    // Reuse the preview canvas which already has the correct crop applied
    // This prevents race conditions from async Image loading
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
          {/* Canvas for preview rendering (hidden) */}
          <canvas ref={previewCanvasRef} className="hidden" />
          
          {/* Image Preview - shows actual crop */}
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

          {/* Zoom Control */}
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

          {/* Aspect Ratio Selector */}
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
      // Create temporary URL for crop modal
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
    // Convert cropped data URL back to File for storage
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

export default function Editor() {
  const [, params] = useRoute("/editor/:slug");
  const [, navigate] = useLocation();
  const slug = params?.slug;

  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [imageFiles, setImageFiles] = useState<Record<string, File>>({});
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({});

  const { data: templateData, isLoading, error } = useQuery<Template & { pages?: TemplatePage[] }>({
    queryKey: ["/api/templates", slug],
    queryFn: async () => {
      const response = await fetch(`/api/templates/${slug}`);
      if (!response.ok) throw new Error("Failed to fetch template");
      return response.json();
    },
    enabled: !!slug,
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
    return fieldValues[`${currentPage.id}_${fieldId}`] || '';
  };

  const handleImageSelect = (fieldId: string, file: File) => {
    const fieldKey = `${currentPage.id}_${fieldId}`;
    setImageFiles(prev => ({
      ...prev,
      [fieldKey]: file
    }));

    // Create preview URL
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
                {template.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                Page {currentPageIndex + 1} of {pages.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" data-testid="button-preview">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button variant="default" size="sm" data-testid="button-save">
              <Save className="w-4 h-4 mr-2" />
              Save
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
          <div className="flex-1 flex items-center justify-center p-6">
            {currentPage && (
              <div className="relative max-w-md w-full">
                <div className="aspect-[9/16] bg-card rounded-lg shadow-2xl overflow-hidden border-4 border-card">
                  <img
                    src={currentPage.thumbnailUrl}
                    alt={currentPage.pageName}
                    className="w-full h-full object-cover"
                    data-testid="page-preview-image"
                  />
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
                  <div key={index} className="space-y-2" data-testid={`field-${field.id}`}>
                    <Label htmlFor={field.id} className="text-sm font-medium">
                      {field.label}
                    </Label>
                    {field.type === 'textarea' ? (
                      <Textarea
                        id={field.id}
                        placeholder={`Enter ${field.label?.toLowerCase() || 'text'}`}
                        value={getFieldValue(field.id)}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        maxLength={field.maxLength}
                        rows={4}
                        data-testid={`input-${field.id}`}
                      />
                    ) : field.type === 'image' ? (
                      <ImageUploadField
                        fieldName={field.id}
                        preview={getImagePreview(field.id)}
                        onSelect={(file) => handleImageSelect(field.id, file)}
                        onRemove={() => handleImageRemove(field.id)}
                      />
                    ) : (
                      <Input
                        id={field.id}
                        type="text"
                        placeholder={`Enter ${field.label?.toLowerCase() || 'text'}`}
                        value={getFieldValue(field.id)}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        maxLength={field.maxLength}
                        data-testid={`input-${field.id}`}
                      />
                    )}
                    {field.maxLength && (
                      <p className="text-xs text-muted-foreground text-right">
                        {getFieldValue(field.id).length} / {field.maxLength}
                      </p>
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
