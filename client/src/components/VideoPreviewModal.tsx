import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface VideoPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoUrl: string | null;
  templateName: string;
  orientation: "portrait" | "landscape";
  mediaType?: "video" | "card";
}

export function VideoPreviewModal({
  open,
  onOpenChange,
  videoUrl,
  templateName,
  orientation,
  mediaType = "video",
}: VideoPreviewModalProps) {
  const isPortrait = orientation === "portrait";
  const isCard = mediaType === "card";
  
  // For cards, use a different aspect ratio based on orientation
  const containerClass = isCard
    ? isPortrait
      ? "aspect-[3/4] max-w-md mx-auto"
      : "aspect-[4/3] max-w-2xl mx-auto"
    : isPortrait
      ? "aspect-[9/16] max-w-sm mx-auto"
      : "aspect-video max-w-2xl mx-auto";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-black border-0" data-testid="modal-video-preview">
        <DialogHeader>
          <DialogTitle className="text-white">{templateName}</DialogTitle>
          <DialogDescription className="sr-only">
            {isCard ? "Card" : "Video"} preview for {templateName}
          </DialogDescription>
        </DialogHeader>
        <div className={`${containerClass} bg-black rounded-lg overflow-hidden`}>
          {videoUrl ? (
            isCard ? (
              <img
                src={videoUrl}
                alt={templateName}
                className="w-full h-full object-contain"
                data-testid="image-preview"
              />
            ) : (
              <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
                data-testid="video-preview"
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/60" data-testid="video-unavailable">
              <p className="text-center">{isCard ? "Card" : "Video"} preview not available yet</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
