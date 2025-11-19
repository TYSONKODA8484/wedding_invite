import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  name: string;
  slug: string;
  description: string;
  heroImageUrl: string;
  templateCount: number;
  icon?: React.ReactNode;
}

export function CategoryCard({
  name,
  slug,
  description,
  heroImageUrl,
  templateCount,
  icon,
}: CategoryCardProps) {
  return (
    <Card className="group overflow-hidden transition-all duration-300" data-testid={`card-category-${slug}`}>
      <Link href={`/categories/${slug}`} className="block hover-elevate active-elevate-2">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          <img
            src={heroImageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            {icon && (
              <div className="mb-3 text-white/90">
                {icon}
              </div>
            )}
            <h3 className="font-playfair text-2xl lg:text-3xl font-bold text-white mb-2">
              {name}
            </h3>
            <p className="text-white/90 text-sm lg:text-base mb-3 line-clamp-2">
              {description}
            </p>
            <div className="flex items-center justify-between">
              <Badge className="bg-white/20 backdrop-blur-sm text-white border-none hover:bg-white/30">
                {templateCount} Templates
              </Badge>
              <ArrowRight className="w-5 h-5 text-white transform group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}
