import { useTheme } from "@/catalyst-ui/contexts/Theme/ThemeContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/catalyst-ui/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/catalyst-ui/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/catalyst-ui/ui/select";
import { Button } from "@/catalyst-ui/ui/button";
import { Label } from "@/catalyst-ui/ui/label";
import { Checkbox } from "@/catalyst-ui/ui/checkbox";
import { MoonIcon, SunIcon } from "lucide-react";

/**
 * UserSettingsDropdown - Theme and effects settings panel
 *
 * Combines theme, variant, and effects controls into a single dropdown
 * accessible from the user avatar in the header.
 */
export function UserSettingsDropdown() {
  const { theme, setTheme, variant, setVariant, effects, updateEffect, allThemes } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer ring-1 ring-border/40 transition-all hover:ring-primary/50">
          <AvatarImage src="https://github.com/shadcn.png" alt="Settings" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-4">
        <DropdownMenuLabel className="text-base font-semibold">Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="space-y-4 py-2">
          {/* Theme Selection */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Theme</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {allThemes.map((themeName) => (
                  themeName && (
                    <SelectItem key={themeName} value={themeName} className="capitalize">
                      {themeName}
                    </SelectItem>
                  )
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Variant Toggle */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Mode</Label>
            <div className="flex gap-2">
              <Button
                variant={variant === 'light' ? 'default' : 'outline'}
                onClick={() => setVariant('light')}
                className="flex-1"
                size="sm"
              >
                <SunIcon className="mr-2 h-4 w-4" />
                Light
              </Button>
              <Button
                variant={variant === 'dark' ? 'default' : 'outline'}
                onClick={() => setVariant('dark')}
                className="flex-1"
                size="sm"
              >
                <MoonIcon className="mr-2 h-4 w-4" />
                Dark
              </Button>
            </div>
          </div>

          {/* Effects */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Effects</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="effect-glow"
                  checked={effects.glow}
                  onCheckedChange={(checked) => updateEffect('glow', checked as boolean)}
                />
                <label
                  htmlFor="effect-glow"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Glow Effects
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="effect-scanlines"
                  checked={effects.scanlines}
                  onCheckedChange={(checked) => updateEffect('scanlines', checked as boolean)}
                />
                <label
                  htmlFor="effect-scanlines"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Scanlines & Grid
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="effect-borders"
                  checked={effects.borderAnimations}
                  onCheckedChange={(checked) => updateEffect('borderAnimations', checked as boolean)}
                />
                <label
                  htmlFor="effect-borders"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Border Animations
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="effect-gradients"
                  checked={effects.gradientShift}
                  onCheckedChange={(checked) => updateEffect('gradientShift', checked as boolean)}
                />
                <label
                  htmlFor="effect-gradients"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Animated Gradients
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="effect-debug"
                  checked={effects.debug}
                  onCheckedChange={(checked) => updateEffect('debug', checked as boolean)}
                />
                <label
                  htmlFor="effect-debug"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  🔴 Debug Mode
                </label>
              </div>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
