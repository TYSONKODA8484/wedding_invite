import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Template } from "@shared/schema";
import { SEOHead } from "@/components/SEOHead";
import { TemplateCard } from "@/components/TemplateCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SlidersHorizontal, X, Loader2 } from "lucide-react";
import templatesHubHero from "@assets/generated_images/Templates_hub_hero_image_bf0e94da.png";

export default function Templates() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCulture, setSelectedCulture] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const categories = ["All", "Wedding", "Engagement", "Reception"];
  const cultures = ["All", "Indian", "Arabic", "Modern"];
  const styles = ["All", "Cinematic", "Modern", "Traditional"];

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== "All") {
      params.append("category", selectedCategory.toLowerCase());
    }
    if (selectedCulture && selectedCulture !== "All") {
      // Map UI culture names to database culture prefixes
      const cultureMap: Record<string, string> = {
        "Indian": "indian",
        "Arabic": "arabic",
        "Modern": "modern"
      };
      params.append("culture", cultureMap[selectedCulture] || selectedCulture.toLowerCase());
    }
    if (selectedStyle && selectedStyle !== "All") {
      params.append("style", selectedStyle.toLowerCase());
    }
    return params.toString();
  };

  const { data: templates = [], isLoading, error } = useQuery<Template[]>({
    queryKey: ["/api/templates", selectedCategory, selectedCulture, selectedStyle],
    queryFn: async () => {
      const queryString = buildQueryParams();
      const url = `/api/templates${queryString ? `?${queryString}` : ""}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch templates");
      }
      return response.json();
    },
  });

  const activeFiltersCount = [selectedCategory, selectedCulture, selectedStyle].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedCulture(null);
    setSelectedStyle(null);
  };

  return (
    <>
      <SEOHead
        title="Video Invitation Templates - 500+ Cinematic Designs"
        description="Browse our collection of 500+ premium video invitation templates for weddings, engagements, and special events. Customizable, culturally accurate, and ready to share."
        keywords="wedding video templates, invitation templates, video creator, wedding invitation designs"
      />

      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden" data-testid="hero-templates">
        <div className="absolute inset-0 z-0">
          <img
            src={templatesHubHero}
            alt="Video Templates"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 text-center">
          <h1 className="font-playfair text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Explore Our Templates
          </h1>
          <p className="text-white/90 text-lg lg:text-xl max-w-3xl mx-auto mb-8 leading-relaxed">
            500+ cinematic video invitation templates designed for every culture and celebration
          </p>
        </div>
      </div>

      <section className="py-12 lg:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h2 className="font-playfair text-2xl lg:text-3xl font-bold text-foreground">
                {templates.length} Templates
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
                  <label className="text-sm font-medium text-foreground mb-3 block">Event Type</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Badge
                        key={category}
                        className={`cursor-pointer hover-elevate active-elevate-2 ${
                          selectedCategory === category || (!selectedCategory && category === "All")
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                        onClick={() => setSelectedCategory(category === "All" ? null : category)}
                        data-testid={`filter-category-${category.toLowerCase()}`}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">Culture</label>
                  <div className="flex flex-wrap gap-2">
                    {cultures.map((culture) => (
                      <Badge
                        key={culture}
                        className={`cursor-pointer hover-elevate active-elevate-2 ${
                          selectedCulture === culture || (!selectedCulture && culture === "All")
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                        onClick={() => setSelectedCulture(culture === "All" ? null : culture)}
                        data-testid={`filter-culture-${culture.toLowerCase()}`}
                      >
                        {culture}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">Style</label>
                  <div className="flex flex-wrap gap-2">
                    {styles.map((style) => (
                      <Badge
                        key={style}
                        className={`cursor-pointer hover-elevate active-elevate-2 ${
                          selectedStyle === style || (!selectedStyle && style === "All")
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                        onClick={() => setSelectedStyle(style === "All" ? null : style)}
                        data-testid={`filter-style-${style.toLowerCase()}`}
                      >
                        {style}
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
          ) : templates.length === 0 ? (
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
                {templates.map((template) => (
                  <TemplateCard key={template.id} {...template} />
                ))}
              </div>

              {templates.length >= 12 && (
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
