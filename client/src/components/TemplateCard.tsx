import { useState, useRef, useEffect } from "react";
import { Play, Layers, Clock, Volume2, VolumeX } from "lucide-react";
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
  pageCount?: number;
  price?: number;
}

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "0:30";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatPrice(paise: number): string {
  if (!paise || paise <= 0) return "Free";
  const rupees = paise / 100;
  return `₹${rupees.toLocaleString('en-IN')}`;
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
  pageCount = 1,
  price = 0,
}: TemplateCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isTapped, setIsTapped] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const isVideoTemplate = templateType === "video";
  const isCardTemplate = templateType === "card";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "100px",
        threshold: 0.01,
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (isVideoTemplate && demoVideoUrl && videoRef.current && isInView) {
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

  // Mobile tap-to-preview
  const handleTouchStart = () => {
    if (isVideoTemplate && demoVideoUrl && videoRef.current && isInView && !isTapped) {
      setIsTapped(true);
      setShowVideo(true);
      videoRef.current.play().catch(() => {});
    }
  };

  const handleTouchEnd = () => {
    // Keep video playing on mobile until they navigate away
  };

  return (
    <Card 
      ref={cardRef} 
      className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-card rounded-xl" 
      data-testid={`card-template-${id}`}
    >
      <Link href={`/template/${slug}`} className="block">
        <div 
          className="relative aspect-[9/16] overflow-hidden bg-muted"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Loading skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-b from-muted to-muted/80">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" 
                   style={{ backgroundSize: '200% 100%' }} />
            </div>
          )}
          
          {isCardTemplate ? (
            <>
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="relative w-full h-full">
                  {pageCount > 1 && (
                    <>
                      <div 
                        className="absolute inset-0 bg-card rounded-lg shadow-md transform rotate-3 translate-x-2 -translate-y-1 opacity-60"
                        style={{ zIndex: 1 }}
                      />
                      <div 
                        className="absolute inset-0 bg-card rounded-lg shadow-md transform -rotate-2 -translate-x-1 translate-y-1 opacity-80"
                        style={{ zIndex: 2 }}
                      />
                    </>
                  )}
                  <div 
                    className="relative w-full h-full rounded-lg overflow-hidden shadow-xl border border-border/50 transition-transform duration-500 group-hover:scale-[1.02]"
                    style={{ zIndex: 3 }}
                  >
                    {isInView && (
                      <img
                        src={thumbnailUrl}
                        alt={title}
                        className={`w-full h-full object-cover transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        loading="lazy"
                        decoding="async"
                        onLoad={() => setImageLoaded(true)}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {isInView && (
                <img
                  src={thumbnailUrl}
                  alt={title}
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    showVideo && demoVideoUrl ? 'opacity-0 scale-100' : imageLoaded ? 'opacity-100 group-hover:scale-105' : 'opacity-0'
                  }`}
                  loading="lazy"
                  decoding="async"
                  onLoad={() => setImageLoaded(true)}
                />
              )}
              
              {isInView && demoVideoUrl && (
                <video
                  ref={videoRef}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                    showVideo ? 'opacity-100' : 'opacity-0'
                  }`}
                  muted
                  loop
                  playsInline
                  preload="none"
                  poster={thumbnailUrl}
                  data-testid={`video-preview-${id}`}
                >
                  <source src={demoVideoUrl} type="video/mp4" />
                </video>
              )}
              
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 ${
                showVideo ? 'opacity-30' : 'opacity-100'
              }`} />
              
              {/* Play button - visible on hover when video not playing */}
              {!showVideo && demoVideoUrl && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-14 h-14 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-primary fill-primary ml-1" />
                  </div>
                </div>
              )}

              {/* Tap to preview hint (mobile) */}
              {!showVideo && demoVideoUrl && (
                <div className="absolute inset-0 flex items-center justify-center md:hidden">
                  <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 text-primary fill-primary ml-0.5" />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Price badge - top right */}
          <div 
            className="absolute top-3 right-3"
            style={{ zIndex: 10 }}
          >
            <span 
              className="px-3 py-1.5 text-xs font-bold rounded-full bg-primary text-primary-foreground shadow-lg"
              data-testid={`text-price-${id}`}
            >
              {formatPrice(price)}
            </span>
          </div>

          {/* Premium badge */}
          {isPremium && (
            <div 
              className="absolute top-3 left-3"
              style={{ zIndex: 10 }}
            >
              <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg uppercase tracking-wide">
                Premium
              </span>
            </div>
          )}

          {/* Bottom badges - duration/pages and type */}
          <div 
            className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2"
            style={{ zIndex: 10 }}
          >
            <div className="flex items-center gap-2">
              {isVideoTemplate && duration > 0 && (
                <span 
                  className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full bg-black/60 text-white backdrop-blur-sm"
                  data-testid={`badge-duration-${id}`}
                >
                  <Clock className="w-3 h-3" />
                  {formatDuration(duration)}
                </span>
              )}
              {isCardTemplate && pageCount > 1 && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full bg-black/60 text-white backdrop-blur-sm">
                  <Layers className="w-3 h-3" />
                  {pageCount} pages
                </span>
              )}
            </div>
            <span 
              className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-black/60 text-white backdrop-blur-sm"
              data-testid={`badge-type-${id}`}
            >
              {isVideoTemplate ? "Video" : "Card"}
            </span>
          </div>
        </div>

        {/* Card content */}
        <div className="p-4 space-y-3">
          <h3 className="font-playfair text-base lg:text-lg font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {title}
          </h3>
          <Button 
            className="w-full font-medium" 
            data-testid={`button-use-template-${id}`}
          >
            Use This Template
          </Button>
        </div>
      </Link>
    </Card>
  );
}
