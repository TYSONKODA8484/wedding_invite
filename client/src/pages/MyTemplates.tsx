import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Edit, Eye, FileImage, Film, Music, Trash2 } from "lucide-react";
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
  
  const { data: projects, isLoading, isFetching } = useQuery<Project[]>({
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
    refetchOnWindowFocus: false,
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
    // Invalidate cache so next render gets fresh data
    await queryClient.invalidateQueries({ queryKey: ["/api/projects/mine"] });
    
    // After payment success, trigger download using the selected project's finalUrl
    if (selectedProject) {
      // Short delay to allow backend to update finalUrl after payment
      setTimeout(async () => {
        try {
          // Refetch the data to get the updated project with finalUrl
          const freshProjects = await queryClient.fetchQuery<Project[]>({ 
            queryKey: ["/api/projects/mine"] 
          });
          if (freshProjects) {
            const updatedProject = freshProjects.find(p => p.id === selectedProject.id);
            if (updatedProject && updatedProject.isPaid && updatedProject.finalUrl) {
              triggerPaidDownload(updatedProject);
            }
          }
        } catch {
          // Silently fail - user can manually download from My Templates
        }
      }, 500);
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

  // Only show full loading state on initial load (no cached data)
  if (isLoading && !projects) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <h1 className="font-playfair text-2xl sm:text-3xl font-bold mb-6 lg:mb-8">My Templates</h1>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-5">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden animate-pulse">
              <div className="aspect-[9/16] bg-muted" />
              <div className="p-3 lg:p-4 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-8 bg-muted rounded" />
              </div>
            </Card>
          ))}
        </div>
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
          {project.paidAt && (
            <p className="text-xs text-green-600">
              {new Date(project.paidAt).toLocaleDateString()}
            </p>
          )}
          <p className="text-base lg:text-lg font-semibold text-primary ml-auto" data-testid={`text-price-${project.id}`}>
            {formatPrice(project.price, project.currency)}
          </p>
        </div>
        
        {/* Paid Templates: View (finalUrl), Download (finalUrl) */}
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
        <div className="flex items-center justify-end mb-3">
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
      <div className="flex items-center gap-3 mb-6 lg:mb-8">
        <h1 className="font-playfair text-2xl sm:text-3xl font-bold" data-testid="heading-my-videos">My Templates</h1>
        {isFetching && !isLoading && (
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        )}
      </div>
      
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
