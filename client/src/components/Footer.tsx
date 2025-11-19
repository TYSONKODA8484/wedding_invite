import { Link } from "wouter";
import { Sparkles, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  const companyLinks = [
    { label: "About Us", href: "/about" },
    { label: "How It Works", href: "/how-it-works" },
    // TODO: Re-enable after MVP - Monthly subscription pricing
    // { label: "Pricing", href: "/pricing" },
    { label: "Enterprise", href: "/enterprise" },
    { label: "Contact", href: "/contact" },
  ];

  const resourceLinks = [
    { label: "Templates", href: "/templates" },
    { label: "Examples", href: "/examples" },
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/faq" },
  ];

  const cultureLinks = [
    { label: "Indian Weddings", href: "/culture/indian-wedding-video-invitation" },
    { label: "Arabic Weddings", href: "/culture/arabic-wedding-video-uae-saudi" },
    { label: "Nigerian Weddings", href: "/culture/nigerian-traditional-wedding-video" },
    { label: "All Cultures", href: "/culture" },
  ];

  const countryLinks = [
    { label: "India", href: "/countries/india" },
    { label: "USA", href: "/countries/usa" },
    { label: "UAE", href: "/countries/uae" },
    { label: "UK", href: "/countries/uk" },
    { label: "All Countries", href: "/countries" },
  ];

  return (
    <footer className="bg-card border-t border-card-border mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <Link 
              href="/"
              className="flex items-center gap-2 mb-4 hover-elevate active-elevate-2 rounded-md px-2 py-2 -ml-2 inline-flex"
              data-testid="link-footer-logo"
            >
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="font-playfair text-xl font-bold text-foreground">
                WeddingInvite.ai
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 text-sm lg:text-base max-w-xs">
              Create stunning, AI-powered cinematic video invitations for your special moments. Culturally accurate and instantly shareable.
            </p>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="hover-elevate active-elevate-2" data-testid="link-facebook">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover-elevate active-elevate-2" data-testid="link-instagram">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover-elevate active-elevate-2" data-testid="link-twitter">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover-elevate active-elevate-2" data-testid="link-youtube">
                <Youtube className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-playfair text-base lg:text-lg font-semibold mb-4 text-foreground">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm lg:text-base text-muted-foreground hover:text-foreground transition-colors hover-elevate active-elevate-2 inline-block px-2 py-1 -ml-2 rounded-md"
                    data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-playfair text-base lg:text-lg font-semibold mb-4 text-foreground">Resources</h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm lg:text-base text-muted-foreground hover:text-foreground transition-colors hover-elevate active-elevate-2 inline-block px-2 py-1 -ml-2 rounded-md"
                    data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-playfair text-base lg:text-lg font-semibold mb-4 text-foreground">Cultures</h3>
            <ul className="space-y-3">
              {cultureLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm lg:text-base text-muted-foreground hover:text-foreground transition-colors hover-elevate active-elevate-2 inline-block px-2 py-1 -ml-2 rounded-md"
                    data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-playfair text-base lg:text-lg font-semibold mb-4 text-foreground">Countries</h3>
            <ul className="space-y-3">
              {countryLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm lg:text-base text-muted-foreground hover:text-foreground transition-colors hover-elevate active-elevate-2 inline-block px-2 py-1 -ml-2 rounded-md"
                    data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © 2024 WeddingInvite.ai. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-privacy">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-terms">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
