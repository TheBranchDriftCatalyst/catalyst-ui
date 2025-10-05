import {
  MenubarContent,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarTrigger,
} from "@/catalyst-ui/ui/menubar";
import { useTheme } from "./ThemeContext";

export const ChangeThemeDropdown = () => {
  const { theme, setTheme, allThemes } = useTheme();

  // Capitalize theme name for display
  const displayTheme = theme.charAt(0).toUpperCase() + theme.slice(1);

  return (
    <MenubarMenu>
      <MenubarTrigger className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">
        {displayTheme}
      </MenubarTrigger>
      <MenubarPortal>
        <MenubarContent
          align="end"
          sideOffset={8}
          className="min-w-[160px]"
        >
          <MenubarRadioGroup
            value={theme}
            onValueChange={(val) => {
              setTheme(val);
            }}
          >
            {allThemes?.map((item) => (
              <MenubarRadioItem
                key={item}
                value={item || "default"}
                className="capitalize"
              >
                {item || "default"}
              </MenubarRadioItem>
            ))}
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarPortal>
    </MenubarMenu>
  );
};

export default ChangeThemeDropdown;
