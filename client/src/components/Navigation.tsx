import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, Sparkles, User, LogOut, Heart, Cake } from "lucide-react";
import { AuthModal } from "@/components/AuthModal";

export function Navigation() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const checkAuthState = () => {
      const token = localStorage.getItem("auth_token");
      const userStr = localStorage.getItem("user");
      
      if (token && userStr) {
        try {
          const userData = JSON.parse(userStr);
          setUser(userData);
          setIsLoggedIn(true);
        } catch (e) {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user");
          setIsLoggedIn(false);
          setUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };
    
    checkAuthState();
    
    const handleAuthChange = () => {
      checkAuthState();
    };
    window.addEventListener('authStateChanged', handleAuthChange);
    
    const interval = setInterval(checkAuthState, 1000);
    
    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    window.dispatchEvent(new Event('authStateChanged'));
    window.location.href = "/";
  };

  const getUserInitials = () => {
    if (!user) return "U";
    return user.name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const centerNavLinks = [
    { label: "Wedding", href: "/templates/wedding", icon: Heart },
    { label: "Birthday", href: "/templates/birthday", icon: Cake },
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
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* Left: Logo + Company Name */}
          <Link 
            href="/" 
            className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-md px-3 py-2 -ml-3 transition-all flex-shrink-0"
            data-testid="link-home"
          >
            <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-primary" />
            <span className="font-playfair text-xl md:text-2xl font-bold text-foreground">
              WeddingInvite.ai
            </span>
          </Link>

          {/* Middle: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1" data-testid="nav-desktop">
            {centerNavLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all hover-elevate active-elevate-2 flex items-center gap-1.5 ${
                  location === link.href || location.startsWith(link.href.split('?')[0])
                    ? "bg-accent/10 text-accent-foreground"
                    : "text-foreground/80 hover:text-foreground"
                }`}
                data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {link.icon && <link.icon className="w-4 h-4" />}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: My Templates + Login/Avatar (Desktop) */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            {/* My Templates - always visible, primary style */}
            {isLoggedIn ? (
              <Button
                variant="default"
                size="default"
                asChild
                data-testid="button-my-templates"
              >
                <Link href="/my-templates" className="font-medium">
                  My Templates
                </Link>
              </Button>
            ) : (
              <Button
                variant="default"
                size="default"
                onClick={() => setAuthModalOpen(true)}
                data-testid="button-my-templates"
              >
                My Templates
              </Button>
            )}
            
            {/* Login/Avatar - always on the right */}
            {isLoggedIn && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full"
                    data-testid="button-user-menu"
                  >
                    <Avatar className="w-9 h-9">
                      <AvatarFallback className="text-sm font-semibold">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem data-testid="menu-item-profile">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    data-testid="menu-item-logout"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="default"
                onClick={() => setAuthModalOpen(true)}
                data-testid="button-login"
              >
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
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
                {/* Category Links */}
                {centerNavLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-md text-base font-medium transition-all hover-elevate active-elevate-2 flex items-center gap-2 ${
                      location === link.href || location.startsWith(link.href.split('?')[0])
                        ? "bg-accent/10 text-accent-foreground"
                        : "text-foreground/80"
                    }`}
                    data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {link.icon && <link.icon className="w-4 h-4" />}
                    {link.label}
                  </Link>
                ))}
                
                <div className="border-t border-border my-4" />
                
                {isLoggedIn && user ? (
                  <>
                    <div className="px-4 py-3 bg-accent/10 rounded-md">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <Button
                      variant="default"
                      size="default"
                      className="w-full"
                      asChild
                      data-testid="button-my-templates-mobile"
                    >
                      <Link href="/my-templates" onClick={() => setMobileMenuOpen(false)}>
                        My Templates
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="default"
                      className="w-full justify-start"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      data-testid="button-logout-mobile"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="default"
                      size="default"
                      className="w-full"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setAuthModalOpen(true);
                      }}
                      data-testid="button-my-templates-mobile"
                    >
                      My Templates
                    </Button>
                    <Button
                      variant="ghost"
                      size="default"
                      className="w-full"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setAuthModalOpen(true);
                      }}
                      data-testid="button-login-mobile"
                    >
                      Login
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {}}
      />
    </header>
  );
}
