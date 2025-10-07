import { Button } from "@/catalyst-ui/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { forwardRef } from "react";
import { useTheme } from "./ThemeContext";

interface ToggleVariantButtonProps {
  component?: React.ElementType;
}

export const ToggleVariantButton = forwardRef(
  ({ component: Component = Button }: ToggleVariantButtonProps, ref) => {
    const { variant, setVariant } = useTheme();
    const Icon = variant === "dark" ? MoonIcon : SunIcon;

    return (
      <Component
        ref={ref}
        size="icon"
        variant="outline"
        onClick={() => setVariant(variant === "dark" ? "light" : "dark")}
        aria-label={`Switch to ${variant === "dark" ? "light" : "dark"} mode`}
      >
        <Icon className="h-5 w-5" />
      </Component>
    );
  },
);

export default ToggleVariantButton;
