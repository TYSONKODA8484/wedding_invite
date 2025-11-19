import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Sparkles } from "lucide-react";

export function Navigation() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Templates", href: "/templates" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
      data-testid="header-navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link 
            href="/" 
            className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-md px-3 py-2 -ml-3 transition-all"
            data-testid="link-home"
          >
            <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-primary" />
            <span className="font-playfair text-xl md:text-2xl font-bold text-foreground">
              WeddingInvite.ai
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 lg:gap-2" data-testid="nav-desktop">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`px-3 lg:px-4 py-2 rounded-md text-sm lg:text-base font-medium transition-all hover-elevate active-elevate-2 ${
                  location === link.href
                    ? "bg-accent/10 text-accent-foreground"
                    : "text-foreground/80 hover:text-foreground"
                }`}
                data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="default"
              data-testid="button-login"
            >
              Login
            </Button>
            <Button
              variant="default"
              size="default"
              asChild
              data-testid="button-create-invite"
            >
              <Link href="/templates" className="font-medium">
                Create Invite
              </Link>
            </Button>
          </div>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                data-testid="button-mobile-menu"
              >
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <nav className="flex flex-col gap-2 mt-8" data-testid="nav-mobile">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-md text-base font-medium transition-all hover-elevate active-elevate-2 ${
                      location === link.href
                        ? "bg-accent/10 text-accent-foreground"
                        : "text-foreground/80"
                    }`}
                    data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Button
                  variant="ghost"
                  size="default"
                  className="mt-4 w-full"
                  data-testid="button-login-mobile"
                >
                  Login
                </Button>
                <Button
                  variant="default"
                  size="default"
                  className="w-full"
                  asChild
                  data-testid="button-create-invite-mobile"
                >
                  <Link href="/templates" onClick={() => setMobileMenuOpen(false)}>
                    Create Invite
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
