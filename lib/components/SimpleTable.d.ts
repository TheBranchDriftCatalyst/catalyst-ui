import { ColumnDef, PaginationState, PaginationTableState } from "@tanstack/react-table";
import React from "react";
interface SimpleTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    totalItems: number;
    onPageChange: PaginationState | PaginationTableState;
}
export default function SimpleTable<TData, TValue>({ columns, data, totalItems, onPageChange }: SimpleTableProps<TData, TValue>): React.JSX.Element;
export {};
