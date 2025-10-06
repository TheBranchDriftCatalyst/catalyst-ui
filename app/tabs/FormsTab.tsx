import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/catalyst-ui/ui/card";
import { CodeFlipCard } from "@/catalyst-ui/components/CodeFlipCard";

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
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
          <CardDescription>All button variants and sizes with hover/active animations • Click to view source</CardDescription>
        </CardHeader>
        <CardContent>
          <CodeFlipCard
            sourceCode={ButtonsDemoSource}
            fileName="ButtonsDemo.tsx"
            language="tsx"
            minHeight={120}
          >
            <ButtonsDemo />
          </CodeFlipCard>
        </CardContent>
      </Card>

      {/* Form Inputs */}
      <Card>
        <CardHeader>
          <CardTitle>Form Inputs</CardTitle>
          <CardDescription>Input fields, labels, and checkboxes with focus animations • Click to view source</CardDescription>
        </CardHeader>
        <CardContent>
          <CodeFlipCard
            sourceCode={InputsDemoSource}
            fileName="InputsDemo.tsx"
            language="tsx"
            minHeight={200}
          >
            <InputsDemo />
          </CodeFlipCard>
        </CardContent>
      </Card>

      {/* Select & Radio */}
      <Card>
        <CardHeader>
          <CardTitle>Select & Radio</CardTitle>
          <CardDescription>Dropdown selects and radio button groups • Click to view source</CardDescription>
        </CardHeader>
        <CardContent>
          <CodeFlipCard
            sourceCode={SelectRadioDemoSource}
            fileName="SelectRadioDemo.tsx"
            language="tsx"
            minHeight={200}
          >
            <SelectRadioDemo />
          </CodeFlipCard>
        </CardContent>
      </Card>

      {/* Slider & Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Slider & Progress</CardTitle>
          <CardDescription>Interactive slider control and progress indicators with smooth animations • Click to view source</CardDescription>
        </CardHeader>
        <CardContent>
          <CodeFlipCard
            sourceCode={SliderProgressDemoSource}
            fileName="SliderProgressDemo.tsx"
            language="tsx"
            minHeight={180}
          >
            <SliderProgressDemo />
          </CodeFlipCard>
        </CardContent>
      </Card>

      {/* Avatar & Toggle */}
      <Card>
        <CardHeader>
          <CardTitle>Avatars & Toggles</CardTitle>
          <CardDescription>User avatars with fallbacks and toggle switches • Click to view source</CardDescription>
        </CardHeader>
        <CardContent>
          <CodeFlipCard
            sourceCode={AvatarToggleDemoSource}
            fileName="AvatarToggleDemo.tsx"
            language="tsx"
            minHeight={120}
          >
            <AvatarToggleDemo />
          </CodeFlipCard>
        </CardContent>
      </Card>
    </div>
  );
}
