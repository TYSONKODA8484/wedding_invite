import { useState, useEffect, useRef } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  aspectRatio?: "16/9" | "4/3" | "1/1" | "3/4" | "auto";
  objectFit?: "cover" | "contain" | "fill";
  onLoad?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  className = "",
  priority = false,
  aspectRatio = "auto",
  objectFit = "cover",
  onLoad,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

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
        rootMargin: "200px",
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const aspectStyles = aspectRatio !== "auto" ? { aspectRatio } : {};

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={aspectStyles}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br from-muted/50 to-muted transition-opacity duration-500 ${
          isLoaded ? "opacity-0" : "opacity-100"
        }`}
      />
      
      {isInView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={handleLoad}
          className={`w-full h-full transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          style={{ objectFit }}
        />
      )}
    </div>
  );
}

interface HeroImageProps {
  src: string;
  alt: string;
  children?: React.ReactNode;
  overlayClassName?: string;
  minHeight?: string;
  priority?: boolean;
}

export function HeroImage({
  src,
  alt,
  children,
  overlayClassName = "bg-gradient-to-b from-black/70 via-black/50 to-black/80",
  minHeight = "60vh",
  priority = true,
}: HeroImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className="relative flex items-center justify-center overflow-hidden"
      style={{ minHeight }}
    >
      <div className="absolute inset-0 z-0">
        <div
          className={`absolute inset-0 bg-muted transition-opacity duration-700 ${
            isLoaded ? "opacity-0" : "opacity-100"
          }`}
        />
        
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-700 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
        
        <div className={`absolute inset-0 ${overlayClassName}`} />
      </div>
      
      {children}
    </div>
  );
}

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
}

export function LazyImage({
  src,
  alt,
  className = "",
  wrapperClassName = "",
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`relative ${wrapperClassName}`}>
      <div
        className={`absolute inset-0 bg-muted animate-pulse transition-opacity duration-300 ${
          isLoaded ? "opacity-0" : "opacity-100"
        }`}
      />
      
      {isInView && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={`transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          } ${className}`}
        />
      )}
    </div>
  );
}
