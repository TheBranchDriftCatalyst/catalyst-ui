import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/catalyst-ui/ui/card";
import { CodeFlipCard } from "@/catalyst-ui/components/CodeFlipCard";
import {
  CharacterSheetResume,
  CharacterSheetData,
} from "@/catalyst-ui/cards/CharacterSheetResume/CharacterSheetResume";
import { ScrollSnapItem } from "@/catalyst-ui/effects";
import { ImportFooter } from "@/catalyst-ui/components/CodeFlipCard/ImportFooter";
import CharacterSheetResumeSource from "@/catalyst-ui/cards/CharacterSheetResume/CharacterSheetResume.tsx?raw";

const demoData: CharacterSheetData = {
  profile: {
    name: "Alex Catalyst",
    title: "Full Stack Wizard · Level 85",
    bio: "Legendary developer specializing in slaying bugs and crafting elegant solutions. Master of the React arts and TypeScript sorcery.",
    githubUsername: "torvalds",
  },
  stats: [
    { label: "React", value: 92, max: 100 },
    { label: "TypeScript", value: 88, max: 100 },
    { label: "Node.js", value: 85, max: 100 },
    { label: "GraphQL", value: 78, max: 100 },
    { label: "DevOps", value: 72, max: 100 },
    { label: "UI/UX", value: 90, max: 100 },
  ],
  skills: [
    "React",
    "TypeScript",
    "Node.js",
    "GraphQL",
    "Docker",
    "AWS",
    "PostgreSQL",
    "Redis",
    "Git",
    "CI/CD",
    "TailwindCSS",
    "Storybook",
    "Jest",
    "Playwright",
  ],
  timeline: [
    {
      date: "2023 - Present",
      title: "Senior Engineer Quest",
      company: "Catalyst Technologies",
      achievements: [
        "Led development of component library with 50+ components",
        "Reduced bundle size by 40% through code splitting",
        "Mentored 5 junior developers to mid-level",
      ],
    },
    {
      date: "2021 - 2023",
      title: "Mid-Level Developer Journey",
      company: "Tech Innovations Inc",
      achievements: [
        "Built real-time dashboard serving 10k+ users",
        "Implemented GraphQL API reducing response times 60%",
        "Achieved 95% test coverage on critical paths",
      ],
    },
    {
      date: "2019 - 2021",
      title: "Junior Developer Training",
      company: "StartUp Labs",
      achievements: [
        "Developed 15+ client projects from concept to deployment",
        "Mastered React ecosystem and modern tooling",
        "Earned AWS Solutions Architect certification",
      ],
    },
  ],
};

const gameDevData: CharacterSheetData = {
  profile: {
    name: "Game Dev Pro",
    title: "Unity Wizard · Level 99",
    bio: "Crafting immersive gaming experiences and interactive worlds with cutting-edge technology.",
  },
  stats: [
    { label: "Unity Mastery", value: 98, max: 100 },
    { label: "C# Power", value: 92, max: 100 },
    { label: "3D Math Intelligence", value: 88, max: 100 },
    { label: "Shader Magic", value: 75, max: 100 },
  ],
  skills: [
    "Unity",
    "C#",
    "Blender",
    "Shaders",
    "Physics",
    "Networking",
    "VR",
    "AR",
    "Optimization",
  ],
  timeline: [
    {
      date: "2022 - Present",
      title: "Lead Game Developer Quest",
      company: "Epic Game Studios",
      achievements: [
        "Shipped AAA title with 1M+ downloads",
        "Optimized frame rate from 30fps to 144fps",
        "Implemented multiplayer netcode for 64 players",
      ],
    },
    {
      date: "2020 - 2022",
      title: "Mid-Level Game Dev Journey",
      company: "Indie Game Collective",
      achievements: [
        "Published 3 indie games on Steam",
        "Won Best Visuals award at Indie Game Festival",
        "Built procedural generation system",
      ],
    },
  ],
};

export function ResumeTab() {
  return (
    <div className="space-y-4 mt-0">
      {/* Introduction */}
      <ScrollSnapItem align="start">
        <Card>
          <CardHeader>
            <CardTitle>Character Sheet Resume</CardTitle>
            <CardDescription>
              Transform your resume into an RPG character sheet • Stats for skills, quest log for
              work history, and JSON Resume compatible
            </CardDescription>
          </CardHeader>
        </Card>
      </ScrollSnapItem>

      {/* Full Character Sheet */}
      <ScrollSnapItem align="start">
        <Card>
          <CardHeader>
            <CardTitle>Full Stack Developer Character</CardTitle>
            <CardDescription>
              Complete resume with profile, stats, skills, and timeline • Click to view source
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CodeFlipCard
              sourceCode={CharacterSheetResumeSource}
              fileName="CharacterSheetResume.tsx"
              language="tsx"
              stripImports={true}
            >
              <CharacterSheetResume data={demoData} />
            </CodeFlipCard>
          </CardContent>
          <ImportFooter sourceCode={CharacterSheetResumeSource} />
        </Card>
      </ScrollSnapItem>

      {/* Game Dev Character */}
      <ScrollSnapItem align="start">
        <Card>
          <CardHeader>
            <CardTitle>Game Developer Character</CardTitle>
            <CardDescription>
              RPG-themed resume for game development role • Different stats and achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CodeFlipCard
              sourceCode={CharacterSheetResumeSource}
              fileName="CharacterSheetResume.tsx"
              language="tsx"
              stripImports={true}
            >
              <CharacterSheetResume data={gameDevData} />
            </CodeFlipCard>
          </CardContent>
        </Card>
      </ScrollSnapItem>

      {/* JSON Resume Support */}
      <ScrollSnapItem align="start">
        <Card>
          <CardHeader>
            <CardTitle>JSON Resume Compatible</CardTitle>
            <CardDescription>
              Convert standard JSON Resume format to character sheet • Use{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">fromJsonResume()</code> helper
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <pre className="text-xs overflow-x-auto">
                <code>{`import { CharacterSheetResume, fromJsonResume } from '@/catalyst-ui';

const jsonResume = {
  basics: {
    name: "John Doe",
    label: "Software Engineer",
    summary: "Building great software",
    // ... standard JSON Resume format
  },
  work: [/* work history */],
  skills: [/* skills array */]
};

<CharacterSheetResume
  data={fromJsonResume(jsonResume)}
/>`}</code>
              </pre>
            </div>
            <p className="text-sm text-muted-foreground">
              The <code className="bg-muted px-1 py-0.5 rounded">fromJsonResume()</code> helper
              automatically maps JSON Resume fields to character sheet format, including profile
              info, skills as stats, and work history as quest log.
            </p>
          </CardContent>
        </Card>
      </ScrollSnapItem>
    </div>
  );
}
