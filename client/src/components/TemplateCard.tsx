import { useState, useRef } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";

interface TemplateCardProps {
  id: string;
  title: string;
  slug: string;
  category: string;
  duration: number;
  thumbnailUrl: string;
  demoVideoUrl?: string;
  isPremium?: boolean;
  templateType?: "video" | "card";
}

export function TemplateCard({
  id,
  title,
  slug,
  category,
  duration,
  thumbnailUrl,
  demoVideoUrl,
  isPremium,
  templateType = "video",
}: TemplateCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isVideoTemplate = templateType === "video";

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (isVideoTemplate && demoVideoUrl && videoRef.current) {
      setShowVideo(true);
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setTimeout(() => setShowVideo(false), 100);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isVideoTemplate && demoVideoUrl && videoRef.current) {
      e.preventDefault();
      setShowVideo(true);
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  return (
    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-card" data-testid={`card-template-${id}`}>
      <Link href={`/template/${slug}`} className="block">
        <div 
          className="relative aspect-[9/16] overflow-hidden bg-muted rounded-t-lg"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        >
          <img
            src={thumbnailUrl}
            alt={title}
            className={`w-full h-full object-cover transition-all duration-500 ${
              showVideo && isVideoTemplate && demoVideoUrl ? 'opacity-0 scale-100' : 'opacity-100 group-hover:scale-105'
            }`}
          />
          
          {isVideoTemplate && demoVideoUrl && (
            <video
              ref={videoRef}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                showVideo ? 'opacity-100' : 'opacity-0'
              }`}
              muted
              loop
              playsInline
              preload="metadata"
              data-testid={`video-preview-${id}`}
            >
              <source src={demoVideoUrl} type="video/mp4" />
            </video>
          )}
          
          <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
            showVideo ? 'opacity-0' : 'opacity-100'
          }`} />
          
          {isVideoTemplate && !showVideo && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Play className="w-5 h-5 text-primary fill-current ml-0.5" />
              </div>
            </div>
          )}

          <span 
            className="absolute bottom-2 right-2 px-2 py-0.5 text-[10px] font-medium rounded bg-black/60 text-white backdrop-blur-sm"
            data-testid={`badge-type-${id}`}
          >
            {isVideoTemplate ? "Video" : "Card"}
          </span>
        </div>

        <div className="p-3 space-y-2">
          <h3 className="font-playfair text-sm lg:text-base font-semibold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground capitalize">{category}</p>
          <Button variant="default" size="sm" className="w-full text-sm" data-testid={`button-use-template-${id}`}>
            Use Template
          </Button>
        </div>
      </Link>
    </Card>
  );
}
