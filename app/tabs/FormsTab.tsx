import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/catalyst-ui/ui/card";
import { CodeFlipCard } from "@/catalyst-ui/components/CodeFlipCard";
import { ImportFooter } from "@/catalyst-ui/components/CodeFlipCard/ImportFooter";
import { ScrollSnapItem } from "@/catalyst-ui/effects";

// Import demo components and their source code
import { ButtonsDemo } from "../demos/ButtonsDemo";
import ButtonsDemoSource from "../demos/ButtonsDemo.tsx?raw";

import { InputsDemo } from "../demos/InputsDemo";
import InputsDemoSource from "../demos/InputsDemo.tsx?raw";

import { SelectRadioDemo } from "../demos/SelectRadioDemo";
import SelectRadioDemoSource from "../demos/SelectRadioDemo.tsx?raw";

import { SliderProgressDemo } from "../demos/SliderProgressDemo";
import SliderProgressDemoSource from "../demos/SliderProgressDemo.tsx?raw";

import { AvatarToggleDemo } from "../demos/AvatarToggleDemo";
import AvatarToggleDemoSource from "../demos/AvatarToggleDemo.tsx?raw";

export function FormsTab() {
  return (
    <div className="space-y-4 mt-0">
      {/* Buttons */}
      <ScrollSnapItem align="start">
        <CodeFlipCard sourceCode={ButtonsDemoSource} fileName="ButtonsDemo.tsx" language="tsx">
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
              <CardDescription>
                All button variants and sizes with hover/active animations • Click to view source
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ButtonsDemo />
            </CardContent>
            <ImportFooter sourceCode={ButtonsDemoSource} />
          </Card>
        </CodeFlipCard>
      </ScrollSnapItem>

      {/* Form Inputs */}
      <ScrollSnapItem align="start">
        <CodeFlipCard sourceCode={InputsDemoSource} fileName="InputsDemo.tsx" language="tsx">
          <Card>
            <CardHeader>
              <CardTitle>Form Inputs</CardTitle>
              <CardDescription>
                Input fields, labels, and checkboxes with focus animations • Click to view source
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InputsDemo />
            </CardContent>
            <ImportFooter sourceCode={InputsDemoSource} />
          </Card>
        </CodeFlipCard>
      </ScrollSnapItem>

      {/* Select & Radio */}
      <ScrollSnapItem align="start">
        <CodeFlipCard
          sourceCode={SelectRadioDemoSource}
          fileName="SelectRadioDemo.tsx"
          language="tsx"
        >
          <Card>
            <CardHeader>
              <CardTitle>Select & Radio</CardTitle>
              <CardDescription>
                Dropdown selects and radio button groups • Click to view source
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SelectRadioDemo />
            </CardContent>
            <ImportFooter sourceCode={SelectRadioDemoSource} />
          </Card>
        </CodeFlipCard>
      </ScrollSnapItem>

      {/* Slider & Progress */}
      <ScrollSnapItem align="start">
        <CodeFlipCard
          sourceCode={SliderProgressDemoSource}
          fileName="SliderProgressDemo.tsx"
          language="tsx"
        >
          <Card>
            <CardHeader>
              <CardTitle>Slider & Progress</CardTitle>
              <CardDescription>
                Interactive slider control and progress indicators with smooth animations • Click to
                view source
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SliderProgressDemo />
            </CardContent>
            <ImportFooter sourceCode={SliderProgressDemoSource} />
          </Card>
        </CodeFlipCard>
      </ScrollSnapItem>

      {/* Avatar & Toggle */}
      <ScrollSnapItem align="start">
        <CodeFlipCard
          sourceCode={AvatarToggleDemoSource}
          fileName="AvatarToggleDemo.tsx"
          language="tsx"
        >
          <Card>
            <CardHeader>
              <CardTitle>Avatars & Toggles</CardTitle>
              <CardDescription>
                User avatars with fallbacks and toggle switches • Click to view source
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AvatarToggleDemo />
            </CardContent>
            <ImportFooter sourceCode={AvatarToggleDemoSource} />
          </Card>
        </CodeFlipCard>
      </ScrollSnapItem>
    </div>
  );
}
