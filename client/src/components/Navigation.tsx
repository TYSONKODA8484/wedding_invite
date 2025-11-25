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
import { Menu, Sparkles, User, LogOut, Search, Play } from "lucide-react";
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

  const navLinks = [
    { label: "Wedding", href: "/templates/wedding" },
    { label: "Birthday", href: "/templates/birthday" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-background border-b border-border/50"
      }`}
      data-testid="header-navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-6">
          {/* Left: Logo + Company Name */}
          <Link 
            href="/" 
            className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0"
            data-testid="link-home"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <Play className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-semibold text-xl text-foreground">
              WeddingInvite<span className="text-primary">.ai</span>
            </span>
          </Link>

          {/* Middle: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6" data-testid="nav-desktop">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === link.href || location.startsWith(link.href.split('?')[0])
                    ? "text-primary"
                    : "text-foreground/70"
                }`}
                data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {link.label}
              </Link>
            ))}
            <button 
              className="text-foreground/70 hover:text-primary transition-colors"
              data-testid="button-search"
            >
              <Search className="w-5 h-5" />
            </button>
          </nav>

          {/* Right: My Templates + Profile Avatar (Desktop) */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {/* My Templates - coral/pink solid button like 247invites "My Videos" */}
            {isLoggedIn ? (
              <Button
                asChild
                className="bg-[#FF6B6B] hover:bg-[#FF5252] text-white font-medium rounded-full px-5"
                data-testid="button-my-templates"
              >
                <Link href="/my-templates" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  My Templates
                </Link>
              </Button>
            ) : (
              <Button
                className="bg-[#FF6B6B] hover:bg-[#FF5252] text-white font-medium rounded-full px-5"
                onClick={() => setAuthModalOpen(true)}
                data-testid="button-my-templates"
              >
                <User className="w-4 h-4 mr-2" />
                My Templates
              </Button>
            )}
            
            {/* Profile Avatar - always on the right */}
            {isLoggedIn && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full w-10 h-10 p-0"
                    data-testid="button-user-menu"
                  >
                    <Avatar className="w-10 h-10 border-2 border-primary/20">
                      <AvatarFallback className="text-sm font-semibold bg-primary/10 text-primary">
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
                size="icon" 
                className="rounded-full w-10 h-10 p-0"
                onClick={() => setAuthModalOpen(true)}
                data-testid="button-login"
              >
                <Avatar className="w-10 h-10 border-2 border-border">
                  <AvatarFallback className="text-sm font-semibold bg-muted text-muted-foreground">
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
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
                {/* Navigation Links */}
                {navLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-md text-base font-medium transition-colors ${
                      location === link.href || location.startsWith(link.href.split('?')[0])
                        ? "text-primary bg-primary/5"
                        : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                    }`}
                    data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {link.label}
                  </Link>
                ))}
                
                <div className="border-t border-border my-4" />
                
                {isLoggedIn && user ? (
                  <>
                    <div className="px-4 py-3 bg-muted/50 rounded-md">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <Button
                      className="w-full bg-[#FF6B6B] hover:bg-[#FF5252] text-white rounded-full"
                      asChild
                      data-testid="button-my-templates-mobile"
                    >
                      <Link href="/my-templates" onClick={() => setMobileMenuOpen(false)}>
                        <User className="w-4 h-4 mr-2" />
                        My Templates
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
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
                      className="w-full bg-[#FF6B6B] hover:bg-[#FF5252] text-white rounded-full"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setAuthModalOpen(true);
                      }}
                      data-testid="button-my-templates-mobile"
                    >
                      <User className="w-4 h-4 mr-2" />
                      My Templates
                    </Button>
                    <Button
                      variant="ghost"
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
