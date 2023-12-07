/// <reference types="react" />
import { Table } from "@tanstack/react-table";
interface DataTableViewOptionsProps<TData> {
    table: Table<TData>;
}
export declare function DataTableViewOptions<TData>({ table, }: DataTableViewOptionsProps<TData>): import("react").JSX.Element;
export {};
