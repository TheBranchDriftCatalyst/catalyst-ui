import { useState } from "react";
import { Slider } from "@/catalyst-ui/ui/slider";
import { Progress } from "@/catalyst-ui/ui/progress";
import { Label } from "@/catalyst-ui/ui/label";
import { Button } from "@/catalyst-ui/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/catalyst-ui/ui/card";

const skillLabels = {
  1: "Novice",
  2: "Beginner",
  3: "Intermediate",
  4: "Advanced",
  5: "Expert",
};

export function SliderProgressDemo() {
  const [sliderValue, setSliderValue] = useState([50]);
  const [skillLevel, setSkillLevel] = useState([3]);
  const [progress, setProgress] = useState(33);

  // Inside label variants
  const [insideCircle, setInsideCircle] = useState([42]);
  const [insideRect, setInsideRect] = useState([67]);
  const [insideRounded, setInsideRounded] = useState([85]);

  // Outside label variants
  const [outsideCircle, setOutsideCircle] = useState([25]);
  const [outsideRect, setOutsideRect] = useState([50]);
  const [outsideRounded, setOutsideRounded] = useState([75]);

  // Custom formatters
  const [temperature, setTemperature] = useState([72]);
  const [volume, setVolume] = useState([7]);
  const [percentage, setPercentage] = useState([65]);

  return (
    <div className="space-y-6">
      {/* Basic Slider */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Slider</CardTitle>
          <CardDescription>Simple value slider with hover display</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>Value: {sliderValue[0]}</Label>
            <Slider
              value={sliderValue}
              onValueChange={setSliderValue}
              max={100}
              step={1}
              showValue
            />
          </div>
        </CardContent>
      </Card>

      {/* Skill Level Slider with Labels */}
      <Card>
        <CardHeader>
          <CardTitle>Labeled Slider</CardTitle>
          <CardDescription>Discrete values with text labels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Inside Label: {skillLabels[skillLevel[0] as keyof typeof skillLabels]}</Label>
            <Slider
              value={skillLevel}
              onValueChange={setSkillLevel}
              min={1}
              max={5}
              step={1}
              labels={skillLabels}
              showValue
              labelPosition="inside"
              thumbShape="rounded-rectangle"
            />
          </div>

          <div className="space-y-3">
            <Label>Outside Label (Hover): {skillLabels[skillLevel[0] as keyof typeof skillLabels]}</Label>
            <Slider
              value={skillLevel}
              onValueChange={setSkillLevel}
              min={1}
              max={5}
              step={1}
              labels={skillLabels}
              showValue
              labelPosition="outside"
              thumbShape="rounded-rectangle"
            />
          </div>
        </CardContent>
      </Card>

      {/* Inside Label Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Inside Label Variants</CardTitle>
          <CardDescription>Labels displayed inside the thumb with different shapes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Circle Thumb with Inside Label: {insideCircle[0]}</Label>
            <Slider
              value={insideCircle}
              onValueChange={setInsideCircle}
              max={100}
              step={1}
              thumbShape="circle"
              showValue
              labelPosition="inside"
            />
          </div>

          <div className="space-y-3">
            <Label>Rectangle Thumb with Inside Label: {insideRect[0]}</Label>
            <Slider
              value={insideRect}
              onValueChange={setInsideRect}
              max={100}
              step={1}
              thumbShape="rectangle"
              showValue
              labelPosition="inside"
            />
          </div>

          <div className="space-y-3">
            <Label>Rounded Rectangle Thumb with Inside Label: {insideRounded[0]}</Label>
            <Slider
              value={insideRounded}
              onValueChange={setInsideRounded}
              max={100}
              step={1}
              thumbShape="rounded-rectangle"
              showValue
              labelPosition="inside"
            />
          </div>
        </CardContent>
      </Card>

      {/* Outside Label Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Outside Label Variants</CardTitle>
          <CardDescription>Labels displayed as tooltip on hover</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Circle Thumb: {outsideCircle[0]} (Hover to see label)</Label>
            <Slider
              value={outsideCircle}
              onValueChange={setOutsideCircle}
              max={100}
              step={1}
              thumbShape="circle"
              showValue
              labelPosition="outside"
            />
          </div>

          <div className="space-y-3">
            <Label>Rectangle Thumb: {outsideRect[0]} (Hover to see label)</Label>
            <Slider
              value={outsideRect}
              onValueChange={setOutsideRect}
              max={100}
              step={1}
              thumbShape="rectangle"
              showValue
              labelPosition="outside"
            />
          </div>

          <div className="space-y-3">
            <Label>Rounded Rectangle Thumb: {outsideRounded[0]} (Hover to see label)</Label>
            <Slider
              value={outsideRounded}
              onValueChange={setOutsideRounded}
              max={100}
              step={1}
              thumbShape="rounded-rectangle"
              showValue
              labelPosition="outside"
            />
          </div>
        </CardContent>
      </Card>

      {/* Progress Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Bar</CardTitle>
          <CardDescription>Animated progress indicator</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
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
        </CardContent>
      </Card>

      {/* Custom Formatter with Inside Labels */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Formatter with Inside Labels</CardTitle>
          <CardDescription>Format values with custom function displayed inside thumb</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Temperature Control: {temperature[0]}°F</Label>
            <Slider
              value={temperature}
              onValueChange={setTemperature}
              min={60}
              max={85}
              step={1}
              showValue
              labelPosition="inside"
              formatValue={(value) => `${value}°`}
              thumbShape="rounded-rectangle"
            />
          </div>

          <div className="space-y-3">
            <Label>Volume Control: {volume[0]}/10</Label>
            <Slider
              value={volume}
              onValueChange={setVolume}
              min={0}
              max={10}
              step={1}
              showValue
              labelPosition="inside"
              formatValue={(value) => `${value}`}
              thumbShape="circle"
            />
          </div>

          <div className="space-y-3">
            <Label>Percentage Control: {percentage[0]}%</Label>
            <Slider
              value={percentage}
              onValueChange={setPercentage}
              min={0}
              max={100}
              step={5}
              showValue
              labelPosition="inside"
              formatValue={(value) => `${value}%`}
              thumbShape="rounded-rectangle"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
