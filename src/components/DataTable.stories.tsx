import React from "react";
import DataTable from "./DataTable";
import { within, userEvent } from "@storybook/testing-library";
import { ColumnDef } from "@tanstack/react-table";
import { faker } from "@faker-js/faker";

const mockData = Array.from({ length: 10 }, () => ({
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
    data: mockData,
  },
};
