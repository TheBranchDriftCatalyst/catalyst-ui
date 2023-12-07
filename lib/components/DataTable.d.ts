import { ColumnDef, PaginationState, PaginationTableState } from "@tanstack/react-table";
import React from "react";
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    totalItems: number;
    onPageChange: PaginationState | PaginationTableState;
}
export default function DataTable<TData, TValue>({ columns, data, totalItems, onPageChange }: DataTableProps<TData, TValue>): React.JSX.Element;
export {};
