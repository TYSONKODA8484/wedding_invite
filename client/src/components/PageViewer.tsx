import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface PageMedia {
  media_id?: string;
  type: string;
  url: string;
  position?: string;
  ae_layer?: string;
}

interface Page {
  id: string;
  pageNumber: number;
  pageName?: string;
  thumbnailUrl?: string;
  editableFields?: any[];
  media: PageMedia[];
}

interface PageViewerProps {
  page: Page;
  className?: string;
}

export function PageViewer({ page, className = "" }: PageViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Get background image URL from page media (prefer 'background' position, fallback to first image)
  const backgroundImage = 
    page.media.find(m => m.position === 'background')?.url || 
    page.media.find(m => m.type === 'image')?.url || 
    page.thumbnailUrl || 
    '';

  // Reset pan when zoom changes to 100%
  useEffect(() => {
    if (zoom === 100) {
      setPanOffset({ x: 0, y: 0 });
    }
  }, [zoom]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 100));
  };

  const handleResetZoom = () => {
    setZoom(100);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 100) {
      setIsPanning(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && zoom > 100) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleMouseLeave = () => {
    setIsPanning(false);
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Zoom Controls */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomOut}
          disabled={zoom <= 100}
          aria-label="Zoom out"
          data-testid="button-zoom-out"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleResetZoom}
          disabled={zoom === 100}
          aria-label="Reset zoom"
          data-testid="button-reset-zoom"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          {zoom}%
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomIn}
          disabled={zoom >= 200}
          aria-label="Zoom in"
          data-testid="button-zoom-in"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
      </div>

      {/* Page Preview Container */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center overflow-hidden rounded-lg bg-muted/30"
        data-testid="page-viewer-container"
      >
        <div
          className={`relative ${zoom > 100 ? 'cursor-move' : 'cursor-default'}`}
          style={{
            transform: `scale(${zoom / 100}) translate(${panOffset.x / (zoom / 100)}px, ${panOffset.y / (zoom / 100)}px)`,
            transformOrigin: 'center center',
            transition: isPanning ? 'none' : 'transform 0.2s ease-out',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {/* Page Content with 9:16 aspect ratio */}
          <div
            className="relative aspect-[9/16] shadow-2xl rounded-lg overflow-hidden ring-1 ring-black/10 dark:ring-white/10"
            style={{
              width: 'min(calc(90vh * 9 / 16), 600px)', // Fits viewport height, max 600px wide
              maxHeight: '85vh',
            }}
            data-testid="page-content"
          >
            {/* Background Image */}
            {backgroundImage ? (
              <img
                src={backgroundImage}
                alt={`Page ${page.pageNumber}`}
                className="absolute inset-0 w-full h-full object-cover"
                data-testid="page-background-image"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                <p className="text-muted-foreground text-sm">No background image</p>
              </div>
            )}

            {/* Text Overlays (Optional - can be enabled later) */}
            {/* Future: Render fields as text overlays positioned based on AE layers */}
          </div>
        </div>
      </div>

      {/* Page Info */}
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground" data-testid="page-info">
          {page.pageName || `Page ${page.pageNumber}`}
          {zoom > 100 && (
            <span className="ml-2 text-xs">
              • Click and drag to pan
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
