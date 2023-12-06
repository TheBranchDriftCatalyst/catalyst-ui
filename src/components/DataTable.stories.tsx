import React from "react";
import DataTable from "./DataTable";
import { within, userEvent } from "@storybook/testing-library";
import { ColumnDef } from "@tanstack/react-table";
import { faker } from "@faker-js/faker";

const initialData = Array.from({ length: 1000 }, () => ({
  id: faker.string.uuid(),
  amount: faker.number.int({ min: 10, max: 500 }),
  status: faker.helpers.arrayElement(["pending", "completed", "failed"]),
  email: faker.internet.email(),
}));

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

// This is a mock api call to get more data
const fetchData = async (options: {
  pageIndex: number
  pageSize: number
}) => {
  // Simulate some network latency
  await new Promise(r => setTimeout(r, 500))

  return {
    rows: initialData.slice(
      options.pageIndex * options.pageSize,
      (options.pageIndex + 1) * options.pageSize
    ),
    pageCount: Math.ceil(initialData.length / options.pageSize),
  }
}


const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
];

export default {
  title: "Components/DataTable",
  component: DataTable,
};

export const Default = {
  args: {
    columns: columns,
    data: initialData.slice(0, 10),
  },
};

export const WithPagination = {
  args: {
    columns: columns,
    data: initialData.slice(0, 10),
    totalItems: initialData.length,
    onPageChange: async (options: {
      pageIndex: number
      pageSize: number
    }) => {
      // Simulate some network latency
      await new Promise(r => setTimeout(r, 500))

      return {
        rows: initialData.slice(
          options.pageIndex * options.pageSize,
          (options.pageIndex + 1) * options.pageSize
        ),
        pageCount: Math.ceil(initialData.length / options.pageSize),
      }
    },
  },
};