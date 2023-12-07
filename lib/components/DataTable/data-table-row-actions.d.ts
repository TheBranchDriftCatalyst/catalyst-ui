/// <reference types="react" />
import { Row } from "@tanstack/react-table";
interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
}
export declare function DataTableRowActions<TData>({ row, }: DataTableRowActionsProps<TData>): import("react").JSX.Element;
export {};
