import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/catalyst-ui/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/catalyst-ui/ui/tabs";
import { Button } from "@/catalyst-ui/ui/button";
import { Badge } from "@/catalyst-ui/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/catalyst-ui/ui/dropdown-menu";
import { Download, Trash2, RefreshCw, FileJson, FileText, CheckSquare } from "lucide-react";
import { AnnotationForm } from "./AnnotationForm";
import { AnnotationList } from "./AnnotationList";
import { ComponentInspector, type ComponentInfo } from "./ComponentInspector";
import { useAnnotationContext } from "@/catalyst-ui/dev/context";
import { exportAsJSON, exportAsMarkdown, exportAsTODO } from "./utils/exporters";
import { cn } from "@/catalyst-ui/utils";

interface AnnotationPanelProps {
  /**
   * Whether the panel is open
   */
  open: boolean;
  /**
   * Callback when panel should close
   */
  onOpenChange: (open: boolean) => void;
}

/**
 * Main annotation panel - Sheet with tabs for creating and viewing annotations
 *
 * Features:
 * - "Create" tab with AnnotationForm
 * - "View All" tab with AnnotationList
 * - Status indicator for backend sync
 * - Export and clear actions
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false);
 *
 * <AnnotationPanel open={open} onOpenChange={setOpen} />
 * ```
 */
export function AnnotationPanel({ open, onOpenChange }: AnnotationPanelProps) {
  const { getAllAnnotations, syncStatus, syncError, syncToBackend, clearAll } =
    useAnnotationContext();

  const [activeTab, setActiveTab] = useState<string>("create");
  const [inspectorActive, setInspectorActive] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<ComponentInfo | null>(null);
  const annotations = getAllAnnotations();

  const handleFormSuccess = () => {
    // Switch to "View All" tab after creating annotation
    setActiveTab("view");
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to delete all annotations? This cannot be undone.")) {
      clearAll();
    }
  };

  const handleComponentSelect = (info: ComponentInfo) => {
    setSelectedComponent(info);
    setActiveTab("create"); // Switch to create tab when component is selected
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className={cn(
          "overflow-y-auto transition-all duration-300",
          inspectorActive ? "h-[15vh]" : "h-[80vh]"
        )}
      >
        <SheetHeader>
          <SheetTitle>Annotations</SheetTitle>
          <SheetDescription>
            Add notes, TODOs, and documentation for your components
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Sync Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "text-xs",
                  syncStatus === "synced" && "bg-green-500/10 text-green-500 border-green-500/20",
                  syncStatus === "syncing" && "bg-blue-500/10 text-blue-500 border-blue-500/20",
                  syncStatus === "error" && "bg-red-500/10 text-red-500 border-red-500/20",
                  syncStatus === "idle" && "bg-gray-500/10 text-gray-500 border-gray-500/20"
                )}
              >
                {syncStatus === "synced" && "Synced"}
                {syncStatus === "syncing" && "Syncing..."}
                {syncStatus === "error" && "Sync Error"}
                {syncStatus === "idle" && "Not Synced"}
              </Badge>
              {annotations.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  {annotations.length} annotation{annotations.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => syncToBackend()}
                disabled={syncStatus === "syncing" || annotations.length === 0}
                title="Sync to backend"
              >
                <RefreshCw className={cn("h-4 w-4", syncStatus === "syncing" && "animate-spin")} />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={annotations.length === 0}
                    title="Export annotations"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => exportAsJSON(annotations)}>
                    <FileJson className="mr-2 h-4 w-4" />
                    Export as JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportAsMarkdown(annotations)}>
                    <FileText className="mr-2 h-4 w-4" />
                    Export as Markdown
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportAsTODO(annotations)}>
                    <CheckSquare className="mr-2 h-4 w-4" />
                    Export as TODO.md
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearAll}
                disabled={annotations.length === 0}
                title="Clear all annotations"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {syncError && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3">
              <p className="text-sm text-red-500">{syncError}</p>
            </div>
          )}

          {/* Inspector Controls - Always Visible */}
          <div className="space-y-4">
            <ComponentInspector
              active={inspectorActive}
              onToggle={setInspectorActive}
              onComponentSelect={handleComponentSelect}
            />
          </div>

          {/* Tabs - Hidden when inspector is active */}
          {!inspectorActive && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="create">Create</TabsTrigger>
                <TabsTrigger value="view">
                  View All {annotations.length > 0 && `(${annotations.length})`}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="create" className="mt-4 space-y-6">
                {/* Annotation Form */}
                <AnnotationForm
                  onSuccess={handleFormSuccess}
                  defaultComponentName={selectedComponent?.name}
                  selectedComponent={selectedComponent}
                />
              </TabsContent>

              <TabsContent value="view" className="mt-4">
                <AnnotationList />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
