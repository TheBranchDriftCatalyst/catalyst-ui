import { Button } from "@/catalyst";
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
      >
        <Icon className="h-5 w-5" />
      </Component>
    );
  },
);

export default ToggleVariantButton;
