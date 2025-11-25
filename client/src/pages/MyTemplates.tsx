import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Edit, Share2, Eye, FileImage, Film } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { VideoPreviewModal } from "@/components/VideoPreviewModal";
import { PaymentModal } from "@/components/PaymentModal";
import { queryClient } from "@/lib/queryClient";

interface Project {
  id: string;
  templateId: string;
  templateName: string;
  templateType: "card" | "video";
  thumbnailUrl: string;
  previewImageUrl: string;
  previewVideoUrl: string;
  orientation: "portrait" | "landscape";
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
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideoProject, setSelectedVideoProject] = useState<Project | null>(null);
  
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

  const triggerDownload = (project: Project) => {
    const urlToDownload = project.finalUrl || project.previewUrl || project.previewVideoUrl;
    if (urlToDownload) {
      const link = document.createElement("a");
      link.href = urlToDownload;
      // For cards, download as image; for videos, download as mp4
      const extension = project.templateType === "card" ? "jpg" : "mp4";
      link.download = `${project.templateName}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({
        title: "Download Started",
        description: `Your ${project.templateType === "card" ? "card" : "video"} is downloading...`,
      });
    } else {
      toast({
        title: "File not ready",
        description: "Your file is still being processed",
        variant: "destructive",
      });
    }
  };

  const handleDownload = (project: Project) => {
    if (!project.isPaid) {
      setSelectedProject(project);
      setShowPaymentModal(true);
    } else {
      triggerDownload(project);
    }
  };

  const handlePaymentSuccess = async () => {
    // Refresh the projects list and wait for it
    await queryClient.invalidateQueries({ queryKey: ["/api/projects/mine"] });
    
    // Auto-download after payment - fetch fresh project data
    if (selectedProject) {
      try {
        const token = localStorage.getItem("auth_token");
        const response = await fetch("/api/projects/mine", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const freshProjects: Project[] = await response.json();
          const updatedProject = freshProjects.find(p => p.id === selectedProject.id);
          
          if (updatedProject && updatedProject.isPaid) {
            // Use fresh data with finalUrl for download
            triggerDownload(updatedProject);
          }
        }
      } catch (error) {
        console.error("Failed to fetch updated project for download:", error);
        // Fallback to original project data
        triggerDownload(selectedProject);
      }
    }
  };

  const handleViewVideo = (project: Project) => {
    setSelectedVideoProject(project);
    setShowVideoModal(true);
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading your templates...</div>
      </div>
    );
  }

  // Partition projects into Paid and Generated sections
  const paidProjects = projects
    ?.filter((p) => p.isPaid)
    .sort((a, b) => {
      const dateA = a.paidAt ? new Date(a.paidAt).getTime() : 0;
      const dateB = b.paidAt ? new Date(b.paidAt).getTime() : 0;
      return dateB - dateA; // Newest paid first
    }) || [];

  const generatedProjects = projects
    ?.filter((p) => !p.isPaid)
    .sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA; // Newest updated first
    }) || [];

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

  const renderProjectCard = (project: Project) => (
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
        <div className="absolute bottom-2 right-2">
          <Badge 
            variant="outline" 
            className="bg-black/50 backdrop-blur-sm text-white border-white/30"
            data-testid={`badge-type-${project.id}`}
          >
            {project.templateType === "card" ? (
              <><FileImage className="h-3 w-3 mr-1" /> Card</>
            ) : (
              <><Film className="h-3 w-3 mr-1" /> Video</>
            )}
          </Badge>
        </div>
        <div className="absolute bottom-2 left-2 flex items-center gap-2">
          {project.isPaid ? (
            <>
              <Button
                size="icon"
                variant="default"
                onClick={() => handleViewVideo(project)}
                data-testid={`button-view-${project.id}`}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
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
                onClick={() => handleViewVideo(project)}
                data-testid={`button-view-${project.id}`}
              >
                <Eye className="h-4 w-4" />
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
        <div className="flex items-start justify-between gap-1 mb-2">
          <h3 className="font-medium text-sm line-clamp-2 flex-1" data-testid={`text-name-${project.id}`}>
            {project.templateName}
          </h3>
          <span className="text-sm font-bold text-pink-500 flex-shrink-0" data-testid={`text-price-${project.id}`}>
            {formatPrice(project.price, project.currency)}
          </span>
        </div>
        
        {project.paidAt && (
          <p className="text-xs text-green-600" data-testid={`text-date-${project.id}`}>
            {new Date(project.paidAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-playfair text-3xl font-bold mb-8" data-testid="heading-my-videos">My Templates</h1>
      {/* Paid Templates Section - Only show if there are paid templates */}
      {paidProjects.length > 0 && (
        <section className="mb-10" data-testid="section-paid-templates">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" data-testid="heading-paid-templates">
            <span className="text-green-600">Paid Templates</span>
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
              {paidProjects.length}
            </Badge>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {paidProjects.map(renderProjectCard)}
          </div>
        </section>
      )}
      {/* Generated Templates Section - Only show if there are generated templates */}
      {generatedProjects.length > 0 && (
        <section data-testid="section-generated-templates">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" data-testid="heading-generated-templates">
            <span className="text-[#16a34a]">Generated Templates</span>
            <Badge variant="secondary" className="text-[#15803d] bg-[#dcfce7]">
              {generatedProjects.length}
            </Badge>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {generatedProjects.map(renderProjectCard)}
          </div>
        </section>
      )}
      <VideoPreviewModal
        open={showVideoModal}
        onOpenChange={setShowVideoModal}
        videoUrl={selectedVideoProject?.previewVideoUrl || null}
        templateName={selectedVideoProject?.templateName || ""}
        orientation={selectedVideoProject?.orientation || "portrait"}
      />
      {selectedProject && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedProject(null);
          }}
          projectId={selectedProject.id}
          templateName={selectedProject.templateName}
          amount={selectedProject.price}
          currency={selectedProject.currency}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
