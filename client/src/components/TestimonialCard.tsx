import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  event: string;
  date: string;
  rating: number;
  quote: string;
  avatarUrl?: string;
}

export function TestimonialCard({
  name,
  event,
  date,
  rating,
  quote,
  avatarUrl,
}: TestimonialCardProps) {
  return (
    <Card className="p-6 lg:p-8 hover-elevate transition-all duration-300" data-testid={`card-testimonial-${name.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < rating
                ? "fill-accent text-accent"
                : "fill-muted text-muted"
            }`}
          />
        ))}
      </div>
      <blockquote className="font-cormorant text-lg lg:text-xl italic text-foreground mb-6 leading-relaxed">
        "{quote}"
      </blockquote>
      <div className="flex items-center gap-3">
        <Avatar className="w-12 h-12 border-2 border-border">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
            {name.split(" ").map(n => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-foreground">{name}</p>
          <p className="text-sm text-muted-foreground">
            {event} • {date}
          </p>
        </div>
      </div>
    </Card>
  );
}
