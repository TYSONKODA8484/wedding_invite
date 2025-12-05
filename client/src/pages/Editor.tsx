import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useRef, useEffect, useCallback } from "react";
import type { Template, Music as MusicType } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, X, Download, Eye, ArrowLeft, ChevronLeft, ChevronRight, 
  Upload, Image as ImageIcon, Crop, ZoomIn, ZoomOut, Check, 
  GripVertical, Music, Play, Pause, MoveDown, Trash2, Undo2, Redo2, AlertTriangle,
  Sparkles, CreditCard, Volume2, VolumeX
} from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Slider } from "@/components/ui/slider";
import { AuthModal } from "@/components/AuthModal";
import { PaymentModal as PaymentModalComponent } from "@/components/PaymentModal";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1' | 'free'>('9:16');
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
                className="max-w-full max-h-[400px] object-contain"
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
              {(['9:16', '16:9', '1:1', 'free'] as const).map((ratio) => (
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
          <div className="relative aspect-[9/16] rounded-md overflow-hidden bg-muted border border-border">
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
            className="aspect-[9/16] bg-muted rounded-md flex flex-col items-center justify-center border-2 border-dashed border-border cursor-pointer hover-elevate active-elevate-2 transition-colors"
            onClick={handleUploadClick}
            data-testid={`dropzone-${fieldName}`}
          >
            <ImageIcon className="w-6 h-6 text-muted-foreground mb-2" />
            <p className="text-xs text-muted-foreground font-medium">Click to upload</p>
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
      <Card className="w-full max-w-lg p-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative w-24 h-24">
              <svg className="transform -rotate-90 w-24 h-24">
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-muted" />
                <circle
                  cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                  className="text-primary transition-all duration-500"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-foreground">{progress}%</span>
              </div>
            </div>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-md p-3">
            <p className="text-primary font-medium text-sm">
              Creating your video... Please wait!
            </p>
          </div>

          <div className="text-left space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Check className="w-4 h-4 text-green-500" />
              <span>Video will be ready in 2-3 minutes</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Check className="w-4 h-4 text-green-500" />
              <span>Pay only when you like the preview</span>
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
    <Dialog open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent 
        className="max-w-2xl"
        onPointerDownOutside={onClose}
        onEscapeKeyDown={onClose}
        data-testid="modal-preview-generated"
      >
        <DialogHeader>
          <DialogTitle>Preview</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative bg-muted rounded-md overflow-hidden flex items-center justify-center">
            <img 
              src={previewUrl}
              alt="Preview"
              className="max-w-full max-h-[60vh] object-contain"
              data-testid="preview-modal-image"
            />
          </div>

          <div className="bg-primary/10 text-primary rounded-md p-3 text-sm text-center">
            This is a preview. The final video will be high quality without watermark.
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} data-testid="button-close-preview">Close</Button>
          <Button onClick={onDownload} disabled={!downloadEnabled} data-testid="button-download-hd">
            <Download className="w-4 h-4 mr-2" />
            Download HD
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function isUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

interface SortablePageItemProps {
  page: any;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  previewUrl?: string;
}

function SortablePageItem({ page, index, isFirst, isLast, previewUrl }: SortablePageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.id });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  // Use preview URL if available, otherwise fall back to thumbnail
  const imageUrl = previewUrl || page.thumbnailUrl;

  return (
    <div ref={setNodeRef} style={style} className="flex flex-col items-center w-full">
      <div
        {...attributes}
        {...listeners}
        className={`relative rounded-xl overflow-hidden cursor-grab active:cursor-grabbing transition-all touch-none select-none ${
          isDragging 
            ? 'opacity-95 shadow-2xl ring-2 ring-primary scale-[1.02]' 
            : 'hover:ring-2 hover:ring-primary/50 shadow-md'
        }`}
        style={{ touchAction: 'none' }}
        data-testid={`reorder-page-${index}`}
      >
        {/* Responsive page thumbnail - smaller on mobile, larger on desktop */}
        <div className="w-28 xs:w-32 sm:w-40 md:w-44 aspect-[9/16] bg-muted flex-shrink-0">
          <img
            src={imageUrl}
            alt={page.pageName || `Page ${page.pageNumber}`}
            className="w-full h-full object-cover pointer-events-none"
            draggable={false}
          />
        </div>
        
        {/* Page number badge - smaller circle on mobile */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 sm:w-auto sm:h-auto sm:px-3 sm:py-1 bg-background/95 backdrop-blur-sm rounded-full shadow-sm flex items-center justify-center">
          <span className="text-[10px] sm:text-xs font-semibold text-foreground sm:hidden">{page.pageNumber}</span>
          <span className="hidden sm:inline text-xs font-semibold text-foreground">Page {page.pageNumber}</span>
        </div>
        
        {/* Drag handle indicator - smaller on mobile */}
        <div className="absolute top-1.5 sm:top-2 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm rounded-full p-1 sm:px-2 sm:py-0.5">
          <GripVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
        </div>
      </div>
      
      {/* Simple connector line between pages */}
      {!isLast && (
        <div className="flex flex-col items-center py-3 sm:py-4">
          <div className="w-0.5 h-6 sm:h-8 bg-gradient-to-b from-border to-transparent rounded-full" />
        </div>
      )}
    </div>
  );
}

interface ReorderPagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  pages: any[];
  onConfirm: (newOrder: string[]) => void;
  pagePreviewUrls?: Record<string, string>;
}

