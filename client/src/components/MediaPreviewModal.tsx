import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const isPortrait = orientation === "portrait";
  const containerClass = isPortrait
    ? "aspect-[9/16] max-w-sm mx-auto"
    : "aspect-video max-w-2xl mx-auto";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-black border-0" data-testid="modal-media-preview">
        <DialogHeader>
          <DialogTitle className="text-white">{templateName}</DialogTitle>
          <DialogDescription className="sr-only">
            {mediaType === "video" ? "Video" : "Image"} preview for {templateName}
          </DialogDescription>
        </DialogHeader>
        <div className={`${containerClass} bg-black rounded-lg overflow-hidden`}>
          {mediaUrl ? (
            mediaType === "video" ? (
              <video
                src={mediaUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
                data-testid="video-preview"
              />
            ) : (
              <img
                src={mediaUrl}
                alt={templateName}
                className="w-full h-full object-contain"
                data-testid="image-preview"
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/60" data-testid="media-unavailable">
              <p className="text-center">
                {mediaType === "video" ? "Video" : "Image"} preview not available yet
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
