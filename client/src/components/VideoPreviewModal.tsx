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
}

export function VideoPreviewModal({
  open,
  onOpenChange,
  videoUrl,
  templateName,
  orientation,
}: VideoPreviewModalProps) {
  if (!videoUrl) return null;

  const isPortrait = orientation === "portrait";
  const videoContainerClass = isPortrait
    ? "aspect-[9/16] max-w-sm mx-auto"
    : "aspect-video max-w-2xl mx-auto";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-black border-0" data-testid="modal-video-preview">
        <DialogHeader>
          <DialogTitle className="text-white">{templateName}</DialogTitle>
          <DialogDescription className="sr-only">Video preview for {templateName}</DialogDescription>
        </DialogHeader>
        <div className={`${videoContainerClass} bg-black rounded-lg overflow-hidden`}>
          <video
            src={videoUrl}
            controls
            autoPlay
            className="w-full h-full object-contain"
            data-testid="video-preview"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
