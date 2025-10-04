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

  // TODO: a cursory look at the menubar radio group shows it to be structured similar to a
  // dropdown menu.  Want to allow both uses here eventually
  return (
    <MenubarMenu>
      <MenubarTrigger className={`MenubarTrigger`}>
        Theme: {theme}
      </MenubarTrigger>
      <MenubarPortal>
        <MenubarContent
          className="MenubarContent"
          align="start"
          sideOffset={5}
          alignOffset={-14}
        >
          <MenubarRadioGroup
            value={theme}
            onValueChange={(val) => {
              setTheme(val);
            }}
          >
            {allThemes?.map((item) => (
              <MenubarRadioItem
                className="MenubarRadioItem inset"
                key={item}
                value={item || "default"}
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
