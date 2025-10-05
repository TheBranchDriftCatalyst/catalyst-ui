import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/catalyst-ui/ui/card";
import { Label } from "@/catalyst-ui/ui/label";
import { RadioGroup, RadioGroupItem } from "@/catalyst-ui/ui/radio-group";
import React, { useState } from "react";
import { Tilt } from "@jdion/tilt-react";

interface MultiChoiceQuestionCardProps {
  question: string;
  options: string[];
  onChange: (value: string) => void;
}

const MultiChoiceQuestionCard: React.FC<MultiChoiceQuestionCardProps> = ({ question, options, onChange }) => {
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
    onChange(value);
  };

  return (
    // @ts-ignore - Tilt prop types issue
    <Tilt tiltMaxAngleX={2} tiltMaxAngleY={3} scale={1.02} perspective={1200}>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{question}</CardTitle>
          <CardDescription>Select one option from the choices below</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup className="space-y-3" value={selectedOption} onValueChange={handleOptionChange}>
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem id={`option-${index}`} value={option} />
                <Label htmlFor={`option-${index}`} className="cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
    </Tilt>
  );
};

export default MultiChoiceQuestionCard;
