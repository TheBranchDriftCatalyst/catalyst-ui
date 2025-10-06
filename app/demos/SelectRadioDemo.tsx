import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/catalyst-ui/ui/select";
import { RadioGroup, RadioGroupItem } from "@/catalyst-ui/ui/radio-group";
import { Label } from "@/catalyst-ui/ui/label";

export function SelectRadioDemo() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Select Framework</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select a framework" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="react">React</SelectItem>
            <SelectItem value="vue">Vue</SelectItem>
            <SelectItem value="angular">Angular</SelectItem>
            <SelectItem value="svelte">Svelte</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Choose an option</Label>
        <RadioGroup defaultValue="option-one">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-one" id="option-one" />
            <Label htmlFor="option-one">Option One</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-two" id="option-two" />
            <Label htmlFor="option-two">Option Two</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-three" id="option-three" />
            <Label htmlFor="option-three">Option Three</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
