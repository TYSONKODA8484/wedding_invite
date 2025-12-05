import { useState } from "react";
import { Link } from "wouter";
import { Sparkles, Facebook, Instagram, Twitter, Youtube, Mail, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    
    // Simulate newsletter signup
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Successfully subscribed!",
      description: "Thank you for joining our newsletter.",
    });
    
    setEmail("");
    setIsSubmitting(false);
  };

  const companyLinks = [
    { label: "About Us", href: "/about" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Enterprise", href: "/enterprise" },
    { label: "Contact", href: "/contact" },
  ];

  const resourceLinks = [
    { label: "All Templates", href: "/templates" },
    { label: "Wedding Invites", href: "/templates/wedding" },
    { label: "Birthday Invites", href: "/templates/birthday" },
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/faq" },
  ];

  const cultureLinks = [
    { label: "Indian Weddings", href: "/culture/indian-wedding-video-invitation" },
    { label: "Arabic Weddings", href: "/culture/arabic-wedding-video-uae-saudi" },
    { label: "Punjabi Weddings", href: "/culture/punjabi" },
    { label: "South Indian", href: "/culture/tamil" },
    { label: "All Cultures", href: "/culture" },
  ];

  const countryLinks = [
    { label: "India", href: "/countries/india" },
    { label: "UAE", href: "/countries/uae" },
    { label: "Saudi Arabia", href: "/countries/saudi-arabia" },
  ];

  return (
    <footer className="bg-card border-t border-border">
      {/* Newsletter Section */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-playfair text-2xl lg:text-3xl font-bold text-foreground mb-3">
              Stay Updated
            </h3>
            <p className="text-muted-foreground mb-6">
              Get notified about new templates, special offers, and wedding planning tips.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                required
                data-testid="input-newsletter-email"
              />
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="whitespace-nowrap gap-2"
                data-testid="button-newsletter-subscribe"
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 mb-4 group"
              data-testid="link-footer-logo"
            >
              <Sparkles className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
              <span className="font-playfair text-xl font-bold text-foreground">
                WeddingInvite<span className="text-primary">.ai</span>
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 text-sm lg:text-base max-w-sm leading-relaxed">
              Create stunning, AI-powered cinematic video invitations for your special moments. Culturally authentic and instantly shareable.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="Follow us on Facebook"
                data-testid="link-facebook"
              >
                <Facebook className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="Follow us on Instagram"
                data-testid="link-instagram"
              >
                <Instagram className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="Follow us on Twitter"
                data-testid="link-twitter"
              >
                <Twitter className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="Subscribe on YouTube"
                data-testid="link-youtube"
              >
                <Youtube className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block"
                    data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Templates</h4>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block"
                    data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Culture Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Cultures</h4>
            <ul className="space-y-3">
              {cultureLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block"
                    data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Country Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Regions</h4>
            <ul className="space-y-3">
              {countryLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block"
                    data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-primary fill-primary" /> for couples worldwide
            </p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>&copy; {new Date().getFullYear()} WeddingInvite.ai</span>
              <span className="mx-2">|</span>
              <Link href="/privacy" className="hover:text-primary transition-colors" data-testid="link-privacy">
                Privacy
              </Link>
              <span className="mx-2">|</span>
              <Link href="/terms" className="hover:text-primary transition-colors" data-testid="link-terms">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
