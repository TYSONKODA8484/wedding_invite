import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import type { Template } from "@shared/schema";
import { SEOHead } from "@/components/SEOHead";
import { TemplateCard } from "@/components/TemplateCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SlidersHorizontal, X, Loader2, Heart, Cake, ArrowLeft } from "lucide-react";
import templatesHubHero from "@assets/generated_images/Templates_hub_hero_image_bf0e94da.png";

export default function Templates() {
  const [, params] = useRoute("/templates/:category");
  const categoryFromUrl = params?.category?.toLowerCase();
  
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedOrientation, setSelectedOrientation] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const templateTypes = ["All", "Card", "Video"];
  const orientations = ["All", "Portrait", "Landscape"];

  const { data: templates = [], isLoading, error } = useQuery<Template[]>({
    queryKey: ["/api/templates", categoryFromUrl ? { category: categoryFromUrl } : {}],
    queryFn: async () => {
      const url = categoryFromUrl 
        ? `/api/templates?category=${categoryFromUrl}` 
        : "/api/templates";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch templates");
      return response.json();
    },
  });

  const filteredTemplates = templates.filter((template: any) => {
    if (selectedType && selectedType !== "All" && template.templateType !== selectedType.toLowerCase()) {
      return false;
    }
    if (selectedOrientation && selectedOrientation !== "All" && template.orientation !== selectedOrientation.toLowerCase()) {
      return false;
    }
    return true;
  });

  const activeFiltersCount = [selectedType, selectedOrientation].filter(f => f && f !== "All").length;

  const clearFilters = () => {
    setSelectedType(null);
    setSelectedOrientation(null);
  };

  const getPageTitle = () => {
    if (categoryFromUrl === "wedding") return "Wedding Invitations";
    if (categoryFromUrl === "birthday") return "Birthday Invitations";
    return "All Templates";
  };

  const getPageDescription = () => {
    if (categoryFromUrl === "wedding") return "Beautiful video invitations for your special wedding day";
    if (categoryFromUrl === "birthday") return "Fun and festive birthday video invitations";
    return "Cinematic video invitation templates designed for every culture and celebration";
  };

  const getHeroTitle = () => {
    if (categoryFromUrl === "wedding") return "Wedding Invitations";
    if (categoryFromUrl === "birthday") return "Birthday Invitations";
    return "Explore Our Templates";
  };

  const getCategoryIcon = () => {
    if (categoryFromUrl === "wedding") return <Heart className="w-8 h-8 text-pink-400" />;
    if (categoryFromUrl === "birthday") return <Cake className="w-8 h-8 text-amber-400" />;
    return null;
  };

  return (
    <>
      <SEOHead
        title={`${getPageTitle()} - Video Invitation Templates`}
        description={getPageDescription()}
        keywords={`${categoryFromUrl || 'wedding birthday'} video templates, invitation templates, video creator, wedding invitation designs, indian wedding video, arabic wedding invitation`}
      />

      <div className="relative min-h-[50vh] flex items-center justify-center overflow-hidden" data-testid="hero-templates">
        <div className="absolute inset-0 z-0">
          <img
            src={templatesHubHero}
            alt="Video Templates"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            {getCategoryIcon()}
          </div>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            {getHeroTitle()}
          </h1>
          <p className="text-white/90 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
            {getPageDescription()}
          </p>
          
          {categoryFromUrl && (
            <div className="mt-6">
              <Link href="/templates">
                <Button variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  View All Templates
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <section className="py-12 lg:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h2 className="font-playfair text-2xl lg:text-3xl font-bold text-foreground">
                {filteredTemplates.length} Template{filteredTemplates.length !== 1 ? 's' : ''}
              </h2>
              <p className="text-muted-foreground">Find the perfect template for your event</p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
              data-testid="button-toggle-filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge className="ml-1 bg-primary text-primary-foreground">{activeFiltersCount}</Badge>
              )}
            </Button>
          </div>

          {showFilters && (
            <div className="bg-card border border-card-border rounded-md p-6 mb-8" data-testid="filter-panel">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-foreground">Filter Templates</h3>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="gap-2"
                    data-testid="button-clear-filters"
                  >
                    <X className="w-4 h-4" />
                    Clear All
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">Template Type</label>
                  <div className="flex flex-wrap gap-2">
                    {templateTypes.map((type) => (
                      <Badge
                        key={type}
                        className={`cursor-pointer hover-elevate active-elevate-2 ${
                          selectedType === type || (!selectedType && type === "All")
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                        onClick={() => setSelectedType(type === "All" ? null : type)}
                        data-testid={`filter-type-${type.toLowerCase()}`}
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">Orientation</label>
                  <div className="flex flex-wrap gap-2">
                    {orientations.map((orientation) => (
                      <Badge
                        key={orientation}
                        className={`cursor-pointer hover-elevate active-elevate-2 ${
                          selectedOrientation === orientation || (!selectedOrientation && orientation === "All")
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                        onClick={() => setSelectedOrientation(orientation === "All" ? null : orientation)}
                        data-testid={`filter-orientation-${orientation.toLowerCase()}`}
                      >
                        {orientation}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-20" data-testid="loading-templates">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">Loading templates...</p>
              </div>
            </div>
          ) : error ? (
            <Card className="p-12 text-center" data-testid="error-templates">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="font-playfair text-2xl font-bold text-foreground mb-2">
                  Failed to Load Templates
                </h3>
                <p className="text-muted-foreground mb-6">
                  {error instanceof Error ? error.message : "An error occurred while loading templates"}
                </p>
                <Button onClick={() => window.location.reload()} data-testid="button-retry">
                  Try Again
                </Button>
              </div>
            </Card>
          ) : filteredTemplates.length === 0 ? (
            <Card className="p-12 text-center" data-testid="empty-templates">
              <div className="max-w-md mx-auto">
                <h3 className="font-playfair text-2xl font-bold text-foreground mb-2">
                  No Templates Found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters to see more results
                </p>
                <Button onClick={clearFilters} variant="outline" data-testid="button-clear-filters-empty">
                  Clear Filters
                </Button>
              </div>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {filteredTemplates.map((template: any) => (
                  <TemplateCard
                    key={template.id}
                    id={template.id}
                    title={template.title}
                    slug={template.slug}
                    category={template.templateType}
                    duration={template.duration}
                    thumbnailUrl={template.thumbnailUrl}
                    demoVideoUrl={template.demoVideoUrl}
                    priceInr={template.priceInr}
                    isPremium={template.isPremium}
                  />
                ))}
              </div>

              {filteredTemplates.length >= 12 && (
                <div className="text-center mt-12">
                  <Button variant="outline" size="lg" data-testid="button-load-more">
                    Load More Templates
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
