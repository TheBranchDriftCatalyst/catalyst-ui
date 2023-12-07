import DataTable from "./DataTable";
import { ColumnDef } from "@tanstack/react-table";
export type Payment = {
    id: string;
    amount: number;
    status: "pending" | "processing" | "success" | "failed";
    email: string;
};
declare const _default: {
    title: string;
    component: typeof DataTable;
};
export default _default;
export declare const Default: {
    args: {
        columns: ColumnDef<Payment>[];
        data: {
            id: string;
            amount: number;
            status: string;
            email: string;
        }[];
    };
};
export declare const WithPagination: {
    args: {
        columns: ColumnDef<Payment>[];
        data: {
            id: string;
            amount: number;
            status: string;
            email: string;
        }[];
        totalItems: number;
        onPageChange: (options: {
            pageIndex: number;
            pageSize: number;
        }) => Promise<{
            rows: {
                id: string;
                amount: number;
                status: string;
                email: string;
            }[];
            pageCount: number;
        }>;
    };
};