function ReorderPagesModal({ isOpen, onClose, pages, onConfirm, pagePreviewUrls = {} }: ReorderPagesModalProps) {
  const [orderedPages, setOrderedPages] = useState(pages);

  useEffect(() => {
    setOrderedPages(pages);
  }, [pages]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setOrderedPages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleConfirm = () => {
    onConfirm(orderedPages.map((p) => p.id));
    onClose();
  };

  const handleCancel = () => {
    setOrderedPages(pages);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="w-[95vw] max-w-lg sm:max-w-xl md:max-w-2xl h-[90vh] sm:h-[85vh] max-h-[90vh] p-0 overflow-hidden rounded-2xl" hideCloseButton>
        <DialogHeader className="sr-only">
          <DialogTitle>Re-order Pages</DialogTitle>
        </DialogHeader>
        {/* Header - Fixed at top */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex flex-col">
            <h2 className="text-base sm:text-lg font-semibold" aria-hidden="true">Re-order Pages</h2>
            <p className="text-xs text-muted-foreground hidden sm:block">Drag to rearrange</p>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="h-8 px-3 text-xs sm:text-sm"
              data-testid="button-cancel-reorder"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleConfirm}
              className="h-8 px-3 text-xs sm:text-sm"
              data-testid="button-confirm-reorder"
            >
              <Check className="w-4 h-4 mr-1 sm:mr-2" />
              Done
            </Button>
          </div>
        </div>

        {/* Scrollable content area */}
        <ScrollArea className="flex-1 h-[calc(90vh-64px)] sm:h-[calc(85vh-72px)]">
          <div className="flex flex-col items-center py-6 sm:py-8 px-4 sm:px-6">
            {/* Mobile instruction */}
            <div className="flex items-center gap-2 bg-muted/50 rounded-full px-4 py-2 mb-6">
              <GripVertical className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs sm:text-sm text-muted-foreground">Hold and drag to reorder</p>
            </div>
            
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={orderedPages.map((p) => p.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col items-center gap-0 w-full max-w-xs sm:max-w-sm">
                  {orderedPages.map((page, index) => (
                    <SortablePageItem
                      key={page.id}
                      page={page}
                      index={index}
                      isFirst={index === 0}
                      isLast={index === orderedPages.length - 1}
                      previewUrl={pagePreviewUrls[page.id]}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
            
            {/* Bottom padding for scroll */}
            <div className="h-8" />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default function Editor() {
  const [, params] = useRoute("/editor/:slug");
  const [location, navigate] = useLocation();
  const slug = params?.slug;
  const isEditingProject = slug ? isUUID(slug) : false;
  
  const searchParams = new URLSearchParams(window.location.search);
  const fromPage = searchParams.get('from');

  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [imageFiles, setImageFiles] = useState<Record<string, File>>({});
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({});
  const [projectId, setProjectId] = useState<string | null>((isEditingProject && slug) ? slug : null);
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [orderedPageIds, setOrderedPageIds] = useState<string[]>([]);
  const [zoom, setZoom] = useState(100);
  
  // Pan/drag state for zoomed preview
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const previewCardRef = useRef<HTMLDivElement>(null);
  
  const [showPreviewLoading, setShowPreviewLoading] = useState(false);
  const [previewProgress, setPreviewProgress] = useState(0);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [downloadEnabled, setDownloadEnabled] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingPreview, setPendingPreview] = useState(false);
  const [isAuthVerifying, setIsAuthVerifying] = useState(false);
  
  // Delete confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<{ id: string; index: number } | null>(null);
  
  // Preview coming soon modal
  const [showPreviewComingSoon, setShowPreviewComingSoon] = useState(false);
  
  // Mobile UI state
  const [showMobileEditSheet, setShowMobileEditSheet] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  
  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768); // md breakpoint
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Page preview state - tracks preview index per page (cycles 0-3) and rendered preview URLs
  const [pagePreviewIndices, setPagePreviewIndices] = useState<Record<string, number>>({});
  const [pagePreviewUrls, setPagePreviewUrls] = useState<Record<string, string>>({});
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  
  // Music modal state
  const [showMusicModal, setShowMusicModal] = useState(false);
  const [selectedMusicId, setSelectedMusicId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDurationSeconds, setAudioDurationSeconds] = useState(0);
  const [audioCurrentSeconds, setAudioCurrentSeconds] = useState(0);
  const [customMusicFile, setCustomMusicFile] = useState<File | null>(null);
  const [customMusicUrl, setCustomMusicUrl] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const musicFileInputRef = useRef<HTMLInputElement>(null);
  const customMusicUrlRef = useRef<string | null>(null); // Track URL for cleanup
  
  // Helper to check if custom music is active (either local file or any saved URL from server)
  // Treat any non-null customMusicUrl as custom music (handles /api/media/, absolute URLs, signed URLs, etc.)
  const hasCustomMusic = customMusicFile !== null || customMusicUrl !== null;
  
  // Fetch music library
  const { data: musicLibrary, isLoading: musicLoading } = useQuery<{ music: MusicType[] }>({
    queryKey: ["/api/music"],
  });
  
  const formatTime = (seconds: number) => {
    // Handle edge cases: NaN, Infinity, undefined, or negative values
    if (!Number.isFinite(seconds) || seconds < 0) {
      return '0:00';
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Get current music URL based on selection
  const getCurrentMusicUrl = useCallback(() => {
    if (customMusicUrl) return customMusicUrl;
    if (selectedMusicId && musicLibrary?.music) {
      const track = musicLibrary.music.find(m => m.id === selectedMusicId);
      if (track) return `/api/media/${track.url}`;
    }
    return null;
  }, [selectedMusicId, musicLibrary, customMusicUrl]);
  
  // Get current music name
  const getCurrentMusicName = useCallback(() => {
    if (customMusicFile) return customMusicFile.name;
    // Check for any saved custom music URL (from server)
    if (customMusicUrl) {
      return 'Custom Music';
    }
    if (selectedMusicId && musicLibrary?.music) {
      const track = musicLibrary.music.find(m => m.id === selectedMusicId);
      return track?.name || 'Default Music';
    }
    return 'No music selected';
  }, [selectedMusicId, musicLibrary, customMusicFile, customMusicUrl]);
  
  // Get current music duration from library (for stock tracks) or from audio element (for custom uploads)
  const getDisplayDuration = useCallback(() => {
    if (selectedMusicId && musicLibrary?.music && !customMusicFile) {
      const track = musicLibrary.music.find(m => m.id === selectedMusicId);
      if (track) return track.duration;
    }
    // For custom uploads or when audio metadata is available
    return audioDurationSeconds;
  }, [selectedMusicId, musicLibrary, customMusicFile, audioDurationSeconds]);
  
  // Helper to safely revoke object URL
  const revokeCustomMusicUrl = useCallback(() => {
    if (customMusicUrlRef.current) {
      URL.revokeObjectURL(customMusicUrlRef.current);
      customMusicUrlRef.current = null;
    }
  }, []);
  
  // Upload custom music to object storage
  const uploadCustomMusicToStorage = async (projId: string, file: File): Promise<string> => {
    // Read file as base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = (reader.result as string).split(',')[1]; // Remove data:audio/... prefix
          
          const response = await apiRequest("POST", `/api/projects/${projId}/music/upload`, {
            audioData: base64Data,
            filename: file.name,
            mimeType: file.type,
          });
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to upload music");
          }
          
          const data = await response.json();
          resolve(data.musicUrl);
        } catch (error) {
          console.error("Error uploading music:", error);
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };
  
  const handleMusicFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      // Revoke previous custom URL if exists
      revokeCustomMusicUrl();
      
      setCustomMusicFile(file);
      // Create object URL for playback
      const url = URL.createObjectURL(file);
      customMusicUrlRef.current = url; // Track for cleanup
      setCustomMusicUrl(url);
      setSelectedMusicId(null); // Clear stock music selection
      // Reset playback state
      setIsPlaying(false);
      setAudioProgress(0);
      setAudioCurrentSeconds(0);
      toast({ title: "Music uploaded", description: file.name });
    }
  };
  
  const handleSelectStockMusic = (musicId: string) => {
    // Revoke custom URL if switching to stock music
    revokeCustomMusicUrl();
    setSelectedMusicId(musicId);
    setCustomMusicFile(null);
    setCustomMusicUrl(null);
    setIsPlaying(false);
    setAudioProgress(0);
    setAudioCurrentSeconds(0);
    
    // Use duration from library instead of relying on streamed audio metadata
    if (musicLibrary?.music) {
      const track = musicLibrary.music.find(m => m.id === musicId);
      if (track) {
        setAudioDurationSeconds(track.duration);
      }
    }
  };
  
  // Cleanup audio when modal closes (preserves selection, just stops playback)
  const handleMusicModalClose = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setAudioProgress(0);
    setAudioCurrentSeconds(0);
    setAudioDurationSeconds(0);
    setIsMuted(false);
    setShowMusicModal(false);
  }, []);
  
  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      revokeCustomMusicUrl();
    };
  }, [revokeCustomMusicUrl]);
  
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    // Guard against missing source
    const currentSrc = getCurrentMusicUrl();
    if (!currentSrc) {
      toast({ title: "No music selected", description: "Please select or upload music first." });
      return;
    }
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => {
        console.warn('Audio playback error:', error);
        setIsPlaying(false);
      });
    }
  };
  
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  const handleSeek = (value: number[]) => {
    const duration = getDisplayDuration();
    if (audioRef.current && duration > 0) {
      const newTime = (value[0] / 100) * duration;
      audioRef.current.currentTime = newTime;
      setAudioCurrentSeconds(newTime);
      setAudioProgress(value[0]);
    }
  };
  
  // Get current music URL - memoized
  const currentMusicUrl = getCurrentMusicUrl();
  
  // Audio event handlers - use currentMusicUrl as dependency to re-attach when source changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handleTimeUpdate = () => {
      const currentTime = audio.currentTime;
      setAudioCurrentSeconds(currentTime);
      
      // Use the display duration (from library or audio metadata) for progress calculation
      const duration = audioDurationSeconds > 0 ? audioDurationSeconds : (audio.duration || 0);
      if (duration > 0) {
        setAudioProgress((currentTime / duration) * 100);
      }
    };
    
    const handleLoadedMetadata = () => {
      // Only update duration if we don't already have it from the library
      if (audio.duration && Number.isFinite(audio.duration)) {
        setAudioDurationSeconds(audio.duration);
      }
    };
    
    const handleDurationChange = () => {
      if (audio.duration && Number.isFinite(audio.duration)) {
        setAudioDurationSeconds(audio.duration);
      }
    };
    
    const handleCanPlay = () => {
      // Ensure duration is set when audio can play
      if (audio.duration && Number.isFinite(audio.duration) && audioDurationSeconds === 0) {
        setAudioDurationSeconds(audio.duration);
      }
    };
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setAudioProgress(0);
      setAudioCurrentSeconds(0);
    };
    
    const handleError = (e: Event) => {
      console.warn('Audio error:', e);
      setIsPlaying(false);
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [currentMusicUrl, audioDurationSeconds]);
  
  // Reload audio when source changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    // Reset playback state when source changes
    setAudioProgress(0);
    setAudioCurrentSeconds(0);
    setIsPlaying(false);
    // Note: Don't reset duration here - handleSelectStockMusic sets it from library
    // Only reset if we don't have a selected track
    if (!selectedMusicId && !customMusicFile) {
      setAudioDurationSeconds(0);
    }
    
    if (currentMusicUrl) {
      // Force reload the audio with the new source
      audio.load();
    }
  }, [currentMusicUrl, selectedMusicId, customMusicFile]);
  
  // Undo/Redo history
  type HistoryAction = 
    | { type: 'pages'; previousPageIds: string[]; previousPageIndex: number }
    | { type: 'image'; fieldId: string; previousUrl: string | undefined }
    | { type: 'text'; fieldId: string; previousValue: string };
  
  const [undoStack, setUndoStack] = useState<HistoryAction[]>([]);
  const [redoStack, setRedoStack] = useState<HistoryAction[]>([]);
  const [lastTextSnapshot, setLastTextSnapshot] = useState<Record<string, string>>({});
  
  const pushToHistory = (action: HistoryAction) => {
    setUndoStack(prev => [...prev, action]);
    setRedoStack([]); // Clear redo stack when new action is pushed
  };
  
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    
    const action = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    
    if (action.type === 'pages') {
      // Save current state to redo
      setRedoStack(prev => [...prev, {
        type: 'pages',
        previousPageIds: orderedPageIds,
        previousPageIndex: currentPageIndex,
      }]);
      setOrderedPageIds(action.previousPageIds);
      setCurrentPageIndex(Math.min(action.previousPageIndex, action.previousPageIds.length - 1));
      toast({ title: "Undone", description: "Page changes reverted." });
    } else if (action.type === 'image') {
      setRedoStack(prev => [...prev, {
        type: 'image',
        fieldId: action.fieldId,
        previousUrl: imagePreviews[action.fieldId],
      }]);
      if (action.previousUrl) {
        setImagePreviews(prev => ({ ...prev, [action.fieldId]: action.previousUrl! }));
      } else {
        setImagePreviews(prev => {
          const newPreviews = { ...prev };
          delete newPreviews[action.fieldId];
          return newPreviews;
        });
      }
      toast({ title: "Undone", description: "Image change reverted." });
    } else if (action.type === 'text') {
      setRedoStack(prev => [...prev, {
        type: 'text',
        fieldId: action.fieldId,
        previousValue: fieldValues[action.fieldId] || '',
      }]);
      setFieldValues(prev => ({ ...prev, [action.fieldId]: action.previousValue }));
      toast({ title: "Undone", description: "Text change reverted." });
    }
  };
  
  const handleRedo = () => {
    if (redoStack.length === 0) return;
    
    const action = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    
    if (action.type === 'pages') {
      setUndoStack(prev => [...prev, {
        type: 'pages',
        previousPageIds: orderedPageIds,
        previousPageIndex: currentPageIndex,
      }]);
      setOrderedPageIds(action.previousPageIds);
      setCurrentPageIndex(Math.min(action.previousPageIndex, action.previousPageIds.length - 1));
      toast({ title: "Redone", description: "Page changes restored." });
    } else if (action.type === 'image') {
      setUndoStack(prev => [...prev, {
        type: 'image',
        fieldId: action.fieldId,
        previousUrl: imagePreviews[action.fieldId],
      }]);
      if (action.previousUrl) {
        setImagePreviews(prev => ({ ...prev, [action.fieldId]: action.previousUrl! }));
      } else {
        setImagePreviews(prev => {
          const newPreviews = { ...prev };
          delete newPreviews[action.fieldId];
          return newPreviews;
        });
      }
      toast({ title: "Redone", description: "Image change restored." });
    } else if (action.type === 'text') {
      setUndoStack(prev => [...prev, {
        type: 'text',
        fieldId: action.fieldId,
        previousValue: fieldValues[action.fieldId] || '',
      }]);
      setFieldValues(prev => ({ ...prev, [action.fieldId]: action.previousValue }));
      toast({ title: "Redone", description: "Text change restored." });
    }
  };
  
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Reset pan position when zoom changes or page changes
  useEffect(() => {
    setPanPosition({ x: 0, y: 0 });
  }, [zoom, currentPageIndex]);

  // Window-level listeners to ensure panning ends even if mouse leaves container or window loses focus
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsPanning(false);
    };
    
    const handleWindowBlur = () => {
      setIsPanning(false);
    };
    
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('pointerup', handleGlobalMouseUp);
    window.addEventListener('pointercancel', handleGlobalMouseUp);
    window.addEventListener('blur', handleWindowBlur);
    
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('pointerup', handleGlobalMouseUp);
      window.removeEventListener('pointercancel', handleGlobalMouseUp);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, []);

  // Pan handlers for Photoshop-style drag navigation
  const handlePanStart = (e: React.MouseEvent) => {
    if (zoom <= 100) return; // Only enable panning when zoomed in
    
    // Only start panning if clicking on the preview area (container, card, or image)
    // Exclude interactive form elements
    const target = e.target as HTMLElement;
    const tagName = target.tagName.toLowerCase();
    
    // Don't start pan on interactive elements
    if (['input', 'button', 'textarea', 'select', 'a'].includes(tagName)) {
      return;
    }
    
    // Check if the click is within the preview area
    const isInPreviewArea = previewContainerRef.current?.contains(target);
    if (!isInPreviewArea) return;
    
    e.preventDefault();
    setIsPanning(true);
    setPanStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
  };

  const handlePanMove = (e: React.MouseEvent) => {
    if (!isPanning || zoom <= 100) return;
    e.preventDefault();
    
    const container = previewContainerRef.current;
    const card = previewCardRef.current;
    if (!container || !card) return;
    
    // Calculate new pan position
    let newX = e.clientX - panStart.x;
    let newY = e.clientY - panStart.y;
    
    // Get actual dimensions of container and card
    const containerRect = container.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    
    // Calculate how much the card extends beyond the container in each direction
    // This is the actual visible overflow that we can pan through
    const overflowX = Math.max(0, cardRect.width - containerRect.width);
    const overflowY = Math.max(0, cardRect.height - containerRect.height);
    
    // Max pan is half the overflow (centered starting position)
    const maxPanX = overflowX / 2;
    const maxPanY = overflowY / 2;
    
    // Clamp pan position to bounds
    newX = Math.max(-maxPanX, Math.min(maxPanX, newX));
    newY = Math.max(-maxPanY, Math.min(maxPanY, newY));
    
    setPanPosition({ x: newX, y: newY });
  };

  const handlePanEnd = () => {
    setIsPanning(false);
  };

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
    staleTime: 0, // Always get fresh project data
    refetchOnMount: 'always', // Force refetch when mounting editor
  });

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

  const isLoading = isEditingProject ? (projectIsLoading || templateIsLoading) : templateIsLoading;

  useEffect(() => {
    if (projectData) {
      // Load customization data
      if (projectData.customization) {
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
        
        if (projectData.customization.images) {
          setImagePreviews(projectData.customization.images);
        }
        
        // Load saved page order (includes deletions and reordering)
        if (projectData.customization.pageOrder && Array.isArray(projectData.customization.pageOrder)) {
          setOrderedPageIds(projectData.customization.pageOrder);
        }
        
        // Load saved page preview URLs (rendered previews)
        if (projectData.customization.pagePreviewUrls) {
          setPagePreviewUrls(projectData.customization.pagePreviewUrls);
        }
      }
      
      // Load music selection from existing project
      // Priority: selectedMusicId > customMusicUrl > selectedMusic (hydrated) > template default
      if (projectData.selectedMusicId) {
        setSelectedMusicId(projectData.selectedMusicId);
        setCustomMusicUrl(null);
        setCustomMusicFile(null);
      } else if (projectData.customMusicUrl) {
        // Project has custom music - set the URL for playback
        setCustomMusicUrl(projectData.customMusicUrl);
        setSelectedMusicId(null);
        // Note: customMusicFile stays null since the file is already on server
      } else if (projectData.selectedMusic?.id) {
        // Use hydrated selectedMusic if available (for display consistency)
        setSelectedMusicId(projectData.selectedMusic.id);
        setCustomMusicUrl(null);
        setCustomMusicFile(null);
      }
      
      // Check if project is already paid - enable Download button
      if (projectData.paidAt) {
        setDownloadEnabled(true);
        // Set download URL from project or template
        const url = projectData.finalUrl || projectData.previewUrl;
        if (url) {
          setDownloadUrl(url);
        }
      }
    }
  }, [projectData]);

  useEffect(() => {
    if (templateData?.pages) {
      templateData.pages.forEach((page) => {
        if (page.thumbnailUrl) {
          const thumbnailImg = new Image();
          thumbnailImg.src = page.thumbnailUrl;
        }
        const backgroundMedia = page.media?.find((m: any) => m.position === 'background');
        if (backgroundMedia?.url) {
          const bgImg = new Image();
          bgImg.src = backgroundMedia.url;
        }
      });
      
      // Set default page order:
      // - For new templates: use all template pages in order
      // - For editing projects: use saved pageOrder, or fall back to template pages if not saved (older projects)
      if (orderedPageIds.length === 0) {
        setOrderedPageIds(templateData.pages.map((p: any) => p.id));
      }
    }
    
    // Initialize default music for video templates
    // For new templates: use template's default music
    // For editing projects: only use template default if project has no music saved (fallback for older projects)
    if (templateData && (templateData as any).defaultMusic && !selectedMusicId && !customMusicUrl) {
      setSelectedMusicId((templateData as any).defaultMusic.id);
    }
  }, [templateData, selectedMusicId, customMusicUrl, isEditingProject, orderedPageIds.length]);

  const handleReorderConfirm = (newOrder: string[]) => {
    // Save current state for undo
    pushToHistory({
      type: 'pages',
      previousPageIds: orderedPageIds,
      previousPageIndex: currentPageIndex,
    });
    setOrderedPageIds(newOrder);
    setCurrentPageIndex(0);
    toast({
      title: "Pages reordered",
      description: "The page order has been updated.",
    });
  };
  
  // Handle page deletion from sidebar
  const handleDeletePageClick = (pageId: string, index: number) => {
    if (orderedPageIds.length <= 1) {
      toast({
        title: "Cannot delete",
        description: "You must have at least one page.",
        variant: "destructive",
      });
      return;
    }
    setPageToDelete({ id: pageId, index });
    setShowDeleteConfirm(true);
  };
  
  const confirmDeletePage = () => {
    if (!pageToDelete) return;
    
    // Save current state for undo
    pushToHistory({
      type: 'pages',
      previousPageIds: orderedPageIds,
      previousPageIndex: currentPageIndex,
    });
    
    const newPageIds = orderedPageIds.filter(id => id !== pageToDelete.id);
    setOrderedPageIds(newPageIds);
    
    // Adjust current page index if needed
    if (currentPageIndex >= newPageIds.length) {
      setCurrentPageIndex(Math.max(0, newPageIds.length - 1));
    } else if (currentPageIndex > pageToDelete.index) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
    
    toast({
      title: "Page deleted",
      description: "The page has been removed. Use Undo to restore it.",
    });
    
    setShowDeleteConfirm(false);
    setPageToDelete(null);
  };

  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
  });

  const saveProjectMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error("Not authenticated");
      }

      const allPages = templateData!.pages || [];
      const customizationData: Record<string, any> = {
        pages: {},
        images: {},
        pageOrder: orderedPageIds, // Save the current page order (includes deletions)
      };

      // Save field values for all pages (in case user undoes deletion later)
      for (const page of allPages) {
        const pageFieldValues: Record<string, string> = {};
        for (const field of page.editableFields) {
          const fieldKey = `${page.id}_${field.id}`;
          const value = fieldValues[fieldKey] || field.defaultValue || '';
          pageFieldValues[field.id] = value;
        }
        customizationData.pages[page.id] = pageFieldValues;
      }

      customizationData.images = imagePreviews;
      
      // Include rendered page preview URLs if any exist
      if (Object.keys(pagePreviewUrls).length > 0) {
        customizationData.pagePreviewUrls = pagePreviewUrls;
      }

      // Prepare music data
      // If custom music file is selected (not yet uploaded), we'll upload after project creation
      // If stock music is selected, include selectedMusicId
      // If custom music URL is already on server (editing), preserve it
      // If no music changed, the backend will use template's default music
      let musicPayload: { selectedMusicId?: string | null; customMusicUrl?: string | null } = {};
      
      if (customMusicFile) {
        // Custom music will be uploaded after project creation
        // Don't send selectedMusicId since we're using custom
        musicPayload.selectedMusicId = null;
      } else if (customMusicUrl && !customMusicUrl.startsWith('blob:')) {
        // Custom music is already on server (from previous save) - preserve it
        // Check it's not a blob URL (local preview) - server URLs can be /api/media/*, absolute URLs, etc.
        musicPayload.customMusicUrl = customMusicUrl;
        musicPayload.selectedMusicId = null;
      } else if (selectedMusicId) {
        musicPayload.selectedMusicId = selectedMusicId;
      }

      if (projectId) {
        // First update project with customization
        const response = await apiRequest("PUT", `/api/projects/${projectId}`, {
          customization: customizationData,
          status: "preview_requested",
          ...musicPayload,
        });
        
        // If custom music file exists, upload it now
        if (customMusicFile) {
          await uploadCustomMusicToStorage(projectId, customMusicFile);
        }
        
        return response.json();
      } else {
        // Create new project
        const response = await apiRequest("POST", "/api/projects", {
          templateId: templateData!.id,
          customization: customizationData,
          status: "preview_requested",
          ...musicPayload,
        });
        const newProject = await response.json();
        setProjectId(newProject.id);
        
        // If custom music file exists, upload it now using the new project ID
        if (customMusicFile) {
          await uploadCustomMusicToStorage(newProject.id, customMusicFile);
        }
        
        return newProject;
      }
    },
    onSuccess: () => {
      // Invalidate My Templates cache so new/updated project appears immediately
      queryClient.invalidateQueries({ queryKey: ["/api/projects/mine"] });
      startPreviewGeneration();
    },
    onError: (error: Error) => {
      if (error.message === "Not authenticated") {
        setPendingPreview(true);
        setShowAuthModal(true);
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  const startPreviewGeneration = () => {
    setShowPreviewLoading(true);
    setPreviewProgress(0);
    
    const interval = setInterval(() => {
      setPreviewProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setShowPreviewLoading(false);
          setPreviewUrl(templateData?.pages?.[0]?.thumbnailUrl || '');
          setShowPreviewModal(true);
          // Enable Download button after generation completes
          // (clicking it will open payment modal since downloadUrl is not set yet)
          setDownloadEnabled(true);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    if (pendingPreview) {
      setPendingPreview(false);
      saveProjectMutation.mutate();
    }
  };

  // Handle page preview - renders current page with customizations
  // Does NOT require authentication - just cycles through preview images
  const handlePreviewPage = async () => {
    const currentPage = pages[currentPageIndex];
    if (!currentPage) return;
    
    setIsPreviewLoading(true);
    
    try {
      const currentIndex = pagePreviewIndices[currentPage.id] || 0;
      
      // Build customization data for this page
      const pageFieldValues: Record<string, string> = {};
      for (const field of currentPage.editableFields || []) {
        const fieldKey = `${currentPage.id}_${field.id}`;
        const value = fieldValues[fieldKey] || field.defaultValue || '';
        pageFieldValues[field.id] = value;
      }
      
      const response = await fetch("/api/preview/page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: projectId || undefined,
          templateId: templateData?.id,
          pageId: currentPage.id,
          previewIndex: currentIndex,
          customization: {
            pageOrder: orderedPageIds,
            pages: { [currentPage.id]: pageFieldValues },
            images: imagePreviews,
          },
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Update the preview URL for this page
        setPagePreviewUrls(prev => ({
          ...prev,
          [currentPage.id]: result.previewUrl,
        }));
        
        // Update the preview index for next cycle
        setPagePreviewIndices(prev => ({
          ...prev,
          [currentPage.id]: result.nextIndex,
        }));
        
        toast({
          title: "Preview Generated",
          description: "Page preview has been updated.",
        });
      }
    } catch (error) {
      console.error("Preview error:", error);
      toast({
        title: "Preview Failed",
        description: "Failed to generate page preview. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleGenerateClick = () => {
    // Check if user is logged in first
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setPendingPreview(true);
      setShowAuthModal(true);
      return;
    }
    
    // Trigger the save project mutation which handles the full flow:
    // Save → Generating modal → Preview modal → Download button → Payment
    saveProjectMutation.mutate();
  };

  const handleDownload = () => {
    setShowPreviewModal(false);
    
    // If download is already enabled (payment complete), trigger actual download
    if (downloadEnabled && downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${template?.templateName?.replace(/[^a-zA-Z0-9]/g, '_') || 'Video'}_WeddingInvite.mp4`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: "Your video is being downloaded.",
      });
      return;
    }
    
    // Otherwise, open payment modal
    setShowPaymentModal(true);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !templateData) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background gap-4">
        <p className="text-destructive">Template not found</p>
        <Button onClick={() => navigate("/templates")}>Browse Templates</Button>
      </div>
    );
  }

  const template = templateData;
  const rawPages = template.pages || [];
  
  const orderedPages = orderedPageIds.length > 0
    ? orderedPageIds.map((id) => rawPages.find((p: any) => p.id === id)).filter(Boolean)
    : rawPages;
  
  const pages = orderedPages;
  const currentPage = pages[currentPageIndex];
  const editableFields = currentPage?.editableFields || [];

  const getFieldValue = (fieldId: string) => {
    const key = `${currentPage.id}_${fieldId}`;
    if (fieldValues[key] !== undefined) {
      return fieldValues[key];
    }
    const field = editableFields.find((f: EditableField) => f.id === fieldId);
    return field?.defaultValue || '';
  };

  const handleFieldChange = (fieldId: string, value: string) => {
    const key = `${currentPage.id}_${fieldId}`;
    const currentValue = fieldValues[key] || '';
    
    // Track text changes at word boundaries (when space is typed or field loses word)
    const currentWords = currentValue.trim().split(/\s+/).filter(w => w);
    const newWords = value.trim().split(/\s+/).filter(w => w);
    const lastSnapshot = lastTextSnapshot[key] || '';
    
    // Save to history when a word is completed (space typed) or word deleted
    if (currentWords.length !== newWords.length || 
        (value.endsWith(' ') && !currentValue.endsWith(' '))) {
      if (lastSnapshot !== currentValue) {
        pushToHistory({
          type: 'text',
          fieldId: key,
          previousValue: lastSnapshot,
        });
        setLastTextSnapshot(prev => ({ ...prev, [key]: currentValue }));
      }
    }
    
    setFieldValues((prev) => ({ ...prev, [key]: value }));
  };
  
  // Handle text field blur to save final state
  const handleFieldBlur = (fieldId: string) => {
    const key = `${currentPage.id}_${fieldId}`;
    const currentValue = fieldValues[key] || '';
    const lastSnapshot = lastTextSnapshot[key] || '';
    
    if (lastSnapshot !== currentValue && currentValue !== '') {
      pushToHistory({
        type: 'text',
        fieldId: key,
        previousValue: lastSnapshot,
      });
      setLastTextSnapshot(prev => ({ ...prev, [key]: currentValue }));
    }
  };

  const handleImageSelect = (fieldId: string, file: File) => {
    const key = `${currentPage.id}_${fieldId}`;
    
    // Save previous image for undo
    const previousUrl = imagePreviews[key];
    pushToHistory({
      type: 'image',
      fieldId: key,
      previousUrl: previousUrl,
    });
    
    setImageFiles((prev) => ({ ...prev, [key]: file }));
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviews((prev) => ({ ...prev, [key]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = (fieldId: string) => {
    const key = `${currentPage.id}_${fieldId}`;
    setImageFiles((prev) => {
      const newFiles = { ...prev };
      delete newFiles[key];
      return newFiles;
    });
    setImagePreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[key];
      return newPreviews;
    });
  };

  const getImagePreview = (fieldId: string): string | null => {
    const key = `${currentPage.id}_${fieldId}`;
    return imagePreviews[key] || null;
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

  // Use rendered preview URL if available, otherwise fall back to template media
  const backgroundImage = (currentPage && pagePreviewUrls[currentPage.id]) ||
    currentPage?.media?.find((m: any) => m.position === 'background')?.url || 
    currentPage?.media?.find((m: any) => m.type === 'image')?.url || 
    currentPage?.thumbnailUrl || '';

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden" data-testid="editor-page">
      {showPreviewLoading && (
        <PreviewLoadingScreen progress={previewProgress} onClose={() => setShowPreviewLoading(false)} />
      )}

      {showPreviewModal && (
        <PreviewModal
          previewUrl={previewUrl}
          onClose={() => setShowPreviewModal(false)}
          onDownload={handleDownload}
          downloadEnabled={true}
        />
      )}

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onSuccess={handleAuthSuccess} />

      <ReorderPagesModal
        isOpen={showReorderModal}
        onClose={() => setShowReorderModal(false)}
        pages={pages}
        onConfirm={handleReorderConfirm}
        pagePreviewUrls={pagePreviewUrls}
      />

      {projectId && (
        <PaymentModalComponent
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          projectId={projectId}
          templateName={template.templateName}
          amount={template.price}
          currency={template.currency}
          onSuccess={() => {
            setDownloadEnabled(true);
            // Set download URL from template if not already set
            if (!downloadUrl && template.previewVideoUrl) {
              setDownloadUrl(template.previewVideoUrl);
            }
          }}
          onDownloadReady={(url, name) => {
            setDownloadEnabled(true);
            setDownloadUrl(url);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Delete Page?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this page? You can use the Undo button to restore it after deletion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPageToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeletePage}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Page
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Preview Coming Soon Modal */}
      <Dialog open={showPreviewComingSoon} onOpenChange={setShowPreviewComingSoon}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Preview
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <p className="text-foreground font-medium mb-2">We're working on it!</p>
            <p className="text-sm text-muted-foreground">
              Preview feature will be available soon. Stay tuned!
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowPreviewComingSoon(false)} className="w-full">
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hidden Audio Element for playback */}
      <audio 
        ref={audioRef} 
        src={getCurrentMusicUrl() || undefined}
        preload="metadata"
      />

      {/* Upload Music Modal - Redesigned for Mobile */}
      <Dialog open={showMusicModal} onOpenChange={(open) => {
        if (!open) {
          handleMusicModalClose();
        } else {
          setShowMusicModal(true);
        }
      }}>
        {/* Mobile Music Modal */}
        <DialogContent className="w-[95vw] max-w-lg p-0 overflow-hidden max-h-[85vh] md:hidden rounded-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Background Music</DialogTitle>
          </DialogHeader>
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-background sticky top-0 z-10">
            <h2 className="text-base font-semibold">Background Music</h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleMusicModalClose}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <ScrollArea className="max-h-[calc(85vh-120px)]">
            <div className="p-4 space-y-4">
              {/* Compact Current Selection + Player */}
              <div className="bg-muted/30 rounded-xl p-3">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Music className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{getCurrentMusicName()}</p>
                    <p className="text-xs text-muted-foreground">
                      {hasCustomMusic ? 'Custom upload' : 'From library'}
                    </p>
                  </div>
                  {hasCustomMusic && (
                    <Badge variant="secondary" className="text-[10px] px-2">Custom</Badge>
                  )}
                </div>
                
                {/* Mini Player */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-background shadow-sm flex-shrink-0"
                    onClick={togglePlayPause}
                    disabled={!getCurrentMusicUrl()}
                    data-testid="button-play-music"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                  </Button>
                  
                  <div className="flex-1">
                    <Slider
                      value={[audioProgress]}
                      onValueChange={handleSeek}
                      max={100}
                      step={0.1}
                      disabled={!getCurrentMusicUrl()}
                      className="cursor-pointer"
                      data-testid="slider-audio-progress"
                    />
                  </div>
                  
                  <span className="text-[10px] text-muted-foreground w-12 text-right">
                    {formatTime(audioCurrentSeconds)}/{formatTime(getDisplayDuration())}
                  </span>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 flex-shrink-0"
                    onClick={toggleMute}
                    disabled={!getCurrentMusicUrl()}
                    data-testid="button-mute-music"
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              </div>
              
              {/* Music Library - Compact Grid */}
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Select from library</Label>
                {musicLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {musicLibrary?.music?.map((track) => (
                      <div
                        key={track.id}
                        onClick={() => handleSelectStockMusic(track.id)}
                        className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all ${
                          selectedMusicId === track.id && !hasCustomMusic
                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                            : 'border-border hover:border-muted-foreground/50'
                        }`}
                        data-testid={`music-track-${track.id}`}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                          selectedMusicId === track.id && !hasCustomMusic
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}>
                          <Music className="w-3 h-3" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{track.name}</p>
                          <p className="text-[10px] text-muted-foreground capitalize">{track.duration}s</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Upload Custom */}
              <input
                ref={musicFileInputRef}
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleMusicFileChange}
                data-testid="input-music-file"
              />
              <Button 
                variant="outline"
                className="w-full h-10 text-sm"
                onClick={() => musicFileInputRef.current?.click()}
                data-testid="button-upload-custom-music"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Your Music
              </Button>
              
              {/* Tips - Collapsed */}
              <div className="text-[10px] text-muted-foreground text-center px-4">
                MP3, WAV, AAC, M4A supported. 30s+ recommended.
              </div>
            </div>
          </ScrollArea>
          
          {/* Footer Actions */}
          <div className="flex gap-2 p-4 border-t bg-background">
            <Button 
              variant="outline" 
              className="flex-1 h-10"
              onClick={handleMusicModalClose}
              data-testid="button-cancel-music"
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 h-10"
              onClick={() => {
                handleMusicModalClose();
                toast({ title: "Music saved" });
              }}
              data-testid="button-save-music"
            >
              Save
            </Button>
          </div>
        </DialogContent>
        
        {/* Desktop Music Modal - Original Layout */}
        <DialogContent className="hidden md:block w-[95vw] max-w-4xl p-0 overflow-hidden max-h-[90vh]">
          <DialogHeader className="sr-only">
            <DialogTitle>Background Music</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[90vh]">
            <div className="flex flex-col lg:flex-row">
              {/* Left Section - Music Controls */}
              <div className="flex-1 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r">
                <h2 className="text-lg font-semibold mb-4 sm:mb-6">Background Music</h2>
                
                {/* Current Selection Display */}
                <div className="mb-4 sm:mb-6">
                  <Label className="text-sm text-muted-foreground mb-2 block">Currently Selected</Label>
                  <div className="flex items-center gap-2 p-3 rounded-md border border-border bg-muted/30">
                    <Music className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium truncate">{getCurrentMusicName()}</span>
                    {hasCustomMusic && (
                      <Badge variant="secondary" className="ml-auto flex-shrink-0">Custom</Badge>
                    )}
                  </div>
                </div>
                
                {/* Saved Custom Music Section */}
                {customMusicUrl && !customMusicFile && (
                  <div className="mb-4 sm:mb-6">
                    <Label className="text-sm text-muted-foreground mb-2 block">Your Uploaded Music</Label>
                    <div className="flex items-center gap-3 p-3 rounded-md border border-primary bg-primary/5">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-primary text-primary-foreground">
                        <Music className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">Custom Music</p>
                        <p className="text-xs text-muted-foreground">Previously uploaded</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          revokeCustomMusicUrl();
                          setCustomMusicUrl(null);
                          setCustomMusicFile(null);
                        }}
                        className="flex-shrink-0 text-muted-foreground hover:text-destructive"
                        data-testid="button-remove-saved-music"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    </div>
                  </div>
                )}
                
                {/* Audio Player */}
                <div className="bg-muted/30 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full bg-background shadow-sm flex-shrink-0"
                      onClick={togglePlayPause}
                      disabled={!getCurrentMusicUrl()}
                      data-testid="button-play-music-desktop"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </Button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                        <span>{formatTime(audioCurrentSeconds)}</span>
                        <span>/</span>
                        <span>{formatTime(getDisplayDuration())}</span>
                      </div>
                      <Slider
                        value={[audioProgress]}
                        onValueChange={handleSeek}
                        max={100}
                        step={0.1}
                        disabled={!getCurrentMusicUrl()}
                        className="cursor-pointer"
                        data-testid="slider-audio-progress-desktop"
                      />
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 flex-shrink-0"
                      onClick={toggleMute}
                      disabled={!getCurrentMusicUrl()}
                      data-testid="button-mute-music-desktop"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                
                {/* Music Library */}
                <div className="mb-4 sm:mb-6">
                  <Label className="text-sm text-muted-foreground mb-2 block">Music Library</Label>
                  {musicLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {musicLibrary?.music?.map((track) => (
                        <div
                          key={track.id}
                          onClick={() => handleSelectStockMusic(track.id)}
                          className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                            selectedMusicId === track.id && !hasCustomMusic
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-muted-foreground/50'
                          }`}
                          data-testid={`music-track-desktop-${track.id}`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            selectedMusicId === track.id && !hasCustomMusic
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}>
                            <Music className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{track.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">{track.category} • {track.duration}s</p>
                          </div>
                          {selectedMusicId === track.id && !hasCustomMusic && (
                            <Check className="w-4 h-4 text-primary flex-shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Upload Button */}
                <Button 
                  variant="outline"
                  className="w-full mb-4 sm:mb-6"
                  onClick={() => musicFileInputRef.current?.click()}
                  data-testid="button-upload-custom-music-desktop"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Music
                </Button>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <Button 
                    onClick={() => {
                      handleMusicModalClose();
                      toast({ title: "Music saved", description: "Your music selection has been saved." });
                    }}
                    data-testid="button-save-music-desktop"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Save Selection
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleMusicModalClose}
                    data-testid="button-cancel-music-desktop"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
              
              {/* Right Section - Info Panel */}
              <div className="w-full lg:w-80 bg-muted/20 p-4 sm:p-6">
                <h3 className="font-medium mb-4">Music Tips</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <p className="text-xs sm:text-sm text-foreground">
                      Choose from our curated music library or upload your own track.
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <p className="text-xs sm:text-sm text-foreground">
                      Music should be <strong>30 seconds or longer</strong> for best results.
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <p className="text-xs sm:text-sm text-foreground">
                      Supported formats: <strong>MP3, WAV, AAC, M4A</strong>
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <p className="text-xs sm:text-sm text-foreground">
                      Preview your music before generating the video.
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Music className="w-3 h-3 text-primary-foreground" />
                    </div>
                    <p className="text-xs sm:text-sm text-foreground">
                      The selected music will be added as background audio to your video invitation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Top Header - Desktop */}
      <header className="hidden md:flex h-14 border-b bg-card items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fromPage === 'my-templates' ? navigate('/my-templates') : navigate(`/template/${template.slug}`)}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          {/* Undo/Redo Buttons */}
          <div className="flex items-center gap-1 border-l pl-2 ml-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleUndo}
              disabled={undoStack.length === 0}
              title="Undo (Ctrl+Z)"
              data-testid="button-undo"
            >
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              title="Redo (Ctrl+Y)"
              data-testid="button-redo"
            >
              <Redo2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Show music button only for video templates */}
          {template?.templateType === 'video' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowMusicModal(true)}
              className="border-border"
              data-testid="button-upload-music"
            >
              <Music className="w-4 h-4 mr-2" />
              {selectedMusicId || hasCustomMusic ? 'Change Music' : 'Add Music'}
            </Button>
          )}
          <Button 
            size="sm" 
            onClick={handleGenerateClick}
            disabled={saveProjectMutation.isPending}
            className="relative overflow-visible bg-gradient-to-r from-primary via-primary to-amber-500 hover:from-primary/90 hover:via-primary/90 hover:to-amber-500/90 text-primary-foreground px-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold"
            data-testid="button-generate"
          >
            {saveProjectMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            Generate
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
          </Button>
          <Button 
            variant="outline"
            size="sm" 
            disabled={!downloadEnabled}
            onClick={handleDownload}
            className={!downloadEnabled ? "opacity-50 cursor-not-allowed" : ""}
            data-testid="button-download"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </header>

      {/* Top Header - Mobile: Simplified with back, undo/redo, and generate */}
      <header className="flex md:hidden h-12 border-b bg-card items-center justify-between px-3 flex-shrink-0">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => fromPage === 'my-templates' ? navigate('/my-templates') : navigate(`/template/${template.slug}`)}
            data-testid="button-back-mobile"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          {/* Undo/Redo */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleUndo}
            disabled={undoStack.length === 0}
            data-testid="button-undo-mobile"
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            data-testid="button-redo-mobile"
          >
            <Redo2 className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Music button (icon only) for video templates */}
        <div className="flex items-center gap-2">
          {template?.templateType === 'video' && (
            <Button 
              variant="outline" 
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowMusicModal(true)}
              data-testid="button-music-mobile"
            >
              <Music className="w-4 h-4" />
            </Button>
          )}
          
          {/* Generate button */}
          <Button 
            size="sm" 
            onClick={handleGenerateClick}
            disabled={saveProjectMutation.isPending}
            className="relative overflow-visible bg-gradient-to-r from-primary via-primary to-amber-500 hover:from-primary/90 hover:via-primary/90 hover:to-amber-500/90 text-primary-foreground px-3 shadow-lg font-semibold text-xs h-8"
            data-testid="button-generate-mobile"
          >
            {saveProjectMutation.isPending ? (
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            ) : (
              <Sparkles className="w-3 h-3 mr-1" />
            )}
            Generate
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex min-h-0">
        {/* Left Panel - Pages/Clips - DESKTOP ONLY */}
        <div className="hidden md:flex w-36 lg:w-44 border-r bg-card flex-col flex-shrink-0">
          <div className="p-3 border-b">
            <Button 
              variant="default" 
              size="sm" 
              className="w-full text-xs"
              onClick={() => setShowReorderModal(true)}
              data-testid="button-reorder-pages"
            >
              <GripVertical className="w-3 h-3 mr-1" />
              Re-Order Pages
            </Button>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-2">
              {pages.map((page, index) => (
                <div
                  key={page.id}
                  className="relative"
                  data-testid={`page-container-${index}`}
                >
                  {/* Delete button - always visible in top right */}
                  {pages.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePageClick(page.id, index);
                      }}
                      className="absolute -top-1 -right-1 z-10 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-md hover:bg-destructive/80 transition-colors"
                      data-testid={`button-delete-page-${index}`}
                      title="Delete page"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                  
                  <div
                    onClick={() => setCurrentPageIndex(index)}
                    className={`w-full relative rounded-lg overflow-hidden transition-all cursor-pointer ${
                      currentPageIndex === index
                        ? 'ring-2 ring-primary shadow-md'
                        : 'hover:ring-1 hover:ring-muted-foreground/30'
                    }`}
                    data-testid={`page-thumbnail-${index}`}
                  >
                    <div className="aspect-[9/16] bg-muted relative">
                      <img
                        src={pagePreviewUrls[page.id] || page.thumbnailUrl}
                        alt={page.pageName}
                        className="w-full h-full object-cover"
                        loading="eager"
                      />
                      {currentPageIndex === index && (
                        <div className="absolute inset-0 bg-primary/10" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Center Panel - Preview */}
        <div className="flex-1 flex flex-col min-w-0 bg-muted/20">
          {/* Preview Area - with pan/drag support when zoomed (desktop only) */}
          <div 
            ref={previewContainerRef}
            className="flex-1 flex items-center justify-center p-2 md:p-4 min-h-0 overflow-hidden"
            style={{
              cursor: !isMobileView && zoom > 100 ? (isPanning ? 'grabbing' : 'grab') : 'default',
            }}
            onMouseDown={!isMobileView ? handlePanStart : undefined}
            onMouseMove={!isMobileView ? handlePanMove : undefined}
            onMouseUp={!isMobileView ? handlePanEnd : undefined}
            onMouseLeave={!isMobileView ? handlePanEnd : undefined}
          >
            <div 
              ref={previewCardRef}
              className="relative bg-white dark:bg-card rounded-lg shadow-xl overflow-hidden select-none"
              style={isMobileView ? {
                width: 'auto',
                height: '100%',
                maxWidth: '100%',
                maxHeight: 'calc(100% - 10px)',
                aspectRatio: '9/16',
              } : {
                width: `${280 * (zoom / 100)}px`,
                height: `${280 * (zoom / 100) * (16 / 9)}px`,
                maxWidth: zoom <= 100 ? '100%' : 'none',
                maxHeight: zoom <= 100 ? 'calc(100% - 20px)' : 'none',
                transform: `translate(${panPosition.x}px, ${panPosition.y}px)`,
                transition: isPanning ? 'none' : 'transform 0.1s ease-out',
              }}
              data-testid="preview-container"
            >
              {backgroundImage ? (
                <img
                  src={backgroundImage}
                  alt={`Page ${currentPage?.pageNumber}`}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  draggable={false}
                  data-testid="page-preview-image"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">No preview</p>
                </div>
              )}
              
              {/* Preview Loading Overlay */}
              {isPreviewLoading && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                  <div className="bg-card/90 rounded-xl p-4 md:p-6 flex flex-col items-center gap-2 md:gap-3 shadow-lg">
                    <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin text-primary" />
                    <p className="text-xs md:text-sm font-medium text-foreground">Generating Preview...</p>
                    <p className="text-xs text-muted-foreground hidden md:block">Rendering page with your customizations</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Controls - DESKTOP */}
          <div className="hidden md:flex h-16 border-t bg-card items-center justify-between px-4 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPageIndex === 0}
              data-testid="button-back-page"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviewPage}
                disabled={isPreviewLoading}
                data-testid="button-preview"
              >
                {isPreviewLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Eye className="w-4 h-4 mr-2" />
                )}
                {isPreviewLoading ? 'Rendering...' : 'Preview'}
              </Button>
              
              {/* Zoom Controls */}
              <div className="flex items-center gap-2 bg-muted rounded-md px-2 py-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setZoom(Math.max(50, zoom - 25))}
                  disabled={zoom <= 50}
                  data-testid="button-zoom-out"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-xs font-medium w-10 text-center">{zoom}%</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setZoom(Math.min(200, zoom + 25))}
                  disabled={zoom >= 200}
                  data-testid="button-zoom-in"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Button
              variant="default"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPageIndex === pages.length - 1}
              data-testid="button-next-page"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {/* Mobile Bottom UI - Horizontal page strip, toolbar, and controls */}
          <div className="flex md:hidden flex-col border-t bg-card flex-shrink-0">
            {/* Horizontal Page Thumbnails Strip */}
            <div className="h-20 border-b overflow-x-auto">
              <div className="flex items-center gap-2 px-3 py-2 h-full">
                {pages.map((page, index) => (
                  <div
                    key={page.id}
                    onClick={() => setCurrentPageIndex(index)}
                    className={`relative flex-shrink-0 rounded-lg overflow-hidden transition-all cursor-pointer ${
                      currentPageIndex === index
                        ? 'ring-2 ring-primary shadow-md scale-105'
                        : 'ring-1 ring-border opacity-70'
                    }`}
                    data-testid={`mobile-page-${index}`}
                  >
                    <div className="w-10 aspect-[9/16] bg-muted">
                      <img
                        src={pagePreviewUrls[page.id] || page.thumbnailUrl}
                        alt={page.pageName}
                        className="w-full h-full object-cover"
                        loading="eager"
                      />
                    </div>
                    {/* Page number indicator - simple circle */}
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-background/95 flex items-center justify-center shadow-sm">
                      <span className="text-[9px] font-semibold">{index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Toolbar - Re-order, Edit Fields, Preview */}
            <div className="h-14 flex items-center justify-around px-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col items-center gap-0.5 h-auto py-1.5 px-3"
                onClick={() => setShowReorderModal(true)}
                data-testid="button-reorder-mobile"
              >
                <GripVertical className="w-5 h-5" />
                <span className="text-[10px]">Reorder</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col items-center gap-0.5 h-auto py-1.5 px-3"
                onClick={() => setShowMobileEditSheet(true)}
                data-testid="button-edit-mobile"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                <span className="text-[10px]">Edit</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col items-center gap-0.5 h-auto py-1.5 px-3"
                onClick={handlePreviewPage}
                disabled={isPreviewLoading}
                data-testid="button-preview-mobile"
              >
                {isPreviewLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
                <span className="text-[10px]">{isPreviewLoading ? 'Loading' : 'Preview'}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col items-center gap-0.5 h-auto py-1.5 px-3"
                disabled={!downloadEnabled}
                onClick={handleDownload}
                data-testid="button-download-mobile"
              >
                <Download className="w-5 h-5" />
                <span className="text-[10px]">Download</span>
              </Button>
            </div>

            {/* Page Navigation */}
            <div className="h-11 border-t flex items-center justify-between px-4">
              <Button
                variant="ghost"
                size="sm"
                className="h-8"
                onClick={goToPreviousPage}
                disabled={currentPageIndex === 0}
                data-testid="button-prev-mobile"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              
              <span className="text-xs text-muted-foreground">
                Page {currentPageIndex + 1} of {pages.length}
              </span>
              
              <Button
                variant="default"
                size="sm"
                className="h-8"
                onClick={goToNextPage}
                disabled={currentPageIndex === pages.length - 1}
                data-testid="button-next-mobile"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel - Edit Fields - DESKTOP ONLY */}
        <div className="hidden md:flex w-72 lg:w-80 border-l bg-card flex-col flex-shrink-0">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-foreground text-sm">Edit Fields</h2>
            <p className="text-xs text-muted-foreground">Page {currentPageIndex + 1} of {pages.length}</p>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {editableFields.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground text-sm">No editable fields on this page</p>
                </div>
              ) : (
                editableFields.filter((field: EditableField) => field?.id).map((field: EditableField, index: number) => (
                  <div key={index} className="space-y-2" data-testid={`field-${field.id}`}>
                    <Label htmlFor={field.id} className="text-xs font-medium">
                      {field.label || field.id}
                    </Label>
                    
                    {field.type === 'textarea' ? (
                      <>
                        <Textarea
                          id={field.id}
                          value={getFieldValue(field.id)}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          onBlur={() => handleFieldBlur(field.id)}
                          maxLength={field.maxLength}
                          rows={3}
                          className="resize-none text-sm"
                          data-testid={`input-${field.id}`}
                        />
                        {field.maxLength && (
                          <div className="flex justify-end">
                            <span className="text-xs text-muted-foreground">
                              {getFieldValue(field.id).length}/{field.maxLength}
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
                          onBlur={() => handleFieldBlur(field.id)}
                          maxLength={field.maxLength}
                          className="text-sm"
                          data-testid={`input-${field.id}`}
                        />
                        {field.maxLength && (
                          <div className="flex justify-end">
                            <span className="text-xs text-muted-foreground">
                              {getFieldValue(field.id).length}/{field.maxLength}
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

      {/* Mobile Edit Sheet - Slide up from bottom with dynamic height */}
      <Dialog open={showMobileEditSheet} onOpenChange={setShowMobileEditSheet}>
        <DialogContent 
          className="w-full max-w-none fixed bottom-0 top-auto translate-y-0 rounded-t-2xl rounded-b-none p-0 gap-0 border-t border-x border-b-0 md:hidden" 
          style={{ 
            maxHeight: '85vh',
            height: 'auto',
            minHeight: editableFields.length === 0 ? '30vh' : `min(${Math.min(35 + editableFields.length * 12, 70)}vh, 85vh)`
          }}
          hideCloseButton
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Edit Fields</DialogTitle>
          </DialogHeader>
          
          {/* Header with handle bar and close */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b bg-background sticky top-0 z-10">
            <div className="flex items-center gap-3">
              {/* Handle bar indicator */}
              <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
              <div>
                <h2 className="font-semibold text-foreground text-sm">Edit Fields</h2>
                <p className="text-[11px] text-muted-foreground">Page {currentPageIndex + 1} of {pages.length}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowMobileEditSheet(false)}
              data-testid="button-close-edit-sheet"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Content - auto height with max scroll */}
          <div className="overflow-y-auto flex-1" style={{ maxHeight: 'calc(85vh - 60px)' }}>
            <div className="p-4 pb-8 space-y-3">
              {editableFields.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground text-sm">No editable fields on this page</p>
                </div>
              ) : (
                editableFields.filter((field: EditableField) => field?.id).map((field: EditableField, index: number) => (
                  <div key={index} className="space-y-1.5" data-testid={`mobile-field-${field.id}`}>
                    <Label htmlFor={`mobile-${field.id}`} className="text-xs font-medium text-muted-foreground">
                      {field.label || field.id}
                    </Label>
                    
                    {field.type === 'textarea' ? (
                      <>
                        <Textarea
                          id={`mobile-${field.id}`}
                          value={getFieldValue(field.id)}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          onBlur={() => handleFieldBlur(field.id)}
                          maxLength={field.maxLength}
                          rows={3}
                          className="resize-none text-base min-h-[80px]"
                          data-testid={`mobile-input-${field.id}`}
                        />
                        {field.maxLength && (
                          <div className="flex justify-end">
                            <span className="text-[10px] text-muted-foreground">
                              {getFieldValue(field.id).length}/{field.maxLength}
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
                          id={`mobile-${field.id}`}
                          type="text"
                          value={getFieldValue(field.id)}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          onBlur={() => handleFieldBlur(field.id)}
                          maxLength={field.maxLength}
                          className="text-base h-10"
                          data-testid={`mobile-input-${field.id}`}
                        />
                        {field.maxLength && (
                          <div className="flex justify-end">
                            <span className="text-[10px] text-muted-foreground">
                              {getFieldValue(field.id).length}/{field.maxLength}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
