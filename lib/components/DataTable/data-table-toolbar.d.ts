/// <reference types="react" />
import { Table } from "@tanstack/react-table";
interface DataTableToolbarProps<TData> {
    table: Table<TData>;
}
export declare function DataTableToolbar<TData>({ table, }: DataTableToolbarProps<TData>): import("react").JSX.Element;
export {};
