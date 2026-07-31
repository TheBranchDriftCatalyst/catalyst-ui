import type { Meta, StoryObj } from "@storybook/react";
import { LogViewer, type LogViewerLine } from "./LogViewer";

const meta = {
  title: "Components/LogViewer",
  component: LogViewer,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof LogViewer>;
export default meta;
type Story = StoryObj<typeof meta>;

const seed: LogViewerLine[] = [
  { id: 1, ts: "2026-07-31T20:00:00Z", level: "info", message: "boot: starting import worker" },
  {
    id: 2,
    ts: "2026-07-31T20:00:01Z",
    level: "debug",
    message: "fetching /users/current/heartbeats since 2020-01-01",
    attrs: { pages: "42" },
  },
  {
    id: 3,
    ts: "2026-07-31T20:00:03Z",
    level: "warn",
    message: "wakatime rate-limit hit — backing off 30s",
  },
  {
    id: 4,
    ts: "2026-07-31T20:00:35Z",
    level: "info",
    message: "resumed; 12,441 heartbeats inserted",
  },
  {
    id: 5,
    ts: "2026-07-31T20:00:36Z",
    level: "error",
    message: "failed to persist row 12,442",
    attrs: { code: "23505", sender: "panda" },
  },
];

export const Default: Story = { args: { logs: seed } };

export const Empty: Story = {
  args: { logs: [], emptyText: "Import not started — click RUN to begin" },
};

export const CustomLevelColors: Story = {
  args: {
    logs: [
      { id: 1, ts: "12:00:00", level: "trace", message: "trace line" },
      { id: 2, ts: "12:00:01", level: "notice", message: "notice line" },
      { id: 3, ts: "12:00:02", level: "info", message: "info line (default palette)" },
    ],
    levelColors: {
      trace: "text-cyan-500",
      notice: "text-purple-400",
    },
  },
};

export const Tall: Story = {
  args: {
    logs: Array.from({ length: 40 }, (_, i) => ({
      id: i + 1,
      ts: `12:${String(i).padStart(2, "0")}:00`,
      level: i % 7 === 0 ? "warn" : "info",
      message: `entry #${i + 1}: processed batch of 500`,
    })),
    height: "h-[32rem]",
  },
};
