import JsonTreeView from "@/catalyst-ui/components/ForceGraph/components/JsonTreeView";
import { THEME_NAMES } from "@/catalyst-ui/contexts/Theme/registry";

export function JsonTreeViewDemo() {
  return (
    <JsonTreeView
      data={{
        name: "catalyst-ui",
        version: "0.2.0",
        type: "library",
        features: {
          components: ["ForceGraph", "CodeBlock", "JsonTreeView"],
          themes: [...THEME_NAMES],
          ui_primitives: ["button", "dialog", "tooltip", "dropdown-menu", "toast"],
        },
        config: {
          storybook: true,
          typescript: true,
          tailwind_version: "v4",
        },
        stats: {
          components_count: 15,
          stories_count: 12,
          themes_count: THEME_NAMES.length,
        },
      }}
      rootName="package"
      initialExpanded={["package", "package.features"]}
    />
  );
}
