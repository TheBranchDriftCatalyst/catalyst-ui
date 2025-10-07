"use client";

import { useState } from "react";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import { Button } from "@/catalyst-ui/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/catalyst-ui/ui/dropdown-menu";
import { Download, FileText, Image as ImageIcon } from "lucide-react";

export interface ExportButtonProps {
  contentRef: React.RefObject<HTMLDivElement | null>;
  fileName?: string;
}

export function ExportButton({
  contentRef,
  fileName = "resume",
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  // Wait for all images to load before exporting
  const waitForImages = async (element: HTMLElement): Promise<void> => {
    const images = Array.from(element.getElementsByTagName("img"));

    await Promise.all(
      images.map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete) {
              resolve();
            } else {
              img.onload = () => resolve();
              img.onerror = () => resolve(); // Resolve even on error to not block export
            }
          })
      )
    );

    // Additional wait to ensure rendering is complete
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  // PDF Export via print-to-PDF
  // TODO: Print functionality not working properly - needs investigation
  const handlePrintPDF = useReactToPrint({
    contentRef,
    documentTitle: fileName,
    onBeforePrint: async () => {
      setIsExporting(true);
      if (contentRef.current) {
        await waitForImages(contentRef.current);
      }
    },
    onAfterPrint: () => {
      setIsExporting(false);
    },
  });

  // PNG Export using html2canvas
  const handleExportPNG = async () => {
    if (!contentRef.current) return;

    setIsExporting(true);

    try {
      // Wait for all images to load
      await waitForImages(contentRef.current);

      // Capture the content as canvas
      const canvas = await html2canvas(contentRef.current, {
        scale: 2, // Higher quality
        useCORS: true, // Allow cross-origin images (shields.io badges)
        logging: false,
        backgroundColor: "#ffffff",
        width: 816, // 8.5 inches * 96 DPI
        height: 1056, // 11 inches * 96 DPI
        onclone: (clonedDoc) => {
          // Replace modern color functions (oklab, oklch) with fallback colors
          // html2canvas doesn't support these modern CSS color functions

          // Get all elements from both original and cloned documents
          const originalElements = contentRef.current?.querySelectorAll("*") || [];
          const clonedElements = clonedDoc.body.querySelectorAll("*");

          // Map computed styles from original to cloned elements
          originalElements.forEach((originalEl, index) => {
            if (clonedElements[index]) {
              const computedStyle = window.getComputedStyle(originalEl);
              const clonedEl = clonedElements[index] as HTMLElement;

              // Force computed colors as inline styles to override oklab
              clonedEl.style.color = computedStyle.color;
              clonedEl.style.backgroundColor = computedStyle.backgroundColor;
              clonedEl.style.borderColor = computedStyle.borderColor;
            }
          });
        },
      });

      // Convert to PNG and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${fileName}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, "image/png");
    } catch (error) {
      console.error("Failed to export PNG:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isExporting}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handlePrintPDF()}>
          <FileText className="mr-2 h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPNG}>
          <ImageIcon className="mr-2 h-4 w-4" />
          Export as PNG
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
