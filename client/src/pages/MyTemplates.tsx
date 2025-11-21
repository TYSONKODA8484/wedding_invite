import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, Edit, Share2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: string;
  templateId: string;
  templateName: string;
  thumbnailUrl: string;
  previewImageUrl: string;
  price: string;
  currency: string;
  status: string;
  isPaid: boolean;
  paymentStatus: string;
  previewUrl: string | null;
  finalUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  paidAt: Date | null;
}

export default function MyTemplates() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects/mine"],
    queryFn: async () => {
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        navigate("/login");
        throw new Error("Not authenticated");
      }
      
      const response = await fetch("/api/projects/mine", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user");
          navigate("/login");
          throw new Error("Session expired");
        }
        throw new Error("Failed to fetch projects");
      }
      
      return response.json();
    },
  });

  const handleEdit = (project: Project) => {
    navigate(`/editor/${project.id}`);
  };

  const handleDownload = (project: Project) => {
    if (!project.isPaid) {
      setSelectedProject(project);
      setShowPaymentModal(true);
    } else {
      if (project.finalUrl) {
        window.open(project.finalUrl, "_blank");
      } else {
        toast({
          title: "Video not ready",
          description: "Your video is still being processed",
          variant: "destructive",
        });
      }
    }
  };

  const handleShare = (project: Project) => {
    const shareUrl = `${window.location.origin}/template/${project.templateId}`;
    
    if (navigator.share) {
      navigator.share({
        title: project.templateName,
        text: `Check out this ${project.templateName} video invitation!`,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "Share link copied to clipboard",
      });
    }
  };

  const formatPrice = (price: string, currency: string) => {
    if (currency === "INR") {
      return `₹${parseFloat(price).toFixed(0)}`;
    }
    return `${currency} ${parseFloat(price).toFixed(2)}`;
  };

  const getStatusBadge = (project: Project) => {
    if (project.isPaid) {
      if (project.status === "completed") {
        return <Badge className="bg-green-500" data-testid={`badge-status-${project.id}`}>Previewed</Badge>;
      }
      return <Badge className="bg-blue-500" data-testid={`badge-status-${project.id}`}>Processing</Badge>;
    }
    return <Badge variant="secondary" data-testid={`badge-status-${project.id}`}>Previewed</Badge>;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading your templates...</div>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-playfair text-3xl font-bold mb-8">My Videos</h1>
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">You haven't created any video invitations yet</p>
          <Button onClick={() => navigate("/templates")} data-testid="button-browse-templates">
            Browse Templates
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-playfair text-3xl font-bold mb-8" data-testid="heading-my-videos">My Videos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {projects.map((project) => (
          <Card 
            key={project.id} 
            className="overflow-hidden hover-elevate"
            data-testid={`card-project-${project.id}`}
          >
            <div className="relative aspect-[9/16]">
              <img
                src={project.thumbnailUrl || project.previewImageUrl}
                alt={project.templateName}
                className="w-full h-full object-cover"
                data-testid={`img-thumbnail-${project.id}`}
              />
              <div className="absolute top-2 right-2">
                {project.isPaid ? (
                  <Badge variant="default" className="bg-green-600 dark:bg-green-700 text-white" data-testid={`badge-paid-${project.id}`}>
                    Paid
                  </Badge>
                ) : (
                  <Badge variant="secondary" data-testid={`badge-preview-${project.id}`}>
                    Preview
                  </Badge>
                )}
              </div>
              <div className="absolute bottom-2 left-2 right-2 flex gap-2">
                {project.isPaid ? (
                  <>
                    <Button
                      size="icon"
                      variant="default"
                      onClick={() => handleDownload(project)}
                      data-testid={`button-download-${project.id}`}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => handleShare(project)}
                      data-testid={`button-share-${project.id}`}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="icon"
                      variant="default"
                      onClick={() => handleEdit(project)}
                      data-testid={`button-edit-${project.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => handleDownload(project)}
                      data-testid={`button-download-${project.id}`}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-sm line-clamp-2" data-testid={`text-name-${project.id}`}>
                  {project.templateName}
                </h3>
                <span className="text-sm font-bold text-pink-500 ml-2" data-testid={`text-price-${project.id}`}>
                  {formatPrice(project.price, project.currency)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground" data-testid={`text-preview-${project.id}`}>
                  Preview of your video is ready.
                </p>
                {getStatusBadge(project)}
              </div>
              
              {project.paidAt && (
                <p className="text-xs text-green-600 mt-2" data-testid={`text-date-${project.id}`}>
                  DT: {new Date(project.paidAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent data-testid="modal-payment">
          <DialogHeader>
            <DialogTitle>Payment Required</DialogTitle>
            <DialogDescription className="pt-4">
              <p className="text-center text-lg mb-4">
                Working on Payment page
              </p>
              <p className="text-center text-sm text-muted-foreground">
                Payment integration is coming soon. You'll be able to purchase and download your video once payment is set up.
              </p>
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setShowPaymentModal(false)} data-testid="button-close-payment-modal">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
