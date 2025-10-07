import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/catalyst-ui/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/catalyst-ui/ui/avatar";
import { StatBar } from "@/catalyst-ui/components/StatBar/StatBar";
import { Timeline, TimelineItem } from "@/catalyst-ui/components/Timeline/Timeline";
import { cn } from "@/catalyst-ui/utils";
import { ExportButton } from "./ExportButton";
import "./print.css";

// Helper to generate shields.io badge URLs using proper API format
// Docs: https://shields.io/docs/static-badges
function generateShieldBadge(skill: string, color: string = "4338ca"): string {
  // Format: https://img.shields.io/badge/{message}-{color}?style={style}
  // Or: https://img.shields.io/badge/{label}-{message}-{color}?style={style}

  // Replace spaces with underscores, then encode special characters (e.g., C#, C++)
  const message = skill.replace(/\s+/g, "_");
  const encodedMessage = encodeURIComponent(message);

  // Use flat-square style for a clean, modern look
  return `https://img.shields.io/badge/${encodedMessage}-${color}?style=flat-square&labelColor=333&logoColor=white`;
}

// Skill-specific badge colors (based on common tech stack)
const SKILL_COLORS: Record<string, string> = {
  // Frontend
  React: "61DAFB",
  Vue: "4FC08D",
  Angular: "DD0031",
  TypeScript: "3178C6",
  JavaScript: "F7DF1E",
  HTML: "E34F26",
  CSS: "1572B6",
  TailwindCSS: "06B6D4",
  "Tailwind CSS": "06B6D4",

  // Backend
  "Node.js": "339933",
  Python: "3776AB",
  Go: "00ADD8",
  Rust: "000000",
  Java: "007396",
  "C#": "239120",
  PHP: "777BB4",
  Ruby: "CC342D",

  // Databases
  PostgreSQL: "4169E1",
  MongoDB: "47A248",
  Redis: "DC382D",
  MySQL: "4479A1",

  // DevOps & Cloud
  Docker: "2496ED",
  Kubernetes: "326CE5",
  AWS: "232F3E",
  Azure: "0078D4",
  GCP: "4285F4",

  // Tools
  Git: "F05032",
  GraphQL: "E10098",
  Jest: "C21325",
  Playwright: "2EAD33",
  Storybook: "FF4785",
  "CI/CD": "2088FF",

  // Default fallback
  default: "4338ca",
};

function getSkillColor(skill: string): string {
  return SKILL_COLORS[skill] || SKILL_COLORS.default;
}

// JSON Resume compatible types (enhanced with RPG elements)
export interface CharacterSheetData {
  profile: {
    name: string;
    title: string; // Can include "level" like "Senior Developer · Level 85"
    avatar?: string;
    bio?: string;
    email?: string;
    location?: string;
    website?: string;
    githubUsername?: string; // GitHub username for stats integration
  };
  stats: Array<{
    label: string;
    value: number;
    max?: number;
  }>;
  skills: string[];
  timeline: Array<{
    date: string;
    title: string;
    company?: string;
    description?: string;
    achievements?: string[];
  }>;
}

export interface CharacterSheetResumeProps {
  data: CharacterSheetData;
  className?: string;
  /** Show contact information */
  showContact?: boolean;
  /** Custom section titles */
  sectionTitles?: {
    stats?: string;
    skills?: string;
    timeline?: string;
  };
  /** Show export button */
  showExport?: boolean;
  /** File name for exports */
  fileName?: string;
}

