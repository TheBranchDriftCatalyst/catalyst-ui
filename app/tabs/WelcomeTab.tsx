/**
 * WelcomeTab - Synthwave Welcome Page
 *
 * Features a hero section with interactive 3D models and a Twitter-style
 * updates feed showcasing recent activities.
 */

import React from "react";
import { motion } from "framer-motion";
import { ThreeCanvas, StarsBackground, DesktopPCModel } from "@/catalyst-ui/components/ThreeJS";
import {
  textVariant,
  fadeIn,
  staggerContainer,
} from "@/catalyst-ui/components/ThreeJS/utils/motion";
import { Button } from "@/catalyst-ui/ui/button";
import { Card, CardContent } from "@/catalyst-ui/ui/card";
import { Badge } from "@/catalyst-ui/ui/badge";
import { ExternalLink, Github } from "lucide-react";

interface Update {
  id: string;
  category: "Reading" | "Building" | "Learning" | "Favorite" | "Update";
  icon: string;
  content: string;
  link?: string;
  timestamp: string;
}

const mockUpdates: Update[] = [
  {
    id: "1",
    category: "Reading",
    icon: "📚",
    content: "Diving into Three.js Journey by Bruno Simon",
    link: "https://threejs-journey.com",
    timestamp: "2h ago",
  },
  {
    id: "2",
    category: "Building",
    icon: "🚀",
    content: "Shipped RBMK reactor physics simulation with realistic neutron dynamics",
    timestamp: "5h ago",
  },
  {
    id: "3",
    category: "Favorite",
    icon: "🎨",
    content: "Obsessed with synthwave aesthetics lately - neon cyan and purple everywhere",
    timestamp: "1d ago",
  },
  {
    id: "4",
    category: "Learning",
    icon: "💡",
    content: "Exploring shader programming and GLSL for custom visual effects",
    link: "https://www.shadertoy.com",
    timestamp: "2d ago",
  },
  {
    id: "5",
    category: "Update",
    icon: "🔧",
    content: "Added paper trading app to component library with real-time stock quotes",
    timestamp: "3d ago",
  },
  {
    id: "6",
    category: "Building",
    icon: "🌟",
    content: "Porting Three.js visualizers from portfolio into reusable components",
    timestamp: "4d ago",
  },
];

const categoryColors: Record<Update["category"], string> = {
  Reading: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  Building: "bg-green-500/10 text-green-500 border-green-500/30",
  Learning: "bg-purple-500/10 text-purple-500 border-purple-500/30",
  Favorite: "bg-pink-500/10 text-pink-500 border-pink-500/30",
  Update: "bg-cyan-500/10 text-cyan-500 border-cyan-500/30",
};

// Tab metadata - make this the landing page
export const TAB_ORDER = -1;
export const TAB_SECTION = "home";
export const TAB_LABEL = "Welcome";

export function WelcomeTab() {
  const handleNavigateToComponents = () => {
    // Navigate to Overview tab (main catalyst-ui showcase)
    window.location.hash = "#/overview";
  };

  const handleGitHub = () => {
    window.open("https://github.com/TheBranchDriftCatalyst/catalyst-ui", "_blank");
  };

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Hero Section with 3D Model */}
      <section className="relative w-full h-screen">
        {/* 3D Scene - Composed from isolated components */}
        <div className="absolute inset-0 z-0">
          <ThreeCanvas camera={{ position: [20, 3, 5], fov: 25 }}>
            <DesktopPCModel />
          </ThreeCanvas>
        </div>

        {/* Hero Content Overlay */}
        <motion.div
          variants={staggerContainer(0.1, 0.1)}
          initial="hidden"
          animate="show"
          className="relative z-10 h-full flex flex-col items-center justify-start pt-24 md:pt-32 px-6 text-center pointer-events-none"
        >
          {/* Title */}
          <motion.h1
            variants={textVariant(0)}
            className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
            style={{
              filter: "drop-shadow(0 0 30px rgba(0, 252, 214, 0.3))",
            }}
          >
            catalyst-ui
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeIn("up", "spring", 0.2, 1)}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl"
          >
            Synthwave Component Library
            <br />
            <span className="text-primary">React • TypeScript • Radix UI • Tailwind</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeIn("up", "spring", 0.4, 1)}
            className="flex flex-wrap gap-4 justify-center pointer-events-auto"
          >
            <Button
              size="lg"
              onClick={handleNavigateToComponents}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/50 hover:shadow-xl hover:shadow-primary/60 transition-all"
            >
              Explore Components
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={handleGitHub}
              className="border-border hover:border-primary hover:text-primary transition-all"
            >
              <Github className="mr-2 h-4 w-4" />
              View on GitHub
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Updates Feed Section */}
      <section className="relative py-20 px-6 bg-gradient-to-b from-background to-background/50">
        <div className="max-w-4xl mx-auto">
          {/* Section Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Latest Updates
            </h2>
            <p className="text-muted-foreground">What I'm building, reading, and learning</p>
          </motion.div>

          {/* Update Cards */}
          <motion.div
            variants={staggerContainer(0.1, 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="space-y-4"
          >
            {mockUpdates.map((update, index) => (
              <motion.div key={update.id} variants={fadeIn("up", "spring", index * 0.1, 0.75)}>
                <Card className="group border-border hover:border-primary/50 transition-all duration-300 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="text-3xl">{update.icon}</div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Category Badge */}
                        <Badge
                          variant="outline"
                          className={`mb-2 ${categoryColors[update.category]}`}
                        >
                          {update.category}
                        </Badge>

                        {/* Update Text */}
                        <p className="text-foreground mb-2">
                          {update.content}
                          {update.link && (
                            <a
                              href={update.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center ml-2 text-primary hover:text-primary/80 transition-colors"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </p>

                        {/* Timestamp */}
                        <p className="text-sm text-muted-foreground">{update.timestamp}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
