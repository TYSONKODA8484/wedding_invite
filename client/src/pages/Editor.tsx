import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { Template, TemplatePage } from "@shared/schema";
import { Loader2, X, Save, Eye, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EditableField {
  fieldName: string;
  fieldType: 'text' | 'textarea' | 'image';
  placeholder?: string;
  maxLength?: number;
}

export default function Editor() {
  const [, params] = useRoute("/editor/:slug");
  const [, navigate] = useLocation();
  const slug = params?.slug;

  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

  const { data: templateData, isLoading, error } = useQuery<Template & { pages?: TemplatePage[] }>({
    queryKey: ["/api/templates", slug],
    queryFn: async () => {
      const response = await fetch(`/api/templates/${slug}`);
      if (!response.ok) throw new Error("Failed to fetch template");
      return response.json();
    },
    enabled: !!slug,
  });

  const template = templateData;
  const pages = templateData?.pages || [];

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
          <Button onClick={() => navigate("/templates")} data-testid="button-back-templates">
            Back to Templates
          </Button>
        </Card>
      </div>
    );
  }

  const currentPage = pages[currentPageIndex];
  const editableFields: EditableField[] = currentPage?.editableFields as EditableField[] || [];

  const handleFieldChange = (fieldName: string, value: string) => {
    setFieldValues(prev => ({ ...prev, [`${currentPage.id}_${fieldName}`]: value }));
  };

  const getFieldValue = (fieldName: string) => {
    return fieldValues[`${currentPage.id}_${fieldName}`] || '';
  };

  const goToNextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background" data-testid="editor-page">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/template/${template.slug}`)}
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-semibold text-foreground text-lg line-clamp-1" data-testid="text-template-title">
                {template.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                Page {currentPageIndex + 1} of {pages.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" data-testid="button-preview">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button variant="default" size="sm" data-testid="button-save">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Page List */}
        <div className="w-64 border-r bg-card hidden md:flex flex-col">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-foreground">Pages</h2>
            <p className="text-xs text-muted-foreground">{pages.length} pages total</p>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-2">
              {pages.map((page, index) => (
                <button
                  key={page.id}
                  onClick={() => setCurrentPageIndex(index)}
                  className={`w-full text-left rounded-md p-3 transition-colors hover-elevate ${
                    currentPageIndex === index
                      ? 'bg-primary/10 border-2 border-primary'
                      : 'bg-muted border-2 border-transparent'
                  }`}
                  data-testid={`page-list-item-${index}`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-12 h-16 bg-background rounded overflow-hidden">
                      <img
                        src={page.thumbnailUrl}
                        alt={page.pageName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-1">
                        {page.pageName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Page {page.pageNumber}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Center - Page Preview */}
        <div className="flex-1 flex flex-col bg-muted/30">
          <div className="flex-1 flex items-center justify-center p-6">
            {currentPage && (
              <div className="relative max-w-md w-full">
                <div className="aspect-[9/16] bg-card rounded-lg shadow-2xl overflow-hidden border-4 border-card">
                  <img
                    src={currentPage.thumbnailUrl}
                    alt={currentPage.pageName}
                    className="w-full h-full object-cover"
                    data-testid="page-preview-image"
                  />
                </div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="secondary" className="shadow-lg">
                    {currentPage.pageName}
                  </Badge>
                </div>
              </div>
            )}
          </div>
          
          {/* Page Navigation */}
          <div className="border-t bg-card p-4">
            <div className="flex items-center justify-between max-w-md mx-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPageIndex === 0}
                data-testid="button-previous-page"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                {currentPageIndex + 1} / {pages.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPageIndex === pages.length - 1}
                data-testid="button-next-page"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Editable Fields */}
        <div className="w-80 border-l bg-card hidden lg:flex flex-col">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-foreground">Edit Fields</h2>
            <p className="text-xs text-muted-foreground">
              {editableFields.length} fields on this page
            </p>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {editableFields.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-sm">
                    No editable fields on this page
                  </p>
                </div>
              ) : (
                editableFields.filter(field => field?.fieldName).map((field, index) => (
                  <div key={index} className="space-y-2" data-testid={`field-${field.fieldName}`}>
                    <Label htmlFor={field.fieldName} className="text-sm font-medium">
                      {field.fieldName}
                    </Label>
                    {field.fieldType === 'textarea' ? (
                      <Textarea
                        id={field.fieldName}
                        placeholder={field.placeholder || `Enter ${field.fieldName?.toLowerCase() || 'text'}`}
                        value={getFieldValue(field.fieldName)}
                        onChange={(e) => handleFieldChange(field.fieldName, e.target.value)}
                        maxLength={field.maxLength}
                        rows={4}
                        data-testid={`input-${field.fieldName}`}
                      />
                    ) : field.fieldType === 'image' ? (
                      <div className="space-y-2">
                        <div className="aspect-video bg-muted rounded-md flex items-center justify-center border-2 border-dashed border-border">
                          <p className="text-xs text-muted-foreground">Image upload (Task 5)</p>
                        </div>
                        <Button variant="outline" size="sm" className="w-full" disabled data-testid={`button-upload-${field.fieldName}`}>
                          Upload Image
                        </Button>
                      </div>
                    ) : (
                      <Input
                        id={field.fieldName}
                        type="text"
                        placeholder={field.placeholder || `Enter ${field.fieldName?.toLowerCase() || 'text'}`}
                        value={getFieldValue(field.fieldName)}
                        onChange={(e) => handleFieldChange(field.fieldName, e.target.value)}
                        maxLength={field.maxLength}
                        data-testid={`input-${field.fieldName}`}
                      />
                    )}
                    {field.maxLength && (
                      <p className="text-xs text-muted-foreground text-right">
                        {getFieldValue(field.fieldName).length} / {field.maxLength}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
