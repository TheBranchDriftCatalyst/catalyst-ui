import type { Meta, StoryObj } from "@storybook/react";
import { Timeline, TimelineItem } from "./Timeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/catalyst-ui/ui/card";

const meta = {
  title: "Components/Timeline",
  component: Timeline,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Timeline>
      <TimelineItem
        date="2024"
        title="Senior Engineer"
        company="Tech Corp"
        achievements={["Led team of 5", "Shipped 3 products"]}
      />
      <TimelineItem
        date="2022 - 2024"
        title="Mid-Level Developer"
        company="StartUp Inc"
        description="Full stack development on customer platform"
      />
      <TimelineItem
        date="2020 - 2022"
        title="Junior Developer"
        company="Dev Agency"
        isLast
      />
    </Timeline>
  ),
};

export const WithAchievements: Story = {
  render: () => (
    <Timeline>
      <TimelineItem
        date="2023 - Present"
        title="Senior Engineer Quest"
        company="Catalyst Technologies"
        achievements={[
          "Led development of component library with 50+ components",
          "Reduced bundle size by 40% through code splitting",
          "Mentored 5 junior developers to mid-level",
          "Implemented CI/CD pipeline reducing deployment time by 80%",
        ]}
      />
      <TimelineItem
        date="2021 - 2023"
        title="Mid-Level Developer Journey"
        company="Tech Innovations Inc"
        achievements={[
          "Built real-time dashboard serving 10k+ users",
          "Implemented GraphQL API reducing response times 60%",
          "Achieved 95% test coverage on critical paths",
        ]}
        isLast
      />
    </Timeline>
  ),
};

export const InCard: Story = {
  render: () => (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Quest Log</CardTitle>
      </CardHeader>
      <CardContent>
        <Timeline>
          <TimelineItem
            date="2024"
            title="Epic Boss Battle: Migration to Microservices"
            company="Cloud Systems Ltd"
            achievements={[
              "Orchestrated migration of monolith to 12 microservices",
              "Zero downtime deployment achieved",
              "System reliability improved to 99.99%",
            ]}
          />
          <TimelineItem
            date="2023"
            title="Side Quest: Open Source Contribution"
            company="Community Projects"
            achievements={[
              "Contributed to React core library",
              "Fixed 15 critical bugs in popular packages",
              "Became maintainer of TypeScript utils library",
            ]}
          />
          <TimelineItem
            date="2022"
            title="Training Montage: Learning New Skills"
            company="Self-Directed"
            description="Intensive learning period focusing on cloud architecture and DevOps practices"
            isLast
          />
        </Timeline>
      </CardContent>
    </Card>
  ),
};

export const MinimalTimeline: Story = {
  render: () => (
    <Timeline>
      <TimelineItem date="2024" title="Senior Developer" />
      <TimelineItem date="2022" title="Mid-Level Developer" />
      <TimelineItem date="2020" title="Junior Developer" isLast />
    </Timeline>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <Timeline>
      <TimelineItem
        date="2024"
        title="Technical Lead"
        company="Innovation Labs"
        description="Leading a cross-functional team of 8 developers, designers, and product managers to build next-generation SaaS platform"
        achievements={[
          "Architected scalable microservices infrastructure",
          "Established engineering best practices and code review culture",
        ]}
      />
      <TimelineItem
        date="2022 - 2024"
        title="Full Stack Engineer"
        company="Growth Startup"
        description="Core team member building MVP and scaling to 50k users"
        isLast
      />
    </Timeline>
  ),
};
