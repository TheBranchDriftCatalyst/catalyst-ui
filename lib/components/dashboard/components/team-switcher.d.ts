import * as React from "react";
import { PopoverTrigger } from "@/components/ui/popover";
type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;
interface TeamSwitcherProps extends PopoverTriggerProps {
}
export default function TeamSwitcher({ className }: TeamSwitcherProps): React.JSX.Element;
export {};
