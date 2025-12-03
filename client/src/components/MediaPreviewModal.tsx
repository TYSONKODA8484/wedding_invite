import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MediaPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mediaUrl: string | null;
  mediaType: "image" | "video";
  templateName: string;
  orientation: "portrait" | "landscape";
}

export function MediaPreviewModal({
  open,
  onOpenChange,
  mediaUrl,
  mediaType,
  templateName,
  orientation,
}: MediaPreviewModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  const isPortrait = orientation === "portrait";

  const handleMediaLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleMediaError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setIsLoading(true);
      setHasError(false);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="max-w-[95vw] sm:max-w-4xl p-0 bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 overflow-hidden"
        data-testid="modal-media-preview"
      >
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 border-b border-zinc-800/50">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white font-playfair text-lg sm:text-xl pr-8 truncate">
              {templateName}
            </DialogTitle>
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-3 top-3 text-zinc-400"
              onClick={() => handleOpenChange(false)}
              data-testid="button-close-modal"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="sr-only">
            {mediaType === "video" ? "Video" : "Image"} preview for {templateName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative flex items-center justify-center p-4 sm:p-6 min-h-[300px] sm:min-h-[400px]">
          {isLoading && !hasError && mediaUrl && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/80 z-10" data-testid="loading-indicator">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
              <p className="text-zinc-400 text-sm">Loading {mediaType}...</p>
            </div>
          )}
          
          {hasError ? (
            <div className="flex flex-col items-center justify-center text-zinc-400 py-12" data-testid="media-error">
              <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                <X className="h-8 w-8 text-zinc-500" />
              </div>
              <p className="text-center text-lg font-medium mb-2">Failed to load {mediaType}</p>
              <p className="text-sm text-zinc-500">Please try again later</p>
            </div>
          ) : mediaUrl ? (
            <div 
              className={`relative w-full flex items-center justify-center ${
                isPortrait 
                  ? "max-h-[70vh]" 
                  : "max-h-[60vh]"
              }`}
            >
              {mediaType === "video" ? (
                <video
                  src={mediaUrl}
                  controls
                  autoPlay
                  playsInline
                  onLoadedData={handleMediaLoad}
                  onError={handleMediaError}
                  className={`rounded-lg shadow-2xl ${
                    isPortrait 
                      ? "max-h-[70vh] w-auto max-w-full" 
                      : "max-h-[60vh] w-auto max-w-full"
                  } ${isLoading ? "invisible" : "visible"}`}
                  style={{
                    aspectRatio: isPortrait ? "9/16" : "16/9",
                  }}
                  data-testid="video-preview"
                />
              ) : (
                <img
                  src={mediaUrl}
                  alt={templateName}
                  onLoad={handleMediaLoad}
                  onError={handleMediaError}
                  className={`rounded-lg shadow-2xl object-contain ${
                    isPortrait 
                      ? "max-h-[70vh] w-auto max-w-full" 
                      : "max-h-[60vh] w-auto max-w-full"
                  } ${isLoading ? "invisible" : "visible"}`}
                  data-testid="image-preview"
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-zinc-400 py-12" data-testid="media-unavailable">
              <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                <X className="h-8 w-8 text-zinc-500" />
              </div>
              <p className="text-center text-lg font-medium mb-2">
                {mediaType === "video" ? "Video" : "Image"} not available
              </p>
              <p className="text-sm text-zinc-500">The file is still being processed</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
