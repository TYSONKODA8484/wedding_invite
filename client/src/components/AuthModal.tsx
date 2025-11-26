import { useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Mail, Phone, CheckCircle2 } from "lucide-react";
import { signInWithRedirect } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type ViewState = "auth" | "forgot-input" | "forgot-otp" | "reset-success";

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [isLoading, setIsLoading] = useState(false);
  const [viewState, setViewState] = useState<ViewState>("auth");
  const { toast } = useToast();

  // Sign In form state
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Sign Up form state
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPhone, setSignUpPhone] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");

  // Forgot Password state
  const [forgotInput, setForgotInput] = useState("");
  const [forgotInputType, setForgotInputType] = useState<"email" | "phone" | null>(null);
  const [otpValue, setOtpValue] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const detectInputType = (value: string): "email" | "phone" | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    
    if (emailRegex.test(value)) return "email";
    if (phoneRegex.test(value.replace(/\s/g, ''))) return "phone";
    return null;
  };

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

      localStorage.setItem("auth_token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      window.dispatchEvent(new Event('authStateChanged'));

      toast({
        title: "Signed in successfully!",
        description: `Welcome back, ${result.user.name}`,
      });

      setSignInEmail("");
      setSignInPassword("");
      
      onSuccess?.();
      onClose();
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

      localStorage.setItem("auth_token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      window.dispatchEvent(new Event('authStateChanged'));

      toast({
        title: "Account created successfully!",
        description: `Welcome, ${signUpName}!`,
      });

      setSignUpName("");
      setSignUpEmail("");
      setSignUpPhone("");
      setSignUpPassword("");
      setSignUpConfirmPassword("");

      onSuccess?.();
      onClose();
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

  const handleGoogleSignIn = async () => {
    try {
      console.log("[Google Auth] Button clicked - initiating redirect to Google...");
      await signInWithRedirect(auth, googleProvider);
      console.log("[Google Auth] Redirect initiated successfully");
    } catch (error: any) {
      console.error("[Google Auth] Failed to initiate redirect:", error);
      toast({
        title: "Google sign-in failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const inputType = detectInputType(forgotInput);
    if (!inputType) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid email address or phone number.",
        variant: "destructive",
      });
      return;
    }
    
    setForgotInputType(inputType);
    setViewState("forgot-otp");
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otpValue.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    // UI-only: Show success state
    setViewState("reset-success");
  };

  const handleBackToAuth = () => {
    setViewState("auth");
    setForgotInput("");
    setForgotInputType(null);
    setOtpValue("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const handleClose = () => {
    if (!isLoading) {
      handleBackToAuth();
      onClose();
    }
  };

  const getMaskedContact = () => {
    if (forgotInputType === "email") {
      const [local, domain] = forgotInput.split("@");
      const maskedLocal = local.length > 3 
        ? `${local.slice(0, 2)}${"*".repeat(local.length - 3)}${local.slice(-1)}`
        : `${local[0]}${"*".repeat(local.length - 1)}`;
      return `${maskedLocal}@${domain}`;
    } else {
      const cleaned = forgotInput.replace(/\s/g, '');
      return `${"*".repeat(cleaned.length - 4)}${cleaned.slice(-4)}`;
    }
  };

  // Forgot Password - Enter Email/Phone
  if (viewState === "forgot-input") {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[480px]" data-testid="modal-forgot-password">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBackToAuth}
                className="h-8 w-8"
                data-testid="button-back-to-auth"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <DialogTitle className="text-2xl font-playfair">
                Forgot Password
              </DialogTitle>
            </div>
            <DialogDescription>
              Enter your email address or phone number to receive a verification code.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-input">Email or Phone Number</Label>
              <Input
                id="forgot-input"
                type="text"
                placeholder="you@example.com or +91 98765 43210"
                value={forgotInput}
                onChange={(e) => setForgotInput(e.target.value)}
                required
                data-testid="input-forgot-email-phone"
              />
              <p className="text-xs text-muted-foreground">
                We'll send a 6-digit verification code to reset your password.
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              data-testid="button-send-otp"
            >
              Send Verification Code
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  // Forgot Password - Enter OTP + New Password
  if (viewState === "forgot-otp") {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[480px]" data-testid="modal-otp-verify">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewState("forgot-input")}
                className="h-8 w-8"
                data-testid="button-back-to-forgot"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <DialogTitle className="text-2xl font-playfair">
                Verify OTP
              </DialogTitle>
            </div>
          </DialogHeader>

          {/* OTP Sent Notification */}
          <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/10 border border-accent/20">
            {forgotInputType === "email" ? (
              <Mail className="h-5 w-5 text-primary flex-shrink-0" />
            ) : (
              <Phone className="h-5 w-5 text-primary flex-shrink-0" />
            )}
            <div>
              <p className="text-sm font-medium">
                OTP sent to {forgotInputType === "email" ? "email" : "phone"}
              </p>
              <p className="text-xs text-muted-foreground">
                {getMaskedContact()}
              </p>
            </div>
          </div>

          <form onSubmit={handleOtpSubmit} className="space-y-5 mt-2">
            {/* 6-digit OTP Input */}
            <div className="space-y-3">
              <Label>Enter 6-digit verification code</Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otpValue}
                  onChange={(value) => setOtpValue(value)}
                  data-testid="input-otp"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => {
                    toast({
                      title: "OTP Resent",
                      description: `A new code has been sent to your ${forgotInputType}.`,
                    });
                  }}
                  data-testid="button-resend-otp"
                >
                  Resend
                </button>
              </p>
            </div>

            <Separator />

            {/* New Password Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  data-testid="input-new-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                  data-testid="input-confirm-new-password"
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={otpValue.length !== 6}
              data-testid="button-reset-password"
            >
              Reset Password
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  // Password Reset Success
  if (viewState === "reset-success") {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[480px]" data-testid="modal-reset-success">
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <DialogTitle className="text-2xl font-playfair">
              Password Reset Successful
            </DialogTitle>
            <DialogDescription className="text-base">
              Your password has been reset successfully. You can now sign in with your new password.
            </DialogDescription>
            <Button 
              onClick={handleBackToAuth} 
              className="w-full max-w-[200px] mt-4"
              data-testid="button-back-to-signin"
            >
              Back to Sign In
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Main Auth View (Sign In / Sign Up)
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
            <div className="space-y-4 mt-4">
              {/* Google Sign-In Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                data-testid="button-google-signin"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>
            </div>

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
                <div className="flex items-center justify-between">
                  <Label htmlFor="signin-password">Password</Label>
                  <button
                    type="button"
                    onClick={() => setViewState("forgot-input")}
                    className="text-xs text-primary hover:underline"
                    data-testid="link-forgot-password"
                  >
                    Forgot Password?
                  </button>
                </div>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="Enter your password"
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
            </form>
          </TabsContent>

          {/* Sign Up Tab */}
          <TabsContent value="signup">
            <div className="space-y-4 mt-4">
              {/* Google Sign-In Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                data-testid="button-google-signup"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or sign up with email
                  </span>
                </div>
              </div>
            </div>

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
                  placeholder="Create a password"
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
                  placeholder="Confirm your password"
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
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
