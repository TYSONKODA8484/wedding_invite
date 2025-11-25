import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link, useLocation } from "wouter";
import type { Template } from "@shared/schema";
import { SEOHead } from "@/components/SEOHead";
import { TemplateCard } from "@/components/TemplateCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal, X, Loader2, Heart, Cake, ArrowLeft, Sparkles } from "lucide-react";
import templatesHubHero from "@assets/generated_images/Templates_hub_hero_image_bf0e94da.png";

interface FilterState {
  subcategory: string | null;
  type: string | null;
  orientation: string | null;
  photo: string | null;
  sort: string | null;
}

const WEDDING_SUBCATEGORIES = [
  { value: "save_the_date", label: "Save the Date" },
  { value: "engagement", label: "Engagement Ceremony" },
  { value: "hindu_wedding", label: "Hindu Wedding" },
  { value: "south_indian", label: "South Indian" },
  { value: "marathi", label: "Marathi" },
  { value: "rajasthani", label: "Rajasthani" },
  { value: "jain", label: "Jain" },
  { value: "punjabi", label: "Punjabi" },
  { value: "muslim", label: "Muslim" },
  { value: "christian", label: "Christian" },
  { value: "bengali", label: "Bengali" },
];

const BIRTHDAY_SUBCATEGORIES = [
  { value: "birthday_invite", label: "Birthday Invites" },
  { value: "kids_birthday", label: "Kids Birthday" },
  { value: "adult_milestone", label: "Adult Milestones" },
];

const TEMPLATE_TYPES = [
  { value: "video", label: "Video" },
  { value: "card", label: "Card" },
];

const SORT_OPTIONS = [
  { value: "popular", label: "Popular" },
  { value: "newest", label: "Newest" },
  { value: "price_low", label: "Low to High" },
  { value: "price_high", label: "High to Low" },
];

const PHOTO_OPTIONS = [
  { value: "with_photo", label: "With Photo" },
  { value: "without_photo", label: "Without Photo" },
];

const ORIENTATION_OPTIONS = [
  { value: "portrait", label: "Portrait" },
  { value: "landscape", label: "Landscape" },
];