export function CharacterSheetResume({
  data,
  className,
  showContact = false,
  sectionTitles = {
    stats: "Core Stats",
    skills: "Skills & Abilities",
    timeline: "Quest Log",
  },
  showExport = true,
  fileName = "character-sheet-resume",
}: CharacterSheetResumeProps) {
  const { profile, stats, skills, timeline } = data;
  const contentRef = useRef<HTMLDivElement>(null);

  const initials = profile.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  return (
    <>
      {/* Export Button */}
      {showExport && (
        <div className="flex justify-end mb-4 export-button">
          <ExportButton contentRef={contentRef} fileName={fileName} />
        </div>
      )}

      {/* Resume Content */}
      <div
        ref={contentRef}
        className={cn("space-y-4 print-content print-resume-content", className)}
      >
        {/* Profile Card - Multi-column layout */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-[auto_1fr] gap-6 items-start">
              {/* Large Avatar */}
              <Avatar className="h-32 w-32 md:h-40 md:w-40 ring-4 ring-primary/20 shadow-lg">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback className="text-3xl md:text-4xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              {/* Profile Info */}
              <div className="space-y-3">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">{profile.name}</h2>
                  <p className="text-base md:text-lg text-primary font-semibold mt-1">
                    {profile.title}
                  </p>
                </div>

                {profile.bio && (
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {profile.bio}
                  </p>
                )}

                {showContact && (
                  <div className="flex flex-wrap gap-4 pt-2 text-sm text-muted-foreground">
                    {profile.email && <span>📧 {profile.email}</span>}
                    {profile.location && <span>📍 {profile.location}</span>}
                    {profile.website && (
                      <a
                        href={profile.website}
                        className="hover:text-primary transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        🔗 {profile.website}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GitHub Stats Card */}
        {profile.githubUsername && (
          <Card>
            <CardHeader>
              <CardTitle>GitHub Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {/* GitHub Stats */}
                <img
                  src={`https://github-readme-stats.vercel.app/api?username=${profile.githubUsername}&show_icons=true&theme=transparent&hide_border=true&title_color=8b5cf6&icon_color=8b5cf6&text_color=6b7280&bg_color=00000000`}
                  alt="GitHub Stats"
                  className="w-full"
                  loading="lazy"
                />
                {/* GitHub Streak */}
                <img
                  src={`https://github-readme-streak-stats.herokuapp.com/?user=${profile.githubUsername}&theme=transparent&hide_border=true&ring=8b5cf6&fire=8b5cf6&currStreakLabel=8b5cf6&background=00000000`}
                  alt="GitHub Streak"
                  className="w-full"
                  loading="lazy"
                />
              </div>
              {/* Top Languages */}
              <div className="mt-4">
                <img
                  src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${profile.githubUsername}&layout=compact&theme=transparent&hide_border=true&title_color=8b5cf6&text_color=6b7280&bg_color=00000000`}
                  alt="Top Languages"
                  className="w-full max-w-md"
                  loading="lazy"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Card - Compact with labels */}
        {stats.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{sectionTitles.stats}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat, i) => (
                  <StatBar
                    key={i}
                    label={stat.label}
                    value={stat.value}
                    max={stat.max}
                    useLabels={true}
                    className="text-xs"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Skills Card - shields.io badges with tech-specific colors */}
        {skills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{sectionTitles.skills}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <img
                    key={i}
                    src={generateShieldBadge(skill, getSkillColor(skill))}
                    alt={skill}
                    className="h-5 transition-transform hover:scale-105"
                    loading="lazy"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Timeline Card */}
        {timeline.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{sectionTitles.timeline}</CardTitle>
            </CardHeader>
            <CardContent>
              <Timeline>
                {timeline.map((item, i) => (
                  <TimelineItem
                    key={i}
                    date={item.date}
                    title={item.title}
                    company={item.company}
                    description={item.description}
                    achievements={item.achievements}
                    isLast={i === timeline.length - 1}
                  />
                ))}
              </Timeline>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}

// Helper function to convert JSON Resume format to CharacterSheetData
export function fromJsonResume(jsonResume: any): CharacterSheetData {
  const { basics, work, skills: jsonSkills } = jsonResume;

  return {
    profile: {
      name: basics?.name || "Anonymous",
      title: basics?.label || "Professional",
      avatar: basics?.image || basics?.picture,
      bio: basics?.summary,
      email: basics?.email,
      location: basics?.location?.city
        ? `${basics.location.city}, ${basics.location.countryCode || ""}`
        : undefined,
      website: basics?.url || basics?.website,
    },
    stats: jsonSkills
      ? jsonSkills.slice(0, 6).map((skill: any) => ({
          label: skill.name,
          value: skill.level ? (typeof skill.level === "number" ? skill.level : 75) : 75,
          max: 100,
        }))
      : [],
    skills: jsonSkills ? jsonSkills.map((s: any) => s.name) : [],
    timeline:
      work?.map((job: any) => ({
        date: `${job.startDate || ""} - ${job.endDate || "Present"}`,
        title: job.position || "Position",
        company: job.name || job.company,
        description: job.summary,
        achievements: job.highlights || [],
      })) || [],
  };
}
