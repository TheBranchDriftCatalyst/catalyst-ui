import { useState } from "react";
import { Slider } from "@/catalyst-ui/ui/slider";
import { Progress } from "@/catalyst-ui/ui/progress";
import { Label } from "@/catalyst-ui/ui/label";
import { Button } from "@/catalyst-ui/ui/button";

export function SliderProgressDemo() {
  const [sliderValue, setSliderValue] = useState([50]);
  const [progress, setProgress] = useState(33);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Slider Value: {sliderValue[0]}</Label>
        <Slider
          value={sliderValue}
          onValueChange={setSliderValue}
          max={100}
          step={1}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Progress: {progress}%</Label>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setProgress(Math.max(0, progress - 10))}>
              -
            </Button>
            <Button size="sm" onClick={() => setProgress(Math.min(100, progress + 10))}>
              +
            </Button>
          </div>
        </div>
        <Progress value={progress} />
      </div>
    </div>
  );
}
