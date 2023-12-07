import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}
export declare function DataTable<TData, TValue>({ columns, data, }: DataTableProps<TData, TValue>): React.JSX.Element;
export {};
