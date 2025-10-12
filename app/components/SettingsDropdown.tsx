import { useTheme } from "@/catalyst-ui/contexts/Theme/ThemeContext";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/catalyst-ui/ui/tabs";
import { MoonIcon, SunIcon, Settings, Download, Trash2, Undo2, Redo2 } from "lucide-react";
import { LoggerControl } from "@/catalyst-ui/components/LoggerControl";
import { useLocalizationContext } from "@/catalyst-ui/dev/context";
import { useToast } from "@/catalyst-ui/ui/use-toast";

/**
 * SettingsDropdown - Theme and effects settings panel with gear icon
 */
export function SettingsDropdown() {
  const { theme, setTheme, variant, setVariant, effects, updateEffect, allThemes } = useTheme();
  const { dumpLocalizationFile, clearChanges, undo, redo, canUndo, canRedo, getChanges } =
    useLocalizationContext();
  const { toast } = useToast();

  const handleClearChanges = () => {
    clearChanges();
    toast({
      title: "Changes cleared",
      description: "All translation changes and dirty state have been reset.",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-96 p-4">
        <DropdownMenuLabel className="text-base font-semibold">Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <Tabs defaultValue="theme" className="w-full mt-2">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="theme">Theme</TabsTrigger>
            <TabsTrigger value="logger">Logger</TabsTrigger>
            <TabsTrigger value="i18n">i18n</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          {/* Theme Tab */}
          <TabsContent value="theme" className="space-y-4">
            {/* Theme Selection */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {allThemes.map(
                    themeName =>
                      themeName && (
                        <SelectItem key={themeName} value={themeName} className="capitalize">
                          {themeName}
                        </SelectItem>
                      )
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Variant Toggle */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Mode</Label>
              <div className="flex gap-2">
                <Button
                  variant={variant === "light" ? "default" : "outline"}
                  onClick={() => setVariant("light")}
                  className="flex-1"
                  size="sm"
                >
                  <SunIcon className="mr-2 h-4 w-4" />
                  Light
                </Button>
                <Button
                  variant={variant === "dark" ? "default" : "outline"}
                  onClick={() => setVariant("dark")}
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
                    onCheckedChange={checked => updateEffect("glow", checked as boolean)}
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
                    onCheckedChange={checked => updateEffect("scanlines", checked as boolean)}
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
                    onCheckedChange={checked =>
                      updateEffect("borderAnimations", checked as boolean)
                    }
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
                    onCheckedChange={checked => updateEffect("gradientShift", checked as boolean)}
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
                    onCheckedChange={checked => updateEffect("debug", checked as boolean)}
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
          </TabsContent>

          {/* Logger Tab */}
          <TabsContent value="logger">
            <LoggerControl />
          </TabsContent>

          {/* i18n Tab */}
          <TabsContent value="i18n" className="space-y-4">
            <div className="space-y-3">
              {/* Undo/Redo Controls */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold">History</Label>
                <div className="flex gap-2">
                  <Button
                    onClick={undo}
                    disabled={!canUndo()}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Undo2 className="mr-2 h-4 w-4" />
                    Undo
                  </Button>
                  <Button
                    onClick={redo}
                    disabled={!canRedo()}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Redo2 className="mr-2 h-4 w-4" />
                    Redo
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Keyboard: Cmd+Z (undo), Cmd+Shift+Z (redo)
                </p>
              </div>

              {/* Download Localization Files */}
              <div className="space-y-2 pt-2 border-t border-border/40">
                <Label className="text-xs font-semibold">Localization Files</Label>
                <p className="text-xs text-muted-foreground">
                  Download translation files with any changes made in dev mode.
                </p>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={() => dumpLocalizationFile()}
                  variant="outline"
                  className="w-full"
                  size="sm"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Dump All Translations
                </Button>

                <div className="grid grid-cols-3 gap-2">
                  <Button
                    onClick={() => dumpLocalizationFile("common")}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    common.json
                  </Button>
                  <Button
                    onClick={() => dumpLocalizationFile("components")}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    components.json
                  </Button>
                  <Button
                    onClick={() => dumpLocalizationFile("errors")}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    errors.json
                  </Button>
                </div>
              </div>

              {/* Clear Changes */}
              <div className="space-y-2 pt-2 border-t border-border/40">
                <Label className="text-xs font-semibold">Reset</Label>
                <Button
                  onClick={handleClearChanges}
                  variant="destructive"
                  className="w-full"
                  size="sm"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All Changes
                </Button>
                <p className="text-xs text-muted-foreground">
                  Removes all translation changes and dirty state. Cannot be undone.
                </p>
              </div>

              <div className="pt-2 border-t border-border/40">
                <p className="text-xs text-muted-foreground">
                  Changes are stored locally and will persist across sessions.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-muted-foreground">Version</Label>
                <div className="flex items-center justify-between rounded-md border border-border/40 bg-muted/20 px-3 py-2">
                  <span className="text-sm font-mono">{__APP_VERSION__}</span>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-muted-foreground">Git Hash</Label>
                <div className="flex items-center justify-between rounded-md border border-border/40 bg-muted/20 px-3 py-2">
                  <span className="text-sm font-mono">{__GIT_HASH__}</span>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-muted-foreground">Last Commit</Label>
                <div className="rounded-md border border-border/40 bg-muted/20 px-3 py-2">
                  <p className="text-xs leading-relaxed whitespace-pre-wrap break-words">
                    {__LAST_COMMIT__}
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t border-border/40">
                <p className="text-xs text-muted-foreground">
                  catalyst-ui · React component library
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
