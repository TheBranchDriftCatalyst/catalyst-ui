import { Input } from "@/catalyst-ui/ui/input";
import { Label } from "@/catalyst-ui/ui/label";
import { Checkbox } from "@/catalyst-ui/ui/checkbox";

export function InputsDemo() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Enter your name" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="email@example.com" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="••••••••" />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms" className="text-sm font-normal">
          Accept terms and conditions
        </Label>
      </div>
    </div>
  );
}
