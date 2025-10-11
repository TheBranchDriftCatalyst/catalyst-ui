import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/catalyst-ui/ui/sheet";
import { Button } from "@/catalyst-ui/ui/button";
import { Badge } from "@/catalyst-ui/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/catalyst-ui/ui/dropdown-menu";
import { Download, Trash2, RefreshCw, FileJson, FileText, CheckSquare } from "lucide-react";
import { AnnotationList } from "./AnnotationList";
import { useAnnotationContext } from "@/catalyst-ui/dev/context";
import { exportAsJSON, exportAsMarkdown, exportAsTODO } from "./utils/exporters";
import { cn } from "@/catalyst-ui/utils";

interface AnnotationListSheetProps {
  /**
   * Whether the sheet is open
   */
  open: boolean;
  /**
   * Callback when sheet should close
   */
  onOpenChange: (open: boolean) => void;
}

/**
 * Right side sheet displaying list of all annotations
 *
 * Features:
 * - View all annotations in a list
 * - Status indicator for backend sync
 * - Export and clear actions
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false);
 *
 * <AnnotationListSheet open={open} onOpenChange={setOpen} />
 * ```
 */
export function AnnotationListSheet({ open, onOpenChange }: AnnotationListSheetProps) {
  const { getAllAnnotations, syncStatus, syncError, syncToBackend, clearAll } =
    useAnnotationContext();

  const annotations = getAllAnnotations();

  const handleClearAll = () => {
    if (confirm("Are you sure you want to delete all annotations? This cannot be undone.")) {
      clearAll();
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Annotations</SheetTitle>
          <SheetDescription>View and manage all your component annotations</SheetDescription>
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

          {/* Annotation List */}
          <div className="mt-4">
            <AnnotationList />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
