import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Template } from "@shared/schema";
import { Loader2, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Editor() {
  const [, params] = useRoute("/editor/:id");
  const templateId = params?.id;

  const { data: template, isLoading, error } = useQuery<Template>({
    queryKey: ["/api/templates", templateId],
    queryFn: async () => {
      const response = await fetch(`/api/templates/${templateId}`);
      if (!response.ok) throw new Error("Failed to fetch template");
      return response.json();
    },
    enabled: !!templateId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" data-testid="loading-editor">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Loading editor...</p>
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4" data-testid="error-editor">
        <Card className="p-12 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-destructive" />
          </div>
          <h3 className="font-playfair text-2xl font-bold text-foreground mb-2">
            Template Not Found
          </h3>
          <p className="text-muted-foreground mb-6">
            Unable to load the editor for this template.
          </p>
          <Button onClick={() => window.location.href = "/templates"} data-testid="button-back-templates">
            Back to Templates
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-testid="editor-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-12 text-center">
          <h1 className="font-playfair text-4xl font-bold text-foreground mb-4">
            Editor (Coming Soon)
          </h1>
          <p className="text-muted-foreground text-lg mb-2">
            Multi-page editor for: <span className="font-semibold text-foreground">{template.title}</span>
          </p>
          <p className="text-muted-foreground mb-8">
            The 247invites-style editor with page navigation and editable fields will be built next.
          </p>
          <Button onClick={() => window.location.href = "/templates"} variant="outline" data-testid="button-back">
            Back to Templates
          </Button>
        </Card>
      </div>
    </div>
  );
}
