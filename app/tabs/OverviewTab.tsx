import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/catalyst-ui/ui/card";
import { Typography } from "@/catalyst-ui/ui/typography";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/catalyst-ui/ui/table";
import { ScrollSnapItem } from "@/catalyst-ui/effects";

import { EditableText } from "@/catalyst-ui/components/EditableText";

export const TAB_ORDER = 0;

export function OverviewTab() {
  return (
    <div className="space-y-4 mt-0">
      {/* Welcome Section */}
      <ScrollSnapItem align="start">
        <Card>
          <CardHeader>
            <CardTitle>
              <EditableText id="welcome_to_catalyst_ui" namespace="OverviewTab">
                Welcome to Catalyst UI 👋
              </EditableText>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Typography variant="lead" className="text-foreground/90">
              <EditableText
                id="hey_there_i_m_building_a_component_library_that_br"
                namespace="OverviewTab"
              >
                Hey there! I'm building a component library that brings together modern React
                patterns with a cybersynthpunk aesthetic. This is my playground for experimenting
                with UI primitives, data visualization, and developer experience.
              </EditableText>
            </Typography>
            <Typography variant="p" className="text-muted-foreground leading-relaxed">
              <strong>
                <EditableText id="what_you_ll_find_here" namespace="OverviewTab">
                  What you'll find here:
                </EditableText>
              </strong>
              <EditableText
                id="accessible_components_built_on_radix_ui_styled_wit"
                namespace="OverviewTab"
              >
                Accessible components built on Radix UI, styled with Tailwind v4, complete with
                interactive D3.js visualizations, multiple theme variants (from synthwave to
                nature-inspired palettes), and a robust development workflow powered by Storybook
                and Vite. Everything is TypeScript-first with form validation via React Hook Form +
                Zod.
              </EditableText>
            </Typography>
            <Typography variant="p" className="text-muted-foreground leading-relaxed">
              <strong>
                <EditableText id="why_i_built_this" namespace="OverviewTab">
                  Why I built this:
                </EditableText>
              </strong>
              <EditableText
                id="i_wanted_a_reusable_component_system_that_doesn_t_"
                namespace="OverviewTab"
              >
                I wanted a reusable component system that doesn't compromise on accessibility,
                performance, or aesthetics. This library is part of my larger catalyst-devspace
                monorepo where I explore infrastructure automation, Python utilities, and full-stack
                development patterns. It's open-source, constantly evolving, and built with
                real-world use cases in mind.
              </EditableText>
            </Typography>
            <Typography variant="muted" className="text-xs italic">
              <EditableText
                id="feel_free_to_explore_the_tabs_above_to_see_design_"
                namespace="OverviewTab"
              >
                Feel free to explore the tabs above to see design tokens, interactive cards, force
                graph visualizations, and more. The source code is available on GitHub if you want
                to dive deeper or contribute!
              </EditableText>
            </Typography>
          </CardContent>
        </Card>
      </ScrollSnapItem>
      {/* Features Highlight */}
      <ScrollSnapItem align="start">
        <Card>
          <CardHeader>
            <CardTitle>
              <EditableText id="key_features" namespace="OverviewTab">
                🚀 Key Features
              </EditableText>
            </CardTitle>
            <CardDescription>
              <EditableText id="what_makes_catalyst_ui_special" namespace="OverviewTab">
                What makes Catalyst UI special
              </EditableText>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Build & Performance */}
              <div className="space-y-3">
                <Typography variant="h4" className="font-semibold flex items-center gap-2">
                  <span className="text-primary">⚡</span>
                  <EditableText id="build_performance" namespace="OverviewTab">
                    Build & Performance
                  </EditableText>
                </Typography>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong>
                        <EditableText id="tree_shaking" namespace="OverviewTab">
                          Tree Shaking:
                        </EditableText>
                      </strong>
                      <EditableText
                        id="granular_es_module_exports_with_per_file_entry_poi"
                        namespace="OverviewTab"
                      >
                        Granular ES module exports with per-file entry points for minimal bundle
                        sizes
                      </EditableText>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong>
                        <EditableText id="css_code_splitting" namespace="OverviewTab">
                          CSS Code Splitting:
                        </EditableText>
                      </strong>
                      <EditableText
                        id="per_component_css_files_loaded_only_when_needed"
                        namespace="OverviewTab"
                      >
                        Per-component CSS files loaded only when needed
                      </EditableText>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong>
                        <EditableText id="source_maps" namespace="OverviewTab">
                          Source Maps:
                        </EditableText>
                      </strong>
                      <EditableText
                        id="debug_original_typescript_source_in_production_bui"
                        namespace="OverviewTab"
                      >
                        Debug original TypeScript source in production builds
                      </EditableText>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong>
                        <EditableText id="next_js_ready" namespace="OverviewTab">
                          Next.js Ready:
                        </EditableText>
                      </strong>
                      <EditableText
                        id="automatic_use_client_directive_preservation_for_ap"
                        namespace="OverviewTab"
                      >
                        Automatic "use client" directive preservation for App Router
                      </EditableText>
                    </span>
                  </li>
                </ul>
              </div>

              {/* Animation System */}
              <div className="space-y-3">
                <Typography variant="h4" className="font-semibold flex items-center gap-2">
                  <span className="text-primary">🎬</span>
                  <EditableText id="animation_system" namespace="OverviewTab">
                    Animation System
                  </EditableText>
                </Typography>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong>
                        <EditableText id="animation_hocs" namespace="OverviewTab">
                          Animation HOCs:
                        </EditableText>
                      </strong>
                      <EditableText
                        id="reusable_components_animatedflip_animatedfade_anim"
                        namespace="OverviewTab"
                      >
                        Reusable components (AnimatedFlip, AnimatedFade, AnimatedSlide,
                        AnimatedBounce)
                      </EditableText>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong>
                        <EditableText id="controlled_uncontrolled" namespace="OverviewTab">
                          Controlled/Uncontrolled:
                        </EditableText>
                      </strong>
                      <EditableText
                        id="both_modes_supported_with_onflipchange_callbacks"
                        namespace="OverviewTab"
                      >
                        Both modes supported with onFlipChange callbacks
                      </EditableText>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong>
                        <EditableText id="hardware_accelerated" namespace="OverviewTab">
                          Hardware Accelerated:
                        </EditableText>
                      </strong>
                      <EditableText
                        id="css_transforms_with_gpu_acceleration"
                        namespace="OverviewTab"
                      >
                        CSS transforms with GPU acceleration
                      </EditableText>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong>
                        <EditableText id="theme_animations" namespace="OverviewTab">
                          Theme Animations:
                        </EditableText>
                      </strong>
                      <EditableText
                        id="subtle_css_keyframes_glow_pulse_border_shimmer_for"
                        namespace="OverviewTab"
                      >
                        Subtle CSS keyframes (glow-pulse, border-shimmer) for cyberpunk aesthetic
                      </EditableText>
                    </span>
                  </li>
                </ul>
              </div>

              {/* Developer Experience */}
              <div className="space-y-3">
                <Typography variant="h4" className="font-semibold flex items-center gap-2">
                  <span className="text-primary">
                    <EditableText id="" namespace="OverviewTab">
                      🛠️
                    </EditableText>
                  </span>
                  <EditableText id="developer_experience" namespace="OverviewTab">
                    Developer Experience
                  </EditableText>
                </Typography>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong>
                        <EditableText id="codeflipcard" namespace="OverviewTab">
                          CodeFlipCard:
                        </EditableText>
                      </strong>
                      <EditableText
                        id="interactive_cards_that_flip_to_show_source_code_wi"
                        namespace="OverviewTab"
                      >
                        Interactive cards that flip to show source code with auto-import extraction
                      </EditableText>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong>
                        <EditableText id="import_footers" namespace="OverviewTab">
                          Import Footers:
                        </EditableText>
                      </strong>
                      <EditableText
                        id="auto_parsed_import_statements_from_source_code_no_"
                        namespace="OverviewTab"
                      >
                        Auto-parsed import statements from source code (no manual strings!)
                      </EditableText>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong>
                        <EditableText id="hot_module_replacement" namespace="OverviewTab">
                          Hot Module Replacement:
                        </EditableText>
                      </strong>
                      <EditableText id="lightning_fast_dev_with_vite_hmr" namespace="OverviewTab">
                        Lightning-fast dev with Vite HMR
                      </EditableText>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong>
                        <EditableText id="yarn_link_support" namespace="OverviewTab">
                          Yarn Link Support:
                        </EditableText>
                      </strong>
                      <EditableText
                        id="real_time_concurrent_development_with_auto_rebuild"
                        namespace="OverviewTab"
                      >
                        Real-time concurrent development with auto-rebuild
                      </EditableText>
                    </span>
                  </li>
                </ul>
              </div>

              {/* Theme System */}
              <div className="space-y-3">
                <Typography variant="h4" className="font-semibold flex items-center gap-2">
                  <span className="text-primary">🎨</span>
                  <EditableText id="theme_system" namespace="OverviewTab">
                    Theme System
                  </EditableText>
                </Typography>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong>
                        <EditableText id="7_themes" namespace="OverviewTab">
                          7 Themes:
                        </EditableText>
                      </strong>
                      <EditableText
                        id="catalyst_dracula_gold_laracon_nature_netflix_nord"
                        namespace="OverviewTab"
                      >
                        Catalyst, Dracula, Gold, Laracon, Nature, Netflix, Nord
                      </EditableText>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong>
                        <EditableText id="dark_light_variants" namespace="OverviewTab">
                          Dark/Light Variants:
                        </EditableText>
                      </strong>
                      <EditableText id="each_theme_supports_both_modes" namespace="OverviewTab">
                        Each theme supports both modes
                      </EditableText>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong>
                        <EditableText id="css_variables" namespace="OverviewTab">
                          CSS Variables:
                        </EditableText>
                      </strong>
                      <EditableText
                        id="full_customization_via_design_tokens"
                        namespace="OverviewTab"
                      >
                        Full customization via design tokens
                      </EditableText>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong>
                        <EditableText id="localstorage_persistence" namespace="OverviewTab">
                          LocalStorage Persistence:
                        </EditableText>
                      </strong>
                      <EditableText
                        id="theme_preferences_automatically_saved"
                        namespace="OverviewTab"
                      >
                        Theme preferences automatically saved
                      </EditableText>
                    </span>
                  </li>
                </ul>
              </div>

              {/* Data Visualization */}
              <div className="space-y-3">
                <Typography variant="h4" className="font-semibold flex items-center gap-2">
                  <span className="text-primary">📊</span>
                  <EditableText id="data_visualization" namespace="OverviewTab">
                    Data Visualization
                  </EditableText>
                </Typography>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong>
                        <EditableText id="forcegraph" namespace="OverviewTab">
                          ForceGraph:
                        </EditableText>
                      </strong>
                      <EditableText
                        id="enterprise_d3_js_wrapper_with_force_directed_dagre"
                        namespace="OverviewTab"
                      >
                        Enterprise D3.js wrapper with force-directed, Dagre, ELK layouts
                      </EditableText>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong>
                        <EditableText id="smart_edge_routing" namespace="OverviewTab">
                          Smart Edge Routing:
                        </EditableText>
                      </strong>
                      <EditableText
                        id="orthogonal_paths_with_collision_detection"
                        namespace="OverviewTab"
                      >
                        Orthogonal paths with collision detection
                      </EditableText>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong>
                        <EditableText id="position_persistence" namespace="OverviewTab">
                          Position Persistence:
                        </EditableText>
                      </strong>
                      <EditableText
                        id="remember_node_layouts_per_algorithm_type"
                        namespace="OverviewTab"
                      >
                        Remember node layouts per algorithm type
                      </EditableText>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong>
                        <EditableText id="performance" namespace="OverviewTab">
                          Performance:
                        </EditableText>
                      </strong>
                      <EditableText
                        id="memoized_enrichment_o_1_filters_for_100_node_graph"
                        namespace="OverviewTab"
                      >
                        Memoized enrichment, O(1) filters for 100+ node graphs
                      </EditableText>
                    </span>
                  </li>
                </ul>
              </div>

              {/* Advanced Components */}
              <div className="space-y-3">
                <Typography variant="h4" className="font-semibold flex items-center gap-2">
                  <span className="text-primary">🧩</span>
                  <EditableText id="advanced_components" namespace="OverviewTab">
                    Advanced Components
                  </EditableText>
                </Typography>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong>
                        <EditableText id="codeblock" namespace="OverviewTab">
                          CodeBlock:
                        </EditableText>
                      </strong>
                      <EditableText
                        id="shiki_powered_syntax_highlighting_with_editable_mo"
                        namespace="OverviewTab"
                      >
                        Shiki-powered syntax highlighting with editable mode
                      </EditableText>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong>
                        <EditableText id="jsontreeview" namespace="OverviewTab">
                          JsonTreeView:
                        </EditableText>
                      </strong>
                      <EditableText
                        id="collapsible_json_viewer_with_syntax_coloring"
                        namespace="OverviewTab"
                      >
                        Collapsible JSON viewer with syntax coloring
                      </EditableText>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong>
                        <EditableText id="toast_system" namespace="OverviewTab">
                          Toast System:
                        </EditableText>
                      </strong>
                      <EditableText
                        id="stack_up_to_5_toasts_with_6_animation_variants"
                        namespace="OverviewTab"
                      >
                        Stack up to 5 toasts with 6 animation variants
                      </EditableText>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong>
                        <EditableText id="smart_slider" namespace="OverviewTab">
                          Smart Slider:
                        </EditableText>
                      </strong>
                      <EditableText
                        id="inside_outside_labels_shapes_custom_text_mapping"
                        namespace="OverviewTab"
                      >
                        Inside/outside labels, shapes, custom text mapping
                      </EditableText>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollSnapItem>
      {/* Frameworks & Resources */}
      <ScrollSnapItem align="start">
        <Card>
          <CardHeader>
            <CardTitle>
              <EditableText id="frameworks_resources" namespace="OverviewTab">
                Frameworks & Resources
              </EditableText>
            </CardTitle>
            <CardDescription>
              <EditableText
                id="external_libraries_and_tools_powering_this_ui_libr"
                namespace="OverviewTab"
              >
                External libraries and tools powering this UI library
              </EditableText>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <EditableText id="framework" namespace="OverviewTab">
                      Framework
                    </EditableText>
                  </TableHead>
                  <TableHead>
                    <EditableText id="category" namespace="OverviewTab">
                      Category
                    </EditableText>
                  </TableHead>
                  <TableHead>
                    <EditableText id="description" namespace="OverviewTab">
                      Description
                    </EditableText>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="transition-colors hover:bg-accent/50">
                  <TableCell className="font-medium">
                    <a
                      href="https://react.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline transition-all"
                    >
                      <EditableText id="react" namespace="OverviewTab">
                        React
                      </EditableText>
                    </a>
                  </TableCell>
                  <TableCell>
                    <EditableText id="framework" namespace="OverviewTab">
                      Framework
                    </EditableText>
                  </TableCell>
                  <TableCell>
                    <EditableText
                      id="ui_library_for_building_component_based_interfaces"
                      namespace="OverviewTab"
                    >
                      UI library for building component-based interfaces
                    </EditableText>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a
                      href="https://www.radix-ui.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      <EditableText id="radix_ui" namespace="OverviewTab">
                        Radix UI
                      </EditableText>
                    </a>
                  </TableCell>
                  <TableCell>
                    <EditableText id="components" namespace="OverviewTab">
                      Components
                    </EditableText>
                  </TableCell>
                  <TableCell>
                    <EditableText
                      id="unstyled_accessible_component_primitives"
                      namespace="OverviewTab"
                    >
                      Unstyled, accessible component primitives
                    </EditableText>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a
                      href="https://tailwindcss.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      <EditableText id="tailwind_css" namespace="OverviewTab">
                        Tailwind CSS
                      </EditableText>
                    </a>
                  </TableCell>
                  <TableCell>
                    <EditableText id="styling" namespace="OverviewTab">
                      Styling
                    </EditableText>
                  </TableCell>
                  <TableCell>
                    <EditableText id="utility_first_css_framework_v4" namespace="OverviewTab">
                      Utility-first CSS framework (v4)
                    </EditableText>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a
                      href="https://ui.shadcn.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      <EditableText id="shadcn_ui" namespace="OverviewTab">
                        shadcn/ui
                      </EditableText>
                    </a>
                  </TableCell>
                  <TableCell>
                    <EditableText id="components" namespace="OverviewTab">
                      Components
                    </EditableText>
                  </TableCell>
                  <TableCell>
                    <EditableText id="component_patterns_and_design_system" namespace="OverviewTab">
                      Component patterns and design system
                    </EditableText>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a
                      href="https://react-hook-form.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      <EditableText id="react_hook_form" namespace="OverviewTab">
                        React Hook Form
                      </EditableText>
                    </a>
                  </TableCell>
                  <TableCell>
                    <EditableText id="forms" namespace="OverviewTab">
                      Forms
                    </EditableText>
                  </TableCell>
                  <TableCell>
                    <EditableText
                      id="performant_form_validation_with_zod_integration"
                      namespace="OverviewTab"
                    >
                      Performant form validation with Zod integration
                    </EditableText>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a
                      href="https://d3js.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      <EditableText id="d3_js" namespace="OverviewTab">
                        D3.js
                      </EditableText>
                    </a>
                  </TableCell>
                  <TableCell>
                    <EditableText id="visualization" namespace="OverviewTab">
                      Visualization
                    </EditableText>
                  </TableCell>
                  <TableCell>
                    <EditableText
                      id="data_driven_document_manipulation_and_svg_graphics"
                      namespace="OverviewTab"
                    >
                      Data-driven document manipulation and SVG graphics
                    </EditableText>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a
                      href="https://vitejs.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      <EditableText id="vite" namespace="OverviewTab">
                        Vite
                      </EditableText>
                    </a>
                  </TableCell>
                  <TableCell>
                    <EditableText id="build_tool" namespace="OverviewTab">
                      Build Tool
                    </EditableText>
                  </TableCell>
                  <TableCell>
                    <EditableText
                      id="fast_development_server_and_optimized_builds"
                      namespace="OverviewTab"
                    >
                      Fast development server and optimized builds
                    </EditableText>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a
                      href="http://localhost:6006"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      <EditableText id="storybook" namespace="OverviewTab">
                        Storybook
                      </EditableText>
                    </a>
                  </TableCell>
                  <TableCell>
                    <EditableText id="development" namespace="OverviewTab">
                      Development
                    </EditableText>
                  </TableCell>
                  <TableCell>
                    <EditableText
                      id="component_development_and_documentation"
                      namespace="OverviewTab"
                    >
                      Component development and documentation
                    </EditableText>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a
                      href="https://www.typescriptlang.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      <EditableText id="typescript" namespace="OverviewTab">
                        TypeScript
                      </EditableText>
                    </a>
                  </TableCell>
                  <TableCell>
                    <EditableText id="language" namespace="OverviewTab">
                      Language
                    </EditableText>
                  </TableCell>
                  <TableCell>
                    <EditableText
                      id="type_safe_javascript_with_enhanced_tooling"
                      namespace="OverviewTab"
                    >
                      Type-safe JavaScript with enhanced tooling
                    </EditableText>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a
                      href="https://lucide.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      <EditableText id="lucide_icons" namespace="OverviewTab">
                        Lucide Icons
                      </EditableText>
                    </a>
                  </TableCell>
                  <TableCell>
                    <EditableText id="icons" namespace="OverviewTab">
                      Icons
                    </EditableText>
                  </TableCell>
                  <TableCell>
                    <EditableText
                      id="open_source_icon_set_with_react_components"
                      namespace="OverviewTab"
                    >
                      Open-source icon set with React components
                    </EditableText>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a
                      href="https://shiki.style"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      <EditableText id="shiki" namespace="OverviewTab">
                        Shiki
                      </EditableText>
                    </a>
                  </TableCell>
                  <TableCell>
                    <EditableText id="syntax_highlighting" namespace="OverviewTab">
                      Syntax Highlighting
                    </EditableText>
                  </TableCell>
                  <TableCell>
                    <EditableText
                      id="vs_code_quality_syntax_highlighting_using_textmate"
                      namespace="OverviewTab"
                    >
                      VS Code-quality syntax highlighting using TextMate grammars
                    </EditableText>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a
                      href="https://zod.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      <EditableText id="zod" namespace="OverviewTab">
                        Zod
                      </EditableText>
                    </a>
                  </TableCell>
                  <TableCell>
                    <EditableText id="validation" namespace="OverviewTab">
                      Validation
                    </EditableText>
                  </TableCell>
                  <TableCell>
                    <EditableText
                      id="typescript_first_schema_validation_with_static_typ"
                      namespace="OverviewTab"
                    >
                      TypeScript-first schema validation with static type inference
                    </EditableText>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a
                      href="https://github.com/UX-and-I/storybook-design-token"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      <EditableText id="storybook_design_token" namespace="OverviewTab">
                        Storybook Design Token
                      </EditableText>
                    </a>
                  </TableCell>
                  <TableCell>
                    <EditableText id="documentation" namespace="OverviewTab">
                      Documentation
                    </EditableText>
                  </TableCell>
                  <TableCell>
                    <EditableText
                      id="auto_generates_design_token_documentation_from_css"
                      namespace="OverviewTab"
                    >
                      Auto-generates design token documentation from CSS annotations
                    </EditableText>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a
                      href="https://eclipse.dev/elk/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      <EditableText id="elkjs" namespace="OverviewTab">
                        ELKjs
                      </EditableText>
                    </a>
                  </TableCell>
                  <TableCell>
                    <EditableText id="graph_layout" namespace="OverviewTab">
                      Graph Layout
                    </EditableText>
                  </TableCell>
                  <TableCell>
                    <EditableText
                      id="hierarchical_graph_layout_engine_from_eclipse_layo"
                      namespace="OverviewTab"
                    >
                      Hierarchical graph layout engine from Eclipse Layout Kernel
                    </EditableText>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a
                      href="https://github.com/dagrejs/dagre"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      <EditableText id="dagre" namespace="OverviewTab">
                        Dagre
                      </EditableText>
                    </a>
                  </TableCell>
                  <TableCell>
                    <EditableText id="graph_layout" namespace="OverviewTab">
                      Graph Layout
                    </EditableText>
                  </TableCell>
                  <TableCell>
                    <EditableText
                      id="directed_graph_layout_library_for_network_visualiz"
                      namespace="OverviewTab"
                    >
                      Directed graph layout library for network visualizations
                    </EditableText>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a
                      href="https://cva.style"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      CVA
                    </a>
                  </TableCell>
                  <TableCell>
                    <EditableText id="styling" namespace="OverviewTab">
                      Styling
                    </EditableText>
                  </TableCell>
                  <TableCell>
                    <EditableText
                      id="class_variance_authority_for_type_safe_component_v"
                      namespace="OverviewTab"
                    >
                      Class Variance Authority for type-safe component variants
                    </EditableText>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a
                      href="https://github.com/ddsol/tailwind-merge"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      <EditableText id="tailwind_merge" namespace="OverviewTab">
                        Tailwind Merge
                      </EditableText>
                    </a>
                  </TableCell>
                  <TableCell>
                    <EditableText id="utilities" namespace="OverviewTab">
                      Utilities
                    </EditableText>
                  </TableCell>
                  <TableCell>
                    <EditableText
                      id="intelligently_merges_tailwind_css_classes_without_"
                      namespace="OverviewTab"
                    >
                      Intelligently merges Tailwind CSS classes without conflicts
                    </EditableText>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a
                      href="https://github.com/ddollar/foreman"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      <EditableText id="foreman" namespace="OverviewTab">
                        Foreman
                      </EditableText>
                    </a>
                  </TableCell>
                  <TableCell>
                    <EditableText id="development" namespace="OverviewTab">
                      Development
                    </EditableText>
                  </TableCell>
                  <TableCell>
                    <EditableText
                      id="process_manager_for_running_multiple_dev_services_"
                      namespace="OverviewTab"
                    >
                      Process manager for running multiple dev services (Procfile.dev)
                    </EditableText>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a
                      href="https://tanstack.com/table"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      <EditableText id="tanstack_table" namespace="OverviewTab">
                        TanStack Table
                      </EditableText>
                    </a>
                  </TableCell>
                  <TableCell>
                    <EditableText id="components" namespace="OverviewTab">
                      Components
                    </EditableText>
                  </TableCell>
                  <TableCell>
                    <EditableText
                      id="headless_ui_for_building_powerful_tables_datagrids"
                      namespace="OverviewTab"
                    >
                      Headless UI for building powerful tables & datagrids
                    </EditableText>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a
                      href="https://github.com/nodeca/js-yaml"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      <EditableText id="js_yaml" namespace="OverviewTab">
                        js-yaml
                      </EditableText>
                    </a>
                  </TableCell>
                  <TableCell>
                    <EditableText id="parsing" namespace="OverviewTab">
                      Parsing
                    </EditableText>
                  </TableCell>
                  <TableCell>
                    <EditableText
                      id="yaml_parser_for_mermaid_diagram_files_and_configur"
                      namespace="OverviewTab"
                    >
                      YAML parser for Mermaid diagram files and configuration
                    </EditableText>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a
                      href="https://typicode.github.io/husky"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      <EditableText id="husky" namespace="OverviewTab">
                        Husky
                      </EditableText>
                    </a>
                  </TableCell>
                  <TableCell>
                    <EditableText id="git_hooks" namespace="OverviewTab">
                      Git Hooks
                    </EditableText>
                  </TableCell>
                  <TableCell>
                    <EditableText
                      id="modern_git_hooks_for_enforcing_code_quality_on_com"
                      namespace="OverviewTab"
                    >
                      Modern Git hooks for enforcing code quality on commits
                    </EditableText>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a
                      href="https://commitlint.js.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      <EditableText id="commitlint" namespace="OverviewTab">
                        Commitlint
                      </EditableText>
                    </a>
                  </TableCell>
                  <TableCell>
                    <EditableText id="git_hooks" namespace="OverviewTab">
                      Git Hooks
                    </EditableText>
                  </TableCell>
                  <TableCell>
                    <EditableText
                      id="lint_commit_messages_to_follow_conventional_commit"
                      namespace="OverviewTab"
                    >
                      Lint commit messages to follow conventional commit format
                    </EditableText>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a
                      href="https://github.com/conventional-changelog/standard-version"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      <EditableText id="standard_version" namespace="OverviewTab">
                        Standard Version
                      </EditableText>
                    </a>
                  </TableCell>
                  <TableCell>
                    <EditableText id="versioning" namespace="OverviewTab">
                      Versioning
                    </EditableText>
                  </TableCell>
                  <TableCell>
                    <EditableText
                      id="automated_semantic_versioning_and_changelog_genera"
                      namespace="OverviewTab"
                    >
                      Automated semantic versioning and CHANGELOG generation
                    </EditableText>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a
                      href="https://eslint.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      <EditableText id="eslint" namespace="OverviewTab">
                        ESLint
                      </EditableText>
                    </a>
                  </TableCell>
                  <TableCell>
                    <EditableText id="code_quality" namespace="OverviewTab">
                      Code Quality
                    </EditableText>
                  </TableCell>
                  <TableCell>
                    <EditableText
                      id="pluggable_linting_utility_for_javascript_and_types"
                      namespace="OverviewTab"
                    >
                      Pluggable linting utility for JavaScript and TypeScript
                    </EditableText>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <a
                      href="https://prettier.io"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      <EditableText id="prettier" namespace="OverviewTab">
                        Prettier
                      </EditableText>
                    </a>
                  </TableCell>
                  <TableCell>
                    <EditableText id="code_quality" namespace="OverviewTab">
                      Code Quality
                    </EditableText>
                  </TableCell>
                  <TableCell>
                    <EditableText
                      id="opinionated_code_formatter_for_consistent_style"
                      namespace="OverviewTab"
                    >
                      Opinionated code formatter for consistent style
                    </EditableText>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </ScrollSnapItem>
    </div>
  );
}
