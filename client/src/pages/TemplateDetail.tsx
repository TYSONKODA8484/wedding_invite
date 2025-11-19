import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef } from "react";
import type { Template, TemplatePage } from "@shared/schema";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Clock, Play, Pause, Volume2, VolumeX, Maximize, ArrowRight, Loader2, X } from "lucide-react";

export default function TemplateDetail() {
  const [, params] = useRoute("/template/:slug");
  const [, navigate] = useLocation();
  const slug = params?.slug;

  // All hooks must be declared before any conditional returns
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const { data: template, isLoading, error } = useQuery<Template>({
    queryKey: ["/api/templates", slug],
    queryFn: async () => {
      const response = await fetch(`/api/templates/${slug}`);
      if (!response.ok) throw new Error("Failed to fetch template");
      return response.json();
    },
    enabled: !!slug,
  });

  const { data: pages = [] } = useQuery<TemplatePage[]>({
    queryKey: ["/api/templates", template?.id, "pages"],
    queryFn: async () => {
      const response = await fetch(`/api/templates/${slug}/pages`);
      if (!response.ok) throw new Error("Failed to fetch pages");
      return response.json();
    },
    enabled: !!template?.id && !!slug,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" data-testid="loading-template">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Loading template...</p>
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4" data-testid="error-template">
        <Card className="p-12 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-destructive" />
          </div>
          <h3 className="font-playfair text-2xl font-bold text-foreground mb-2">
            Template Not Found
          </h3>
          <p className="text-muted-foreground mb-6">
            The template you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/templates")} data-testid="button-back-to-templates">
            Browse All Templates
          </Button>
        </Card>
      </div>
    );
  }

  const formatPrice = (paise: number) => {
    const rupees = Math.floor(paise / 100);
    return `₹${rupees.toLocaleString('en-IN')}`;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };


  return (
    <>
      <SEOHead
        title={`${template.title} - Video Invitation Template`}
        description={template.description}
        keywords={`${template.category} video invitation, ${template.style} template, wedding video creator`}
        schema={{
          "@context": "https://schema.org",
          "@type": "VideoObject",
          "name": template.title,
          "description": template.description,
          "thumbnailUrl": template.thumbnailUrl,
          "uploadDate": "2024-01-01",
          "duration": `PT${template.duration}S`,
        }}
      />

      <div 
        className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-black group" 
        data-testid="template-preview"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {!videoError ? (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-contain max-h-[70vh]"
              poster={template.thumbnailUrl}
              muted={isMuted}
              loop
              playsInline
              onError={() => setVideoError(true)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              data-testid="video-demo"
            >
              <source src={template.demoVideoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {!isPlaying && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20">
                <Button
                  size="lg"
                  onClick={togglePlay}
                  className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-primary/90 backdrop-blur-sm hover:bg-primary shadow-2xl transition-transform hover:scale-110"
                  data-testid="button-play-video"
                >
                  <Play className="w-10 h-10 lg:w-12 lg:h-12 text-primary-foreground fill-current ml-1" />
                </Button>
              </div>
            )}

            {isPlaying && (showControls || true) && (
              <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity">
                <div className="flex items-center gap-3 max-w-7xl mx-auto">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={togglePlay}
                    className="text-white hover:bg-white/20"
                    data-testid="button-pause-video"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20"
                    data-testid="button-mute-video"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </Button>
                  <div className="flex-1" />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleFullscreen}
                    className="text-white hover:bg-white/20"
                    data-testid="button-fullscreen-video"
                  >
                    <Maximize className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <img
              src={template.thumbnailUrl}
              alt={template.title}
              className="w-full h-full object-contain"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="text-center text-white">
                <Play className="w-16 h-16 mx-auto mb-2 opacity-60" />
                <p className="text-sm">Demo video preview unavailable</p>
              </div>
            </div>
          </div>
        )}

        {template.isPremium && (
          <Badge className="absolute top-6 right-6 z-30 bg-accent text-accent-foreground font-semibold text-base px-4 py-2">
            Premium
          </Badge>
        )}
      </div>

      <section className="py-12 lg:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-playfair text-4xl lg:text-5xl font-bold text-foreground mb-4" data-testid="text-template-title">
              {template.title}
            </h1>
            <div className="flex flex-wrap gap-3 mb-4">
              <Badge variant="secondary" className="text-sm capitalize">{template.category}</Badge>
              <Badge variant="secondary" className="text-sm capitalize">{template.culture.replace(/-/g, ' ')}</Badge>
              <Badge variant="secondary" className="text-sm capitalize">{template.style}</Badge>
              <Badge variant="secondary" className="text-sm">
                <Clock className="w-4 h-4 mr-1" />
                {formatDuration(template.duration)}
              </Badge>
              <Badge variant="secondary" className="text-sm">{template.pageCount} Pages</Badge>
            </div>
            <div className="mb-6">
              <p className="text-3xl font-bold text-primary" data-testid="text-template-price">
                {formatPrice(template.priceInr)}
              </p>
            </div>
            <p className="text-muted-foreground text-lg lg:text-xl mb-8 leading-relaxed">
              {template.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button
                variant="default"
                size="lg"
                className="flex-1 text-base font-semibold h-14"
                onClick={() => navigate(`/editor/${template.slug}`)}
                data-testid="button-customize-template"
              >
                Customize This Template
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {pages.length > 0 && (
              <Card className="p-8 lg:p-10 mb-12">
                <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-foreground mb-8">
                  Template Pages ({pages.length})
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {pages.map((page, index) => (
                    <div key={page.id} className="group" data-testid={`page-preview-${index}`}>
                      <div className="relative aspect-[9/16] overflow-hidden rounded-md bg-muted mb-2">
                        <img
                          src={page.thumbnailUrl}
                          alt={page.pageName}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-2 left-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-xs font-semibold">Page {page.pageNumber}</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-foreground text-center line-clamp-1">{page.pageName}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

        </div>
      </section>
    </>
  );
}
