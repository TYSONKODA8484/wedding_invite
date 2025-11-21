import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Chrome } from "lucide-react";
import { signInWithGoogle, handleGoogleRedirect } from "@/lib/firebase";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Handle Firebase redirect on modal open
  useEffect(() => {
    if (isOpen) {
      handleGoogleRedirect()
        .then((user) => {
          if (user) {
            // Google sign-in successful - get ID token and send to backend
            user.getIdToken().then(async (idToken: string) => {
              try {
                const response = await fetch("/api/auth/google", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ idToken }),
                });

                const result = await response.json();
                if (!response.ok) {
                  throw new Error(result.error || "Google sign-in failed");
                }

                localStorage.setItem("auth_token", result.token);
                localStorage.setItem("user", JSON.stringify(result.user));

                toast({
                  title: "Signed in successfully!",
                  description: `Welcome back, ${result.user.name}`,
                });

                onSuccess?.();
                onClose();
                window.location.reload();
              } catch (error) {
                toast({
                  title: "Sign-in failed",
                  description: error instanceof Error ? error.message : "Please try again",
                  variant: "destructive",
                });
              }
            });
          }
        })
        .catch((error) => {
          console.error("Redirect handling error:", error);
        });
    }
  }, [isOpen]);

  // Sign In form state
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Sign Up form state
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPhone, setSignUpPhone] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: signInEmail,
          password: signInPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Login failed");
      }

      // Store JWT token with correct keys
      localStorage.setItem("auth_token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      toast({
        title: "Signed in successfully!",
        description: `Welcome back, ${result.user.name}`,
      });

      // Reset form
      setSignInEmail("");
      setSignInPassword("");
      
      onSuccess?.();
      onClose();
      
      // Reload to update nav state
      window.location.reload();
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (signUpPassword !== signUpConfirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    if (signUpPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signUpName,
          email: signUpEmail,
          phone: signUpPhone || undefined,
          password: signUpPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Signup failed");
      }

      // Store JWT token with correct keys
      localStorage.setItem("auth_token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      toast({
        title: "Account created successfully!",
        description: `Welcome, ${signUpName}!`,
      });

      // Reset form
      setSignUpName("");
      setSignUpEmail("");
      setSignUpPhone("");
      setSignUpPassword("");
      setSignUpConfirmPassword("");

      onSuccess?.();
      onClose();
      
      // Reload to update nav state
      window.location.reload();
    } catch (error) {
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px]" data-testid="modal-auth">
        <DialogHeader>
          <DialogTitle className="text-2xl font-playfair text-center">
            {activeTab === "signin" ? "Welcome Back" : "Create Account"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {activeTab === "signin" 
              ? "Sign in to continue creating your wedding invitation" 
              : "Join WeddingInvite.ai and create stunning video invitations"}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "signin" | "signup")} className="w-full">
          <TabsList className="grid w-full grid-cols-2" data-testid="tabs-auth">
            <TabsTrigger value="signin" data-testid="tab-signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup" data-testid="tab-signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* Sign In Tab */}
          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="you@example.com"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  data-testid="input-signin-email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="••••••••"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  data-testid="input-signin-password"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
                data-testid="button-signin-submit"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* Google Sign-In Button */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-muted-foreground/20"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">or</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => signInWithGoogle()}
                disabled={isLoading}
                data-testid="button-signin-google"
              >
                <Chrome className="w-4 h-4 mr-2" />
                Sign In with Google
              </Button>
            </form>
          </TabsContent>

          {/* Sign Up Tab */}
          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="John Doe"
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  required
                  disabled={isLoading}
                  data-testid="input-signup-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  data-testid="input-signup-email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-phone">Phone Number (Optional)</Label>
                <Input
                  id="signup-phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={signUpPhone}
                  onChange={(e) => setSignUpPhone(e.target.value)}
                  disabled={isLoading}
                  data-testid="input-signup-phone"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  data-testid="input-signup-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                <Input
                  id="signup-confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={signUpConfirmPassword}
                  onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  data-testid="input-signup-confirm-password"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
                data-testid="button-signup-submit"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

              {/* Google Sign-In Button */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-muted-foreground/20"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">or</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => signInWithGoogle()}
                disabled={isLoading}
                data-testid="button-signup-google"
              >
                <Chrome className="w-4 h-4 mr-2" />
                Sign Up with Google
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
