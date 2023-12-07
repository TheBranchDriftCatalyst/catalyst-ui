import * as React from "react";
import { Column } from "@tanstack/react-table";
import { LucideIcon } from "lucide-react";
interface DataTableFacetedFilter<TData, TValue> {
    column?: Column<TData, TValue>;
    title?: string;
    options: {
        label: string;
        value: string;
        icon?: LucideIcon;
    }[];
}
export declare function DataTableFacetedFilter<TData, TValue>({ column, title, options, }: DataTableFacetedFilter<TData, TValue>): React.JSX.Element;
export {};
