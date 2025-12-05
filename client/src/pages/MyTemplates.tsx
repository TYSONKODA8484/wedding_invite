import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Edit, Eye, FileImage, Film, Music, Trash2, Plus, Sparkles, ArrowRight, CheckCircle2, Clock } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    staleTime: 30000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

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

  const handleGeneratedDownload = (project: Project) => {
    setSelectedProject(project);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    await queryClient.invalidateQueries({ queryKey: ["/api/projects/mine"] });
    
    if (selectedProject) {
      setTimeout(async () => {
        try {
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

  const handleViewPaid = (project: Project) => {
    const mediaType = project.templateType === "card" ? "image" : "video";
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

  const handleViewGenerated = (project: Project) => {
    const mediaType = project.templateType === "card" ? "image" : "video";
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

  const formatDate = (date: Date | string | null) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-IN", { 
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  // Only show full loading state on initial load (no cached data)
  if (isLoading && !projects) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold">My Templates</h1>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-[9/16] bg-muted animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                <div className="h-10 bg-muted rounded animate-pulse" />
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

  // Empty state
  if (!projects || projects.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold">My Templates</h1>
        </div>
        
        <Card className="p-12 text-center max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-playfair text-2xl font-bold text-foreground mb-3">
            No Templates Yet
          </h2>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
            You haven't created any invitations yet. Browse our collection and start creating your perfect invitation.
          </p>
          <Button size="lg" className="gap-2" asChild>
            <Link href="/templates">
              <Plus className="w-5 h-5" />
              Browse Templates
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  const renderProjectCard = (project: Project, isPaidSection: boolean) => (
    <Card 
      key={project.id} 
      className="group overflow-hidden hover:shadow-lg transition-all duration-300"
      data-testid={`card-project-${project.id}`}
    >
      <div className="relative aspect-[9/16] overflow-hidden bg-muted">
        <img
          src={project.thumbnailUrl || project.previewImageUrl}
          alt={project.templateName}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          data-testid={`img-thumbnail-${project.id}`}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Status badge - top right */}
        <div className="absolute top-3 right-3">
          {isPaidSection ? (
            <Badge className="bg-green-500 text-white font-medium gap-1.5 shadow-md" data-testid={`badge-paid-${project.id}`}>
              <CheckCircle2 className="w-3 h-3" />
              Paid
            </Badge>
          ) : (
            <Badge className="bg-amber-500 text-white font-medium gap-1.5 shadow-md" data-testid={`badge-preview-${project.id}`}>
              <Clock className="w-3 h-3" />
              Draft
            </Badge>
          )}
        </div>
        
        {/* Type and music badges - bottom left */}
        <div className="absolute bottom-3 left-3 flex flex-col gap-1.5">
          <Badge 
            variant="secondary" 
            className="bg-black/60 backdrop-blur-sm text-white border-none w-fit"
            data-testid={`badge-type-${project.id}`}
          >
            {project.templateType === "card" ? (
              <><FileImage className="h-3 w-3 mr-1.5" /> Card</>
            ) : (
              <><Film className="h-3 w-3 mr-1.5" /> Video</>
            )}
          </Badge>
          {project.templateType === "video" && (project.selectedMusic || project.customMusicUrl) && (
            <Badge 
              variant="secondary" 
              className="bg-black/60 backdrop-blur-sm text-white border-none text-[10px] w-fit"
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
      
      <div className="p-4">
        <h3 className="font-semibold text-sm lg:text-base text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors" data-testid={`text-name-${project.id}`}>
          {project.templateName}
        </h3>
        
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-muted-foreground">
            {isPaidSection && project.paidAt 
              ? formatDate(project.paidAt)
              : formatDate(project.updatedAt)
            }
          </p>
          <p className="text-base font-bold text-primary" data-testid={`text-price-${project.id}`}>
            {formatPrice(project.price, project.currency)}
          </p>
        </div>
        
        {/* Actions */}
        {isPaidSection ? (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="flex-1"
              onClick={() => handleViewPaid(project)}
              data-testid={`button-view-${project.id}`}
            >
              <Eye className="h-4 w-4 mr-1.5" /> View
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
        ) : (
          <div className="space-y-2">
            <Button
              size="sm"
              className="w-full"
              onClick={() => handleEdit(project)}
              data-testid={`button-edit-${project.id}`}
            >
              <Edit className="h-4 w-4 mr-1.5" /> Continue Editing
            </Button>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => handleViewGenerated(project)}
                data-testid={`button-view-${project.id}`}
              >
                <Eye className="h-4 w-4 mr-1.5" /> Preview
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
        )}
      </div>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold" data-testid="heading-my-videos">
            My Templates
          </h1>
          {isFetching && !isLoading && (
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          )}
        </div>
        <Button variant="outline" className="gap-2" asChild>
          <Link href="/templates">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create New</span>
          </Link>
        </Button>
      </div>

      {/* Tabs for paid/draft */}
      <Tabs defaultValue={paidProjects.length > 0 ? "paid" : "drafts"} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="paid" className="gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Completed
            {paidProjects.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                {paidProjects.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="drafts" className="gap-2">
            <Clock className="w-4 h-4" />
            Drafts
            {generatedProjects.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                {generatedProjects.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="paid">
          {paidProjects.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
              {paidProjects.map(project => renderProjectCard(project, true))}
            </div>
          ) : (
            <Card className="p-10 text-center">
              <p className="text-muted-foreground mb-4">No completed templates yet</p>
              <p className="text-sm text-muted-foreground">
                Complete a template purchase to see it here
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="drafts">
          {generatedProjects.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
              {generatedProjects.map(project => renderProjectCard(project, false))}
            </div>
          ) : (
            <Card className="p-10 text-center">
              <p className="text-muted-foreground mb-4">No draft templates</p>
              <Button variant="outline" asChild>
                <Link href="/templates">
                  Start Creating
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </Card>
          )}
        </TabsContent>
      </Tabs>

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
            <AlertDialogTitle>Delete this template?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{projectToDelete?.templateName}" and all your customizations. This action cannot be undone.
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
