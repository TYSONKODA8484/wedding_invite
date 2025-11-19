import { Play, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";

interface TemplateCardProps {
  id: string;
  title: string;
  slug: string;
  category: string;
  duration: number;
  thumbnailUrl: string;
  isPremium?: boolean;
}

export function TemplateCard({
  id,
  title,
  slug,
  category,
  duration,
  thumbnailUrl,
  isPremium,
}: TemplateCardProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300" data-testid={`card-template-${id}`}>
      <Link href={`/template/${slug}`} className="block hover-elevate active-elevate-2">
        <div className="relative aspect-[9/16] overflow-hidden bg-muted">
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-16 h-16 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center">
              <Play className="w-8 h-8 text-primary-foreground fill-current ml-1" />
            </div>
          </div>
          {isPremium && (
            <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground font-semibold">
              Premium
            </Badge>
          )}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <Badge variant="secondary" className="bg-black/60 backdrop-blur-sm text-white border-none">
              <Clock className="w-3 h-3 mr-1" />
              {formatDuration(duration)}
            </Badge>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-playfair text-base lg:text-lg font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground capitalize mb-3">{category}</p>
          <Button variant="default" size="sm" className="w-full" data-testid={`button-use-template-${id}`}>
            Use Template
          </Button>
        </div>
      </Link>
    </Card>
  );
}
