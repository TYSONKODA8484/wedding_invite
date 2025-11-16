import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description: string;
  backgroundImage: string;
  primaryCTA?: {
    text: string;
    href: string;
  };
  secondaryCTA?: {
    text: string;
    href: string;
  };
  height?: "full" | "large" | "medium";
}

export function HeroSection({
  title,
  subtitle,
  description,
  backgroundImage,
  primaryCTA,
  secondaryCTA,
  height = "medium",
}: HeroSectionProps) {
  const heightClass = {
    full: "min-h-screen",
    large: "min-h-[80vh]",
    medium: "min-h-[60vh]",
  }[height];

  return (
    <div className={`relative ${heightClass} flex items-center justify-center overflow-hidden`} data-testid="hero-section">
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 text-center">
        {subtitle && (
          <p className="text-white/90 text-base lg:text-lg font-medium mb-4 tracking-wide uppercase" data-testid="text-hero-subtitle">
            {subtitle}
          </p>
        )}
        <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight" data-testid="text-hero-title">
          {title}
        </h1>
        <p className="text-white/90 text-lg lg:text-xl max-w-3xl mx-auto mb-8 lg:mb-12 leading-relaxed" data-testid="text-hero-description">
          {description}
        </p>

        {(primaryCTA || secondaryCTA) && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {primaryCTA && (
              <Button
                variant="default"
                size="lg"
                className="min-w-[200px] text-base font-semibold shadow-xl hover:shadow-2xl transition-all"
                asChild
                data-testid="button-hero-primary"
              >
                <Link href={primaryCTA.href}>
                  <a className="flex items-center gap-2">
                    {primaryCTA.text}
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </Link>
              </Button>
            )}
            {secondaryCTA && (
              <Button
                variant="outline"
                size="lg"
                className="min-w-[200px] text-base font-semibold bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
                asChild
                data-testid="button-hero-secondary"
              >
                <Link href={secondaryCTA.href}>
                  <a>{secondaryCTA.text}</a>
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
