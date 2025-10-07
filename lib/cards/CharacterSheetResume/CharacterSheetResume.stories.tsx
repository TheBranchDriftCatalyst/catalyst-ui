import type { Meta, StoryObj } from "@storybook/react";
import { CharacterSheetResume, CharacterSheetData, fromJsonResume } from "./CharacterSheetResume";

const meta = {
  title: "Cards/CharacterSheetResume",
  component: CharacterSheetResume,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CharacterSheetResume>;

export default meta;
type Story = StoryObj<typeof meta>;

const fullData: CharacterSheetData = {
  profile: {
    name: "Alex Catalyst",
    title: "Full Stack Wizard · Level 85",
    bio: "Legendary developer specializing in slaying bugs and crafting elegant solutions. Master of the React arts and TypeScript sorcery.",
    email: "alex@catalyst.dev",
    location: "San Francisco, CA",
    website: "https://alexcatalyst.dev",
  },
  stats: [
    { label: "React Mastery", value: 92, max: 100 },
    { label: "TypeScript Power", value: 88, max: 100 },
    { label: "Node.js Strength", value: 85, max: 100 },
    { label: "GraphQL Intelligence", value: 78, max: 100 },
    { label: "DevOps Endurance", value: 72, max: 100 },
    { label: "UI/UX Charisma", value: 90, max: 100 },
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

export const Default: Story = {
  args: {
    data: fullData,
  },
};

export const WithContactInfo: Story = {
  args: {
    data: fullData,
    showContact: true,
  },
};

export const MinimalResume: Story = {
  args: {
    data: {
      profile: {
        name: "Jane Developer",
        title: "Frontend Engineer",
        bio: "Building beautiful user interfaces",
      },
      stats: [
        { label: "React", value: 85 },
        { label: "TypeScript", value: 78 },
      ],
      skills: ["React", "TypeScript", "CSS", "Git"],
      timeline: [
        {
          date: "2023",
          title: "Frontend Developer",
          company: "Tech Startup",
          achievements: ["Built component library"],
        },
      ],
    },
  },
};

export const GameDevResume: Story = {
  args: {
    data: {
      profile: {
        name: "Game Dev Pro",
        title: "Unity Wizard · Level 99",
        bio: "Crafting immersive gaming experiences and interactive worlds",
      },
      stats: [
        { label: "Unity Mastery", value: 98 },
        { label: "C# Power", value: 92 },
        { label: "3D Math Intelligence", value: 88 },
        { label: "Shader Magic", value: 75 },
      ],
      skills: ["Unity", "C#", "Blender", "Shaders", "Physics", "Networking", "VR", "AR"],
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
      ],
    },
  },
};

export const BackendEngineer: Story = {
  args: {
    data: {
      profile: {
        name: "Database Warrior",
        title: "Backend Architect · Level 78",
        bio: "Taming distributed systems and orchestrating microservices",
      },
      stats: [
        { label: "System Design", value: 95 },
        { label: "Database Optimization", value: 90 },
        { label: "API Architecture", value: 88 },
        { label: "Cloud Infrastructure", value: 82 },
      ],
      skills: [
        "Node.js",
        "Python",
        "Go",
        "PostgreSQL",
        "MongoDB",
        "Redis",
        "Kafka",
        "Docker",
        "Kubernetes",
        "AWS",
        "Microservices",
      ],
      timeline: [
        {
          date: "2024",
          title: "Principal Engineer Quest",
          company: "Cloud Systems Inc",
          achievements: [
            "Architected microservices handling 100M requests/day",
            "Reduced infrastructure costs by 60%",
            "Led migration to Kubernetes",
          ],
        },
      ],
    },
  },
};

export const CustomTitles: Story = {
  args: {
    data: fullData,
    sectionTitles: {
      stats: "Technical Skills",
      skills: "Technologies",
      timeline: "Work Experience",
    },
  },
};

// Example of JSON Resume conversion
const jsonResumeData = {
  basics: {
    name: "JSON Resume User",
    label: "Software Developer",
    image: "",
    email: "user@example.com",
    summary: "Passionate developer with expertise in modern web technologies",
    location: {
      city: "Austin",
      countryCode: "US",
    },
    url: "https://example.com",
  },
  work: [
    {
      name: "Tech Company",
      position: "Senior Developer",
      startDate: "2022",
      endDate: "Present",
      summary: "Building scalable web applications",
      highlights: ["Led team of 4 developers", "Improved performance by 50%"],
    },
  ],
  skills: [
    { name: "JavaScript", level: 90 },
    { name: "React", level: 85 },
    { name: "Node.js", level: 80 },
  ],
};

export const FromJsonResume: Story = {
  args: {
    data: fromJsonResume(jsonResumeData),
    showContact: true,
  },
};

export const EmptySections: Story = {
  args: {
    data: {
      profile: {
        name: "New Graduate",
        title: "Aspiring Developer · Level 1",
        bio: "Ready to start the adventure!",
      },
      stats: [],
      skills: ["HTML", "CSS", "JavaScript"],
      timeline: [],
    },
  },
};
