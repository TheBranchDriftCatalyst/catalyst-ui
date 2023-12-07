import * as React from "react";
import { PopoverProps } from "@radix-ui/react-popover";
import { Model, ModelType } from "../data/models";
interface ModelSelectorProps extends PopoverProps {
    types: readonly ModelType[];
    models: Model[];
}
export declare function ModelSelector({ models, types, ...props }: ModelSelectorProps): React.JSX.Element;
export {};