export default function Templates() {
  const [, params] = useRoute("/templates/:category");
  const categoryFromUrl = params?.category?.toLowerCase();
  const [location, setLocation] = useLocation();
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    subcategory: null,
    type: null,
    orientation: null,
    photo: null,
    sort: null,
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setFilters({
      subcategory: urlParams.get("subcategory"),
      type: urlParams.get("type"),
      orientation: urlParams.get("orientation"),
      photo: urlParams.get("photo"),
      sort: urlParams.get("sort"),
    });
  }, [location]);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    const basePath = categoryFromUrl ? `/templates/${categoryFromUrl}` : "/templates";
    const queryString = params.toString();
    setLocation(queryString ? `${basePath}?${queryString}` : basePath, { replace: true });
  };

  const clearAllFilters = () => {
    setFilters({
      subcategory: null,
      type: null,
      orientation: null,
      photo: null,
      sort: null,
    });
    const basePath = categoryFromUrl ? `/templates/${categoryFromUrl}` : "/templates";
    setLocation(basePath, { replace: true });
  };

  const buildApiUrl = () => {
    const params = new URLSearchParams();
    if (categoryFromUrl) params.set("category", categoryFromUrl);
    if (filters.subcategory) params.set("subcategory", filters.subcategory);
    if (filters.type) params.set("type", filters.type);
    if (filters.orientation) params.set("orientation", filters.orientation);
    if (filters.photo) params.set("photo", filters.photo);
    if (filters.sort) params.set("sort", filters.sort);
    const queryString = params.toString();
    return queryString ? `/api/templates?${queryString}` : "/api/templates";
  };

  const { data: templates = [], isLoading, error } = useQuery<Template[]>({
    queryKey: ["/api/templates", categoryFromUrl, filters],
    queryFn: async () => {
      const response = await fetch(buildApiUrl());
      if (!response.ok) throw new Error("Failed to fetch templates");
      return response.json();
    },
  });

  const subcategories = useMemo(() => {
    if (categoryFromUrl === "wedding") return WEDDING_SUBCATEGORIES;
    if (categoryFromUrl === "birthday") return BIRTHDAY_SUBCATEGORIES;
    return [];
  }, [categoryFromUrl]);

  const activeFiltersCount = [
    filters.type,
    filters.orientation,
    filters.photo,
    filters.sort,
  ].filter(Boolean).length;

  const getPageTitle = () => {
    if (categoryFromUrl === "wedding") return "Wedding Invitations";
    if (categoryFromUrl === "birthday") return "Birthday Invitations";
    return "All Templates";
  };

  const getPageDescription = () => {
    if (categoryFromUrl === "wedding") {
      return "Create stunning digital wedding invitations with our easy-to-use templates. Personalize with your own photos, text, and music. Let's make your wedding special together!";
    }
    if (categoryFromUrl === "birthday") {
      return "Design fun and festive digital birthday invitations with our easy-to-use templates. Personalize with photos, text, and music to make your celebration unforgettable.";
    }
    return "Cinematic video invitation templates designed for every culture and celebration";
  };

  const getHeroTitle = () => {
    if (categoryFromUrl === "wedding") return "WEDDING INVITATIONS";
    if (categoryFromUrl === "birthday") return "BIRTHDAY INVITATIONS";
    return "Explore Our Templates";
  };

  const getHeroSubtitle = () => {
    if (categoryFromUrl === "wedding") return "Sacred, vibrant & deeply traditional";
    if (categoryFromUrl === "birthday") return "Fun, colorful & celebratory";
    return "";
  };

  const getCategoryIcon = () => {
    if (categoryFromUrl === "wedding") return <Heart className="w-6 h-6 text-pink-400" />;
    if (categoryFromUrl === "birthday") return <Cake className="w-6 h-6 text-amber-400" />;
    return <Sparkles className="w-6 h-6 text-primary" />;
  };

  const FilterChip = ({ 
    label, 
    isSelected, 
    onClick 
  }: { 
    label: string; 
    isSelected: boolean; 
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all border whitespace-nowrap ${
        isSelected
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-background text-foreground border-border hover:border-primary/50 hover:bg-accent/50"
      }`}
      data-testid={`filter-chip-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {label}
    </button>
  );

  const FilterSection = ({ 
    title, 
    options, 
    selectedValue, 
    onSelect 
  }: { 
    title: string;
    options: { value: string; label: string }[];
    selectedValue: string | null;
    onSelect: (value: string | null) => void;
  }) => (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-foreground">{title}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(selectedValue === option.value ? null : option.value)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all border ${
              selectedValue === option.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border hover:border-primary/50"
            }`}
            data-testid={`filter-${title.toLowerCase().replace(/\s+/g, "-")}-${option.value}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <SEOHead
        title={`${getPageTitle()} - Video Invitation Templates`}
        description={getPageDescription()}
        keywords={`${categoryFromUrl || 'wedding birthday'} video templates, invitation templates, video creator, wedding invitation designs, indian wedding video, arabic wedding invitation`}
      />

      <div className="relative min-h-[40vh] flex items-center justify-center overflow-hidden" data-testid="hero-templates">
        <div className="absolute inset-0 z-0">
          <img
            src={templatesHubHero}
            alt="Video Templates"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 text-center">
          <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight tracking-wide">
            {getHeroTitle()}
          </h1>
          {getHeroSubtitle() && (
            <p className="text-white/80 text-base lg:text-lg font-medium mb-4">
              {getHeroSubtitle()}
            </p>
          )}
          <p className="text-white/70 text-sm lg:text-base max-w-2xl mx-auto leading-relaxed">
            {getPageDescription()}
          </p>
          
          {categoryFromUrl && (
            <button 
              className="mt-4 text-primary/90 hover:text-primary text-sm font-medium hover:underline"
              onClick={() => {}}
            >
              Show More
            </button>
          )}
        </div>
      </div>

      <section className="py-6 lg:py-10 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <div className="flex items-center gap-2 text-muted-foreground">
              {getCategoryIcon()}
              <span className="font-medium">{templates.length} designs</span>
            </div>

            {subcategories.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2 flex-1 scrollbar-hide">
                {subcategories.map((sub) => (
                  <FilterChip
                    key={sub.value}
                    label={sub.label}
                    isSelected={filters.subcategory === sub.value}
                    onClick={() => updateFilters({ 
                      subcategory: filters.subcategory === sub.value ? null : sub.value 
                    })}
                  />
                ))}
              </div>
            )}

            <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 ml-auto flex-shrink-0"
                  data-testid="button-open-filters"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge className="ml-1 bg-primary text-primary-foreground h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetHeader className="text-left mb-6">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="flex items-center gap-2">
                      <SlidersHorizontal className="w-5 h-5" />
                      Filters
                    </SheetTitle>
                  </div>
                </SheetHeader>

                <div className="space-y-6">
                  <FilterSection
                    title="Type"
                    options={TEMPLATE_TYPES}
                    selectedValue={filters.type}
                    onSelect={(value) => updateFilters({ type: value })}
                  />

                  <FilterSection
                    title="Sort by"
                    options={SORT_OPTIONS}
                    selectedValue={filters.sort}
                    onSelect={(value) => updateFilters({ sort: value })}
                  />

                  <FilterSection
                    title="Photo"
                    options={PHOTO_OPTIONS}
                    selectedValue={filters.photo}
                    onSelect={(value) => updateFilters({ photo: value })}
                  />

                  <FilterSection
                    title="Card Orientation"
                    options={ORIENTATION_OPTIONS}
                    selectedValue={filters.orientation}
                    onSelect={(value) => updateFilters({ orientation: value })}
                  />
                </div>

                <div className="flex gap-3 mt-8 pt-6 border-t">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={clearAllFilters}
                    data-testid="button-clear-all-filters"
                  >
                    Clear All
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => setIsFilterSheetOpen(false)}
                    data-testid="button-apply-filters"
                  >
                    Apply
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {(filters.subcategory || activeFiltersCount > 0) && (
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {filters.subcategory && (
                <Badge variant="secondary" className="gap-1">
                  {subcategories.find(s => s.value === filters.subcategory)?.label || filters.subcategory}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => updateFilters({ subcategory: null })}
                  />
                </Badge>
              )}
              {filters.type && (
                <Badge variant="secondary" className="gap-1">
                  {TEMPLATE_TYPES.find(t => t.value === filters.type)?.label}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => updateFilters({ type: null })}
                  />
                </Badge>
              )}
              {filters.orientation && (
                <Badge variant="secondary" className="gap-1">
                  {ORIENTATION_OPTIONS.find(o => o.value === filters.orientation)?.label}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => updateFilters({ orientation: null })}
                  />
                </Badge>
              )}
              {filters.photo && (
                <Badge variant="secondary" className="gap-1">
                  {PHOTO_OPTIONS.find(p => p.value === filters.photo)?.label}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => updateFilters({ photo: null })}
                  />
                </Badge>
              )}
              {filters.sort && (
                <Badge variant="secondary" className="gap-1">
                  Sort: {SORT_OPTIONS.find(s => s.value === filters.sort)?.label}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => updateFilters({ sort: null })}
                  />
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-primary hover:text-primary/80 h-auto py-1"
                data-testid="button-clear-filters-inline"
              >
                Clear all
              </Button>
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
                <Button onClick={clearAllFilters} variant="outline" data-testid="button-clear-filters-empty">
                  Clear Filters
                </Button>
              </div>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
                {templates.map((template: any) => (
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

              {templates.length >= 20 && (
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
