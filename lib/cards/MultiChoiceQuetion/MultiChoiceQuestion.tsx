import { Card, CardContent, CardHeader } from "@/catalyst-ui/ui/card";
import { RadioGroup, RadioGroupItem } from "@/catalyst-ui/ui/radio-group";
import React, { FC, useState } from "react";
// import { Tilt } from '@jdion/tilt-react'

interface MultiChoiceQuestionCardProps
{
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
    // <Tilt>

    
    <Card className="bg-gradient-to-br from-purple-900 to-black-900 p-6 rounded-xl shadow-lg text-white max-w-md mx-auto">
      {/* <CardHeader> */}
      <h2 className="text-2xl font-bold mb-4">{question}</h2>
      {/* </CardHeader> */}
      <CardContent>
        <RadioGroup className="space-y-1" value={selectedOption} onValueChange={handleOptionChange}>
          {options.map((option, index) => (
            <div key={index} className="flex items-center">
              <RadioGroupItem
                id={`option-${index}`}
                value={option}
                className="form-radio h-4 w-4 text-pink-500 border-pink-500 focus:ring-pink-500 transition duration-150 ease-in-out"
              />
              <label htmlFor={`option-${index}`} className="ml-2 text-lg">
                {option}
              </label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
    // </Tilt>
  );
};

export default MultiChoiceQuestionCard;
