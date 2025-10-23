/**
 * ModelShowcase - 3D Model Carousel/Switcher
 *
 * Provides a tabbed interface to switch between different 3D models
 * with smooth fade transitions.
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThreeCanvas } from "./ThreeCanvas";
import { DesktopPCModel } from "./DesktopPCModel";
import { PlanetModel } from "./PlanetModel";
import { StarsBackground } from "./StarsBackground";
import { useResponsiveCanvas } from "./hooks/useResponsiveCanvas";

export type ModelType = "desktop" | "planet";

export interface ModelShowcaseProps {
  /** Initial model to display (default: "desktop") */
  defaultModel?: ModelType;
  /** Show Stars background (default: true) */
  showStars?: boolean;
  /** Custom className for container */
  className?: string;
}

const models: Record<ModelType, { label: string; camera: any }> = {
  desktop: {
    label: "Desktop PC",
    camera: { position: [20, 3, 5], fov: 25 },
  },
  planet: {
    label: "Planet Earth",
    camera: { position: [-4, 3, 6], fov: 45, near: 0.1, far: 200 },
  },
};

/**
 * ModelShowcase Component
 *
 * Renders a tabbed selector with 3D models. User can switch between
 * Desktop PC and Planet Earth visualizations.
 *
 * @example
 * ```tsx
 * <ModelShowcase defaultModel="planet" />
 * ```
 */
export function ModelShowcase({
  defaultModel = "desktop",
  showStars = true,
  className = "",
}: ModelShowcaseProps) {
  const [activeModel, setActiveModel] = useState<ModelType>(defaultModel);
  const { isMobile } = useResponsiveCanvas();

  const currentCamera = models[activeModel].camera;

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Model Tabs */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {(Object.keys(models) as ModelType[]).map(modelKey => (
          <button
            key={modelKey}
            onClick={() => setActiveModel(modelKey)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium
              transition-all duration-300
              ${
                activeModel === modelKey
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/50"
                  : "bg-background/70 text-muted-foreground hover:bg-accent hover:text-accent-foreground backdrop-blur-sm"
              }
            `}
          >
            {models[modelKey].label}
          </button>
        ))}
      </div>

      {/* 3D Canvas */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeModel}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full"
        >
          <ThreeCanvas camera={currentCamera}>
            {showStars && <StarsBackground />}

            {activeModel === "desktop" && <DesktopPCModel isMobile={isMobile} />}
            {activeModel === "planet" && <PlanetModel />}
          </ThreeCanvas>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
