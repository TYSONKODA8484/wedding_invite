import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { Link } from "wouter";

interface PricingCardProps {
  name: string;
  price: number;
  period?: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  ctaText: string;
  ctaUrl: string;
}

export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  isPopular,
  ctaText,
  ctaUrl,
}: PricingCardProps) {
  return (
    <Card className={`relative p-6 lg:p-8 hover-elevate transition-all duration-300 ${isPopular ? "border-2 border-primary shadow-lg" : ""}`} data-testid={`card-pricing-${name.toLowerCase().replace(/\s+/g, "-")}`}>
      {isPopular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground font-semibold px-4 py-1">
          Most Popular
        </Badge>
      )}
      <div className="mb-6">
        <h3 className="font-playfair text-2xl lg:text-3xl font-bold text-foreground mb-2">
          {name}
        </h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        <div className="flex items-baseline gap-2">
          <span className="font-playfair text-4xl lg:text-5xl font-bold text-foreground">
            {price === 0 ? "Free" : `$${price}`}
          </span>
          {period && price > 0 && (
            <span className="text-muted-foreground">/ {period}</span>
          )}
        </div>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <span className="text-foreground text-sm lg:text-base">{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        variant={isPopular ? "default" : "outline"}
        size="lg"
        className="w-full font-semibold"
        asChild
        data-testid={`button-pricing-${name.toLowerCase().replace(/\s+/g, "-")}`}
      >
        <Link href={ctaUrl}>
          <a>{ctaText}</a>
        </Link>
      </Button>
    </Card>
  );
}
