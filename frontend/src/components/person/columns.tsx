"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { data } from "wailsjs/go/models";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { ViewAttachments } from "./ViewAttachments";
import { useState } from "react";
import { NotesDrawer } from "./NotesDrawer";
import { number, string } from "zod";

export const columns: ColumnDef<data.Person>[] = [
  { id: "ID", accessorKey: "ID", header: "ID" },
  {
    id: "Name",
    accessorKey: "Name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
  },
  {
    id: "Sex",
    accessorKey: "Sex",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Sex
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
  },
  { id: "Father's Name", accessorKey: "FatherName", header: "Father's Name" },
  {
    id: "Occupation Type",
    accessorKey: "OccupationType",
    header: "Occupation Type",
  },
  { id: "Annual Income", accessorKey: "AnnualIncome", header: "Annual Income" },
  {
    id: "Budget",
    accessorKey: "Budget",
    header: "Budget",
  },
  {
    accessorKey: "DateOfBirth",
    header: "Date Of Birth",
    // Custom rendering function for DateOfBirth
    cell: ({ row }) => {
      const date = new Date(String(row.getValue("DateOfBirth")));
      const formattedDate = format(date, "dd/MM/yyyy");
      return formattedDate;
    },
  },
  {
    id: "Place Of Birth",
    accessorKey: "PlaceOfBirth",
    header: "Place Of Birth",
  },
  {
    id: "Time Of Birth",
    header: "Time Of Birth",
    // Custom rendering function for DateOfBirth
    cell: ({ row }) => {
      const date = new Date(String(row.getValue("DateOfBirth")));
      const formattedDate = format(date, "HH:mm a");
      return formattedDate;
    },
  },
  {
    id: "Notes",
    accessorKey: "Notes",
    cell: ({ row }) => {
      const notes = String(row.getValue("Notes"));
      const id = Number(row.getValue("ID"));
      return <NotesDrawer notes={notes} id={id} />;
    },
  },
  {
    id: "Actions",
    header: "Actions",
    cell: ({ row }) => {
      const person = row.original;
      const [sheetOpen, setSheetOpen] = useState(false);
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-8 h-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <Link
              to={`/persons/manage`}
              state={{ edit: true, person: row.original }}
            >
              <DropdownMenuItem asChild>
                <span>Edit</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <ViewAttachments uuid={person.Uuid} id={person.ID} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
