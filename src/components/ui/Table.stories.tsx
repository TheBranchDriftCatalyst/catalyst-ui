import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from './Table';

export default {
  title: 'UI/Table',
  component: Table,
  // subcomponents: { TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption }, 
  tags: ['autodocs'],
  argTypes: {
    size: {
      options: ["default", "compact"],
      control: { type: "radio" },
      defaultValue: "default",
    },
    onClick: { action: "clicked" },
  },
};

const Default = () => (
  <Table>
    <TableCaption>Sample Table</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>Column 1</TableHead>
        <TableHead>Column 2</TableHead>
        <TableHead>Column 3</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>Data 1</TableCell>
        <TableCell>Data 2</TableCell>
        <TableCell>Data 3</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Data 4</TableCell>
        <TableCell>Data 5</TableCell>
        <TableCell>Data 6</TableCell>
      </TableRow>
      {/* Add more rows as needed */}
    </TableBody>
    <TableFooter>
      <TableRow>
        <TableCell>Footer 1</TableCell>
        <TableCell>Footer 2</TableCell>
        <TableCell>Footer 3</TableCell>
      </TableRow>
    </TableFooter>
  </Table>
);

export {
  Default
};
