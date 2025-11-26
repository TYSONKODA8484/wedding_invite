import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import type { Template } from "@shared/schema";
import { SEOHead } from "@/components/SEOHead";
import { TemplateCard } from "@/components/TemplateCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SlidersHorizontal, X, Loader2, Sparkles } from "lucide-react";
import templatesHubHero from "@assets/generated_images/Templates_hub_hero_image_bf0e94da.png";

interface PaginatedResponse {
  templates: Template[];
  pagination: {
    total: number;
    offset: number;
    limit: number;
    hasMore: boolean;
  };
}

const TEMPLATES_PER_PAGE = 25;

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
  { value: "with_photo", label: "WithPhoto" },
  { value: "without_photo", label: "WithoutPhoto" },
];

const ORIENTATION_OPTIONS = [
  { value: "portrait", label: "Portrait" },
  { value: "landscape", label: "Landscape" },
];

export default function Templates() {
  const [, params] = useRoute("/templates/:category");
  const categoryFromUrl = params?.category?.toLowerCase();
  const [location, setLocation] = useLocation();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  const buildApiUrl = (offset: number = 0) => {
    const params = new URLSearchParams();
    if (categoryFromUrl) params.set("category", categoryFromUrl);
    if (filters.subcategory) params.set("subcategory", filters.subcategory);
    if (filters.type) params.set("type", filters.type);
    if (filters.orientation) params.set("orientation", filters.orientation);
    if (filters.photo) params.set("photo", filters.photo);
    if (filters.sort) params.set("sort", filters.sort);
    params.set("offset", offset.toString());
    params.set("limit", TEMPLATES_PER_PAGE.toString());
    return `/api/templates?${params.toString()}`;
  };

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<PaginatedResponse>({
    queryKey: ["/api/templates", categoryFromUrl, filters],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await fetch(buildApiUrl(pageParam as number));
      if (!response.ok) throw new Error("Failed to fetch templates");
      return response.json();
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasMore) {
        return lastPage.pagination.offset + lastPage.pagination.limit;
      }
      return undefined;
    },
    initialPageParam: 0,
  });

  const templates = useMemo(() => {
    return data?.pages.flatMap((page) => page.templates) || [];
  }, [data]);

  const totalCount = data?.pages[0]?.pagination.total || 0;

  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "200px",
      threshold: 0,
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver]);

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
      className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all border whitespace-nowrap ${
        isSelected
          ? "bg-primary text-primary-foreground border-primary shadow-sm"
          : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-accent/30"
      }`}
      data-testid={`filter-chip-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {label}
    </button>
  );

  const FilterOption = ({ 
    label, 
    isSelected, 
    onClick,
    testId
  }: { 
    label: string; 
    isSelected: boolean; 
    onClick: () => void;
    testId: string;
  }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
        isSelected
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-background text-foreground border-border hover:border-primary/40"
      }`}
      data-testid={testId}
    >
      {label}
    </button>
  );

  return (
    <>
      <SEOHead
        title={`${getPageTitle()} - Video Invitation Templates`}
        description={getPageDescription()}
        keywords={`${categoryFromUrl || 'wedding birthday'} video templates, invitation templates, video creator, wedding invitation designs, indian wedding video, arabic wedding invitation`}
      />

      <div className="relative min-h-[35vh] flex items-center justify-center overflow-hidden" data-testid="hero-templates">
        <div className="absolute inset-0 z-0">
          <img
            src={templatesHubHero}
            alt="Video Templates"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 text-center">
          <h1 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight tracking-wide">
            {getHeroTitle()}
          </h1>
          {getHeroSubtitle() && (
            <p className="text-white/80 text-sm lg:text-base font-medium mb-3">
              {getHeroSubtitle()}
            </p>
          )}
          <p className="text-white/70 text-xs lg:text-sm max-w-xl mx-auto leading-relaxed">
            {getPageDescription()}
          </p>
        </div>
      </div>

      <section className="py-6 lg:py-8 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-start gap-3 mb-4">
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-card hover:bg-accent/50 border border-border text-foreground font-medium text-sm transition-all"
                data-testid="button-open-filters"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              
              {isFilterOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsFilterOpen(false)}
                  />
                  <div className="absolute left-0 top-full mt-2 w-72 p-4 rounded-xl border bg-card shadow-lg z-50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                      </div>
                      <button 
                        onClick={() => setIsFilterOpen(false)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Type</label>
                        <div className="flex flex-wrap gap-2">
                          {TEMPLATE_TYPES.map((option) => (
                            <FilterOption
                              key={option.value}
                              label={option.label}
                              isSelected={filters.type === option.value}
                              onClick={() => updateFilters({ type: filters.type === option.value ? null : option.value })}
                              testId={`filter-type-${option.value}`}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Sort by</label>
                        <div className="flex flex-wrap gap-2">
                          {SORT_OPTIONS.map((option) => (
                            <FilterOption
                              key={option.value}
                              label={option.label}
                              isSelected={filters.sort === option.value}
                              onClick={() => updateFilters({ sort: filters.sort === option.value ? null : option.value })}
                              testId={`filter-sort-by-${option.value}`}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Photo</label>
                        <div className="flex flex-wrap gap-2">
                          {PHOTO_OPTIONS.map((option) => (
                            <FilterOption
                              key={option.value}
                              label={option.label}
                              isSelected={filters.photo === option.value}
                              onClick={() => updateFilters({ photo: filters.photo === option.value ? null : option.value })}
                              testId={`filter-photo-${option.value}`}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Card Orientation</label>
                        <div className="flex flex-wrap gap-2">
                          {ORIENTATION_OPTIONS.map((option) => (
                            <FilterOption
                              key={option.value}
                              label={option.label}
                              isSelected={filters.orientation === option.value}
                              onClick={() => updateFilters({ orientation: filters.orientation === option.value ? null : option.value })}
                              testId={`filter-card-orientation-${option.value}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-5 pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-full"
                        onClick={clearAllFilters}
                        data-testid="button-clear-all-filters"
                      >
                        Clear All
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 rounded-full"
                        onClick={() => setIsFilterOpen(false)}
                        data-testid="button-apply-filters"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {subcategories.length > 0 && (
              <div className="flex flex-wrap gap-2 flex-1">
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

            <div className="flex items-center gap-2 text-muted-foreground flex-shrink-0">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                {totalCount > 0 ? `${totalCount} designs` : "Loading..."}
              </span>
            </div>
          </div>

          {(filters.subcategory || activeFiltersCount > 0) && (
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="text-xs text-muted-foreground">Active:</span>
              {filters.subcategory && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  {subcategories.find(s => s.value === filters.subcategory)?.label || filters.subcategory}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-destructive" 
                    onClick={() => updateFilters({ subcategory: null })}
                  />
                </Badge>
              )}
              {filters.type && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  {TEMPLATE_TYPES.find(t => t.value === filters.type)?.label}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-destructive" 
                    onClick={() => updateFilters({ type: null })}
                  />
                </Badge>
              )}
              {filters.orientation && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  {ORIENTATION_OPTIONS.find(o => o.value === filters.orientation)?.label}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-destructive" 
                    onClick={() => updateFilters({ orientation: null })}
                  />
                </Badge>
              )}
              {filters.photo && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  {PHOTO_OPTIONS.find(p => p.value === filters.photo)?.label}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-destructive" 
                    onClick={() => updateFilters({ photo: null })}
                  />
                </Badge>
              )}
              {filters.sort && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  {SORT_OPTIONS.find(s => s.value === filters.sort)?.label}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-destructive" 
                    onClick={() => updateFilters({ sort: null })}
                  />
                </Badge>
              )}
              <button
                onClick={clearAllFilters}
                className="text-xs text-primary hover:text-primary/80 font-medium hover:underline"
                data-testid="button-clear-filters-inline"
              >
                Clear all
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-20" data-testid="loading-templates">
              <div className="text-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading templates...</p>
              </div>
            </div>
          ) : error ? (
            <Card className="p-10 text-center" data-testid="error-templates">
              <div className="max-w-md mx-auto">
                <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                  <X className="w-7 h-7 text-destructive" />
                </div>
                <h3 className="font-playfair text-xl font-bold text-foreground mb-2">
                  Failed to Load Templates
                </h3>
                <p className="text-muted-foreground text-sm mb-5">
                  {error instanceof Error ? error.message : "An error occurred while loading templates"}
                </p>
                <Button onClick={() => window.location.reload()} data-testid="button-retry">
                  Try Again
                </Button>
              </div>
            </Card>
          ) : templates.length === 0 ? (
            <Card className="p-10 text-center" data-testid="empty-templates">
              <div className="max-w-md mx-auto">
                <h3 className="font-playfair text-xl font-bold text-foreground mb-2">
                  No Templates Found
                </h3>
                <p className="text-muted-foreground text-sm mb-5">
                  Try adjusting your filters to see more results
                </p>
                <Button onClick={clearAllFilters} variant="outline" data-testid="button-clear-filters-empty">
                  Clear Filters
                </Button>
              </div>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-5">
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
                
                {isFetchingNextPage && (
                  <>
                    {[...Array(5)].map((_, i) => (
                      <div key={`skeleton-${i}`} className="space-y-2">
                        <Skeleton className="aspect-[3/4] w-full rounded-lg" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    ))}
                  </>
                )}
              </div>

              <div 
                ref={loadMoreRef} 
                className="h-10 flex items-center justify-center mt-6"
                data-testid="infinite-scroll-trigger"
              >
                {isFetchingNextPage && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">Loading more...</span>
                  </div>
                )}
                {!hasNextPage && templates.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    You've seen all {totalCount} templates
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
