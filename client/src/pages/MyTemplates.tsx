import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Edit, Share2, Eye, FileImage, Film, Music, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { MediaPreviewModal } from "@/components/MediaPreviewModal";
import { PaymentModal } from "@/components/PaymentModal";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MusicInfo {
  id: string;
  name: string;
  url: string;
  duration: number;
  category: string;
}

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
  selectedMusicId: string | null;
  customMusicUrl: string | null;
  selectedMusic: MusicInfo | null;
}

export default function MyTemplates() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaModalData, setMediaModalData] = useState<{
    url: string | null;
    type: "image" | "video";
    name: string;
    orientation: "portrait" | "landscape";
  } | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  
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
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (projectId: string) => {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        navigate("/login");
        throw new Error("Not authenticated");
      }
      const response = await apiRequest("DELETE", `/api/projects/${projectId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects/mine"] });
      toast({
        title: "Template Deleted",
        description: `"${projectToDelete?.templateName}" has been removed.`,
      });
      setShowDeleteDialog(false);
      setProjectToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEdit = (project: Project) => {
    navigate(`/editor/${project.id}?from=my-templates`);
  };

  // Download for paid templates - uses finalUrl
  const triggerPaidDownload = (project: Project) => {
    const urlToDownload = project.finalUrl;
    if (urlToDownload) {
      const link = document.createElement("a");
      link.href = urlToDownload;
      const extension = project.templateType === "card" ? "png" : "mp4";
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

  // For generated (unpaid) templates - triggers payment first
  const handleGeneratedDownload = (project: Project) => {
    setSelectedProject(project);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    await queryClient.invalidateQueries({ queryKey: ["/api/projects/mine"] });
    
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
            triggerPaidDownload(updatedProject);
          }
        }
      } catch (error) {
        console.error("Failed to fetch updated project for download:", error);
      }
    }
  };

  // View for Paid templates - uses finalUrl with fallbacks
  const handleViewPaid = (project: Project) => {
    const mediaType = project.templateType === "card" ? "image" : "video";
    // Fallback chain: finalUrl -> previewUrl -> template assets
    const url = project.finalUrl || project.previewUrl || 
      (mediaType === "image" ? project.previewImageUrl : project.previewVideoUrl) ||
      project.thumbnailUrl;
    
    if (!url) {
      toast({
        title: "Preview unavailable",
        description: "The file is not ready yet. Please try again later.",
        variant: "destructive",
      });
      return;
    }
    
    setMediaModalData({
      url,
      type: mediaType,
      name: project.templateName,
      orientation: project.orientation,
    });
    setShowMediaModal(true);
  };

  // View for Generated templates - uses previewUrl with fallbacks
  const handleViewGenerated = (project: Project) => {
    const mediaType = project.templateType === "card" ? "image" : "video";
    // Fallback chain: previewUrl -> template assets
    const url = project.previewUrl || 
      (mediaType === "image" ? project.previewImageUrl : project.previewVideoUrl) ||
      project.thumbnailUrl;
    
    if (!url) {
      toast({
        title: "Preview unavailable",
        description: "The preview is not ready yet. Please try again later.",
        variant: "destructive",
      });
      return;
    }
    
    setMediaModalData({
      url,
      type: mediaType,
      name: project.templateName,
      orientation: project.orientation,
    });
    setShowMediaModal(true);
  };

  // Share for paid templates - shares finalUrl with promo text
  const handleShare = (project: Project) => {
    const fileUrl = project.finalUrl || `${window.location.origin}/template/${project.templateId}`;
    const promoText = `Check out my beautiful ${project.templateType === "card" ? "invitation card" : "video invitation"} created with WeddingInvite.ai!\n\n${project.templateName}\n\nCreate your own stunning invitations at WeddingInvite.ai`;
    
    if (navigator.share) {
      navigator.share({
        title: project.templateName,
        text: promoText,
        url: fileUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${promoText}\n\n${fileUrl}`);
      toast({
        title: "Link copied!",
        description: "Share message copied to clipboard",
      });
    }
  };

  // Delete handler
  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      deleteMutation.mutate(projectToDelete.id);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="text-center">Loading your templates...</div>
      </div>
    );
  }

  const paidProjects = projects
    ?.filter((p) => p.isPaid)
    .sort((a, b) => {
      const dateA = a.paidAt ? new Date(a.paidAt).getTime() : 0;
      const dateB = b.paidAt ? new Date(b.paidAt).getTime() : 0;
      return dateB - dateA;
    }) || [];

  const generatedProjects = projects
    ?.filter((p) => !p.isPaid)
    .sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    }) || [];

  if (!projects || projects.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <h1 className="font-playfair text-2xl sm:text-3xl font-bold mb-6 lg:mb-8">My Templates</h1>
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">You haven't created any video invitations yet</p>
          <Button onClick={() => navigate("/templates")} data-testid="button-browse-templates">
            Browse Templates
          </Button>
        </div>
      </div>
    );
  }

  // Render card for PAID templates
  const renderPaidProjectCard = (project: Project) => (
    <Card 
      key={project.id} 
      className="group overflow-hidden transition-all duration-300"
      data-testid={`card-project-${project.id}`}
    >
      <div className="relative aspect-[9/16] overflow-hidden bg-muted">
        <img
          src={project.thumbnailUrl || project.previewImageUrl}
          alt={project.templateName}
          className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
          data-testid={`img-thumbnail-${project.id}`}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-3 right-3">
          <Badge className="bg-green-600 text-white font-semibold" data-testid={`badge-paid-${project.id}`}>
            Paid
          </Badge>
        </div>
        
        <div className="absolute bottom-3 left-3 flex flex-col gap-1">
          <Badge 
            variant="secondary" 
            className="bg-black/60 backdrop-blur-sm text-white border-none"
            data-testid={`badge-type-${project.id}`}
          >
            {project.templateType === "card" ? (
              <><FileImage className="h-3 w-3 mr-1" /> Card</>
            ) : (
              <><Film className="h-3 w-3 mr-1" /> Video</>
            )}
          </Badge>
          {project.templateType === "video" && (project.selectedMusic || project.customMusicUrl) && (
            <Badge 
              variant="secondary" 
              className="bg-black/60 backdrop-blur-sm text-white border-none text-[10px]"
              data-testid={`badge-music-${project.id}`}
            >
              <Music className="h-2.5 w-2.5 mr-1" />
              {project.selectedMusic ? (
                <span className="truncate max-w-[80px]">{project.selectedMusic.name}</span>
              ) : (
                <span>Custom Music</span>
              )}
            </Badge>
          )}
        </div>
      </div>
      
      <div className="p-3 lg:p-4">
        <h3 className="font-playfair text-sm lg:text-base font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors" data-testid={`text-name-${project.id}`}>
          {project.templateName}
        </h3>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-muted-foreground capitalize">
            {project.templateType}
            {project.paidAt && (
              <span className="text-green-600 ml-1">
                {new Date(project.paidAt).toLocaleDateString()}
              </span>
            )}
          </p>
          <p className="text-base lg:text-lg font-semibold text-primary" data-testid={`text-price-${project.id}`}>
            {formatPrice(project.price, project.currency)}
          </p>
        </div>
        
        {/* Paid Templates: View (finalUrl), Download (finalUrl), Share (finalUrl + promo) */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="default"
            className="flex-1"
            onClick={() => handleViewPaid(project)}
            data-testid={`button-view-${project.id}`}
          >
            <Eye className="h-4 w-4 mr-1" /> View
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => triggerPaidDownload(project)}
            data-testid={`button-download-${project.id}`}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => handleShare(project)}
            data-testid={`button-share-${project.id}`}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );

  // Render card for GENERATED (unpaid) templates
  const renderGeneratedProjectCard = (project: Project) => (
    <Card 
      key={project.id} 
      className="group overflow-hidden transition-all duration-300"
      data-testid={`card-project-${project.id}`}
    >
      <div className="relative aspect-[9/16] overflow-hidden bg-muted">
        <img
          src={project.thumbnailUrl || project.previewImageUrl}
          alt={project.templateName}
          className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
          data-testid={`img-thumbnail-${project.id}`}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-black/60 backdrop-blur-sm text-white border-none" data-testid={`badge-preview-${project.id}`}>
            Preview
          </Badge>
        </div>
        
        <div className="absolute bottom-3 left-3 flex flex-col gap-1">
          <Badge 
            variant="secondary" 
            className="bg-black/60 backdrop-blur-sm text-white border-none"
            data-testid={`badge-type-${project.id}`}
          >
            {project.templateType === "card" ? (
              <><FileImage className="h-3 w-3 mr-1" /> Card</>
            ) : (
              <><Film className="h-3 w-3 mr-1" /> Video</>
            )}
          </Badge>
          {project.templateType === "video" && (project.selectedMusic || project.customMusicUrl) && (
            <Badge 
              variant="secondary" 
              className="bg-black/60 backdrop-blur-sm text-white border-none text-[10px]"
              data-testid={`badge-music-${project.id}`}
            >
              <Music className="h-2.5 w-2.5 mr-1" />
              {project.selectedMusic ? (
                <span className="truncate max-w-[80px]">{project.selectedMusic.name}</span>
              ) : (
                <span>Custom Music</span>
              )}
            </Badge>
          )}
        </div>
      </div>
      
      <div className="p-3 lg:p-4">
        <h3 className="font-playfair text-sm lg:text-base font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors" data-testid={`text-name-${project.id}`}>
          {project.templateName}
        </h3>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-muted-foreground capitalize">
            {project.templateType}
          </p>
          <p className="text-base lg:text-lg font-semibold text-primary" data-testid={`text-price-${project.id}`}>
            {formatPrice(project.price, project.currency)}
          </p>
        </div>
        
        {/* Generated Templates: Edit, View (previewUrl), Download (payment), Delete */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="default"
            className="flex-1"
            onClick={() => handleEdit(project)}
            data-testid={`button-edit-${project.id}`}
          >
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => handleViewGenerated(project)}
            data-testid={`button-view-${project.id}`}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => handleGeneratedDownload(project)}
            data-testid={`button-download-${project.id}`}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => handleDeleteClick(project)}
            disabled={deleteMutation.isPending}
            data-testid={`button-delete-${project.id}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <h1 className="font-playfair text-2xl sm:text-3xl font-bold mb-6 lg:mb-8" data-testid="heading-my-videos">My Templates</h1>
      
      {/* Paid Templates Section */}
      {paidProjects.length > 0 && (
        <section className="mb-10" data-testid="section-paid-templates">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" data-testid="heading-paid-templates">
            <span className="text-green-600">Paid Templates</span>
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
              {paidProjects.length}
            </Badge>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-5">
            {paidProjects.map(renderPaidProjectCard)}
          </div>
        </section>
      )}
      
      {/* Separator */}
      {paidProjects.length > 0 && generatedProjects.length > 0 && (
        <hr className="border-t border-border mb-10" />
      )}
      
      {/* Generated Templates Section */}
      {generatedProjects.length > 0 && (
        <section data-testid="section-generated-templates">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" data-testid="heading-generated-templates">
            <span className="text-[#16a34a]">Generated Templates</span>
            <Badge variant="secondary" className="text-[#15803d] bg-[#dcfce7]">
              {generatedProjects.length}
            </Badge>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-5">
            {generatedProjects.map(renderGeneratedProjectCard)}
          </div>
        </section>
      )}

      {/* Media Preview Modal */}
      <MediaPreviewModal
        open={showMediaModal}
        onOpenChange={setShowMediaModal}
        mediaUrl={mediaModalData?.url || null}
        mediaType={mediaModalData?.type || "video"}
        templateName={mediaModalData?.name || ""}
        orientation={mediaModalData?.orientation || "portrait"}
      />

      {/* Payment Modal */}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{projectToDelete?.templateName}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProjectToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
