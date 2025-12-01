import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2, Download } from "lucide-react";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  templateName: string;
  amount: string;
  currency: string;
  onSuccess: () => void;
  onDownloadReady?: (downloadUrl: string, templateName: string) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function PaymentModal({
  isOpen,
  onClose,
  projectId,
  templateName,
  amount,
  currency,
  onSuccess,
  onDownloadReady,
}: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  const triggerDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename.replace(/[^a-zA-Z0-9]/g, '_')}_WeddingInvite.mp4`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePayment = async () => {
    try {
      setIsProcessing(true);

      const orderResponse = await apiRequest("POST", `/api/payment/create-order`, {
        projectId,
      });

      const orderData = await orderResponse.json();
      const { razorpayOrderId, amount: orderAmount, currency: orderCurrency, keyId } = orderData;

      const options = {
        key: keyId,
        amount: parseFloat(orderAmount) * 100,
        currency: orderCurrency,
        name: "WeddingInvite.ai",
        description: `Purchase ${templateName}`,
        order_id: razorpayOrderId,
        handler: async function (response: any) {
          try {
            const verifyResponse = await apiRequest("POST", `/api/payment/verify`, {
              orderId: orderData.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            
            const verifyData = await verifyResponse.json();

            await queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
            await queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId] });

            toast({
              title: "Payment Successful!",
              description: "Your video download will start automatically.",
            });

            // Trigger automatic download if URL is available
            if (verifyData.downloadUrl) {
              triggerDownload(verifyData.downloadUrl, verifyData.templateName || templateName);
              
              // Also notify parent component so Download button gets enabled
              if (onDownloadReady) {
                onDownloadReady(verifyData.downloadUrl, verifyData.templateName || templateName);
              }
            }

            onSuccess();
            onClose();
          } catch (error) {
            console.error("Payment verification error:", error);
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support if amount was deducted.",
              variant: "destructive",
            });
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#C9A962",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: string, currency: string) => {
    const numAmount = parseFloat(amount);
    if (currency === "INR") {
      return `₹${numAmount.toLocaleString("en-IN")}`;
    }
    return `${currency} ${numAmount.toLocaleString()}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="modal-payment">
        <DialogHeader>
          <DialogTitle className="text-2xl">Complete Your Purchase</DialogTitle>
          <DialogDescription>
            You're about to unlock the full-quality video for {templateName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="rounded-lg border bg-card p-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Template</span>
              <span className="font-medium" data-testid="text-template-name">{templateName}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t">
              <span className="text-lg font-semibold">Total Amount</span>
              <span className="text-2xl font-bold text-primary" data-testid="text-amount">
                {formatCurrency(amount, currency)}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full h-12 text-base"
              size="lg"
              data-testid="button-proceed-payment"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Proceed to Payment
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={onClose}
              disabled={isProcessing}
              className="w-full"
              data-testid="button-cancel-payment"
            >
              Cancel
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            Secure payment powered by Razorpay. Your payment information is encrypted and secure.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
