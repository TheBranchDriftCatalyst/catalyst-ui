import React, { useState } from "react";
import { Button } from "@/catalyst-ui/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/catalyst-ui/ui/dropdown-menu";
import { Code2, FileText, Languages, List, MousePointer2 } from "lucide-react";
import type { ComponentInfo } from "../annotation/ComponentInspector";
import { ComponentInspector } from "../annotation/ComponentInspector";
import { AnnotationListSheet } from "../annotation/AnnotationListSheet";
import { AnnotationFormSheet } from "../annotation/AnnotationFormSheet";
import { isDevUtilsEnabled } from "../utils/devMode";

interface DevModeToggleProps {
  /**
   * Button variant
   */
  variant?: "default" | "outline" | "ghost" | "secondary";
  /**
   * Button size
   */
  size?: "default" | "sm" | "lg" | "icon";
}

/**
 * DevModeToggle - Main entry point for all dev mode utilities
 *
 * Features:
 * - Annotations (view list, inspect components)
 * - I18n utilities (view dirty translations, export)
 *
 * @example
 * ```tsx
 * <DevModeToggle variant="outline" size="icon" />
 * ```
 */
export function DevModeToggle({ variant = "outline", size = "icon" }: DevModeToggleProps) {
  // Annotation state
  const [annotationListOpen, setAnnotationListOpen] = useState(false);
  const [annotationFormOpen, setAnnotationFormOpen] = useState(false);
  const [inspectorActive, setInspectorActive] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<ComponentInfo | null>(null);

  // I18n state (placeholder for now)
  const [i18nListOpen, setI18nListOpen] = useState(false);

  const handleInspectClick = () => {
    setInspectorActive(true);
  };

  const handleComponentSelect = (info: ComponentInfo) => {
    setSelectedComponent(info);
    setInspectorActive(false);
    setAnnotationFormOpen(true);
  };

  const handleI18nClick = () => {
    setI18nListOpen(true);
  };

  if (!isDevUtilsEnabled()) {
    return null; // Only show when dev utils are enabled
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size={size} title="Dev Mode Utilities">
            <Code2 className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Dev Mode</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Annotations Section */}
          <DropdownMenuLabel className="text-xs text-muted-foreground font-normal px-2">
            Annotations
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setAnnotationListOpen(true)}>
            <List className="mr-2 h-4 w-4" />
            View Annotations
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleInspectClick}>
            <MousePointer2 className="mr-2 h-4 w-4" />
            Inspect Component
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* I18n Section */}
          <DropdownMenuLabel className="text-xs text-muted-foreground font-normal px-2">
            Internationalization
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={handleI18nClick}>
            <Languages className="mr-2 h-4 w-4" />
            View Translations
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Global Component Inspector */}
      <ComponentInspector
        active={inspectorActive}
        onToggle={setInspectorActive}
        onComponentSelect={handleComponentSelect}
      />

      {/* Annotation List (Right Side Sheet) */}
      <AnnotationListSheet open={annotationListOpen} onOpenChange={setAnnotationListOpen} />

      {/* Annotation Form (Bottom Sheet) */}
      <AnnotationFormSheet
        open={annotationFormOpen}
        onOpenChange={setAnnotationFormOpen}
        selectedComponent={selectedComponent}
      />

      {/* I18n List Sheet (placeholder - to be implemented) */}
      {i18nListOpen && <div>I18n translations sheet - to be implemented</div>}
    </>
  );
}
