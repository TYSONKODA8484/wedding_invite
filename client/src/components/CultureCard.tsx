import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

interface CultureCardProps {
  name: string;
  localName?: string;
  slug: string;
  description: string;
  heroImageUrl: string;
  templateCount: number;
}

export function CultureCard({
  name,
  localName,
  slug,
  description,
  heroImageUrl,
  templateCount,
}: CultureCardProps) {
  return (
    <Card className="group overflow-hidden hover-elevate active-elevate-2 transition-all duration-300" data-testid={`card-culture-${slug}`}>
      <Link href={`/culture/${slug}`}>
        <a className="block">
          <div className="relative aspect-[16/10] overflow-hidden bg-muted">
            <img
              src={heroImageUrl}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="font-playfair text-xl lg:text-2xl font-bold text-white mb-1">
                {name}
              </h3>
              {localName && (
                <p className="font-cormorant text-lg lg:text-xl text-white/80 mb-2 italic">
                  {localName}
                </p>
              )}
              <p className="text-white/90 text-sm lg:text-base mb-3 line-clamp-2">
                {description}
              </p>
              <Badge className="bg-white/20 backdrop-blur-sm text-white border-none">
                {templateCount} Templates
              </Badge>
            </div>
          </div>
        </a>
      </Link>
    </Card>
  );
}
