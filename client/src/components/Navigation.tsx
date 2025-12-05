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
import { Menu, Sparkles, User, LogOut, Heart, Cake, LayoutGrid, ChevronRight } from "lucide-react";
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
            className="flex items-center gap-2.5 hover-elevate active-elevate-2 rounded-lg px-3 py-2 -ml-3 transition-all flex-shrink-0 group"
            data-testid="link-home"
          >
            <div className="relative">
              <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-primary transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="font-playfair text-xl md:text-2xl font-bold text-foreground tracking-tight">
              WeddingInvite<span className="text-primary">.ai</span>
            </span>
          </Link>

          {/* Middle: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1" data-testid="nav-desktop">
            {centerNavLinks.map((link) => {
              const isActive = location === link.href || location.startsWith(link.href.split('?')[0]);
              return (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all hover-elevate active-elevate-2 flex items-center gap-2 ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                  data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {link.icon && (
                    <link.icon className={`w-4 h-4 ${isActive ? 'text-primary' : ''}`} />
                  )}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: My Templates + Login/Avatar (Desktop) */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {/* My Templates - Primary styled button */}
            {isLoggedIn ? (
              <Button
                asChild
                className="gap-2 font-medium shadow-sm"
                data-testid="button-my-templates"
              >
                <Link href="/my-templates">
                  <LayoutGrid className="w-4 h-4" />
                  My Templates
                </Link>
              </Button>
            ) : (
              <Button
                className="gap-2 font-medium shadow-sm"
                onClick={() => setAuthModalOpen(true)}
                data-testid="button-my-templates"
              >
                <LayoutGrid className="w-4 h-4" />
                My Templates
              </Button>
            )}
            
            {/* Login/Avatar */}
            {isLoggedIn && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full p-0 w-10 h-10 ring-2 ring-border hover:ring-primary/50 transition-all"
                    data-testid="button-user-menu"
                  >
                    <Avatar className="w-9 h-9">
                      <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-primary/20 to-accent/20 text-foreground">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60 p-2">
                  <DropdownMenuLabel className="p-3 bg-muted/50 rounded-lg mb-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-primary/30 to-accent/30">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm font-semibold leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground mt-1">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer rounded-md text-destructive focus:text-destructive focus:bg-destructive/10"
                    data-testid="menu-item-logout"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                size="default"
                onClick={() => setAuthModalOpen(true)}
                className="font-medium"
                data-testid="button-login"
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                data-testid="button-mobile-menu"
              >
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="p-6 border-b border-border">
                  <Link 
                    href="/" 
                    className="flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Sparkles className="w-6 h-6 text-primary" />
                    <span className="font-playfair text-xl font-bold">
                      WeddingInvite<span className="text-primary">.ai</span>
                    </span>
                  </Link>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto" data-testid="nav-mobile">
                  {centerNavLinks.map((link) => {
                    const isActive = location === link.href || location.startsWith(link.href.split('?')[0]);
                    return (
                      <Link 
                        key={link.href} 
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-medium transition-all ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-foreground/80 hover:bg-muted"
                        }`}
                        data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        <div className="flex items-center gap-3">
                          {link.icon && <link.icon className="w-5 h-5" />}
                          {link.label}
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </Link>
                    );
                  })}
                </nav>

                {/* Bottom Section */}
                <div className="p-4 border-t border-border space-y-3 bg-muted/30">
                  {isLoggedIn && user ? (
                    <>
                      {/* User Info Card */}
                      <div className="flex items-center gap-3 p-3 bg-background rounded-xl">
                        <Avatar className="w-11 h-11">
                          <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-primary/20 to-accent/20">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>

                      {/* My Templates Button */}
                      <Button
                        asChild
                        className="w-full gap-2 font-medium"
                        data-testid="button-my-templates-mobile"
                      >
                        <Link 
                          href="/my-templates" 
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <LayoutGrid className="w-4 h-4" />
                          My Templates
                        </Link>
                      </Button>

                      {/* Logout Button */}
                      <Button
                        variant="ghost"
                        size="default"
                        className="w-full justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleLogout();
                        }}
                        data-testid="button-logout-mobile"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      {/* My Templates Button (triggers auth) */}
                      <Button
                        className="w-full gap-2 font-medium"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setAuthModalOpen(true);
                        }}
                        data-testid="button-my-templates-mobile"
                      >
                        <LayoutGrid className="w-4 h-4" />
                        My Templates
                      </Button>

                      {/* Sign In Button */}
                      <Button
                        variant="outline"
                        size="default"
                        className="w-full justify-center"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setAuthModalOpen(true);
                        }}
                        data-testid="button-login-mobile"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Sign In
                      </Button>
                    </>
                  )}
                </div>
              </div>
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
