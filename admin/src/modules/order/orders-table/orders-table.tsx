import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowLeftToLineIcon,
  ArrowRightIcon,
  ArrowRightToLineIcon,
  ChevronDownIcon,
  CogIcon,
  EllipsisIcon,
} from "lucide-react";
import {
  ColumnDef,
  PaginationState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";

import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GetOrdersFilterParams, Order } from "@/services/order/order.types";
import { getOrders } from "@/services/order/order.service";
import { Filters } from "./orders-table.types";
import OrderFilterSheet from "../order-filter-sheet/order-filter-sheet";

const PAGE_SIZE = 10;
const initialPagination = {
  pageIndex: 0,
  pageSize: PAGE_SIZE,
};

const DEFAULT_FILTERS: Filters = {
  status: null,
};

function OrdersTable() {
  const [isFilterSheetOpen, setIsFilterOpen] = useState(false);

  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const [pagination, setPagination] =
    useState<PaginationState>(initialPagination);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const { pageIndex, pageSize } = pagination;

  const filterRequestPayload = useMemo(
    () => prepareFilterRequestPayload(filters),
    [filters]
  );

  const { data, isFetching } = useQuery({
    queryKey: ["orders-list", pagination, filters],
    queryFn: () =>
      getOrders({
        page: pageIndex + 1,
        limit: pageSize,
        ...filterRequestPayload,
      }),
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  const columns = useMemo(() => {
    return getColumns();
  }, []);

  const table = useReactTable({
    data: data?.orders || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    manualPagination: true,
    pageCount: Math.ceil((data?.count || 0) / pageSize) ?? -1,
    state: {
      pagination,
      columnVisibility,
    },
  });

  const handleFilterSheetClose = useCallback(() => {
    setIsFilterOpen(false);
  }, []);

  const applyFilters = useCallback(
    (newFilters: Filters) => {
      handleFilterSheetClose();
      setFilters(newFilters);
      setPagination({ ...initialPagination });
    },
    [handleFilterSheetClose]
  );

  const resetFilters = useCallback(() => {
    handleFilterSheetClose();
    setFilters(DEFAULT_FILTERS);
  }, [handleFilterSheetClose]);

  const noOfValidFiltersApplied = Object.keys(filterRequestPayload).length;

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        {isFilterSheetOpen && (
          <OrderFilterSheet
            applyFilters={applyFilters}
            appliedFiters={filters}
            onClose={handleFilterSheetClose}
            resetFilters={resetFilters}
          />
        )}
        <div className="flex items-center gap-4">
          <Button onClick={() => setIsFilterOpen(true)}>
            <CogIcon className="mr-2" /> Filters
          </Button>
          {noOfValidFiltersApplied > 0 && (
            <p className="text-secondary-foreground text-sm">
              {noOfValidFiltersApplied} Filters have been applied
            </p>
          )}
        </div>
        <DropdownMenu>
          <div className="flex items-center gap-4 ml-auto">
            <p className="text-secondary-foreground text-sm">
              Total count: {data?.count || 0}
            </p>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center gap-2 justify-center mt-8">
        <Button
          variant="secondary"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <ArrowLeftToLineIcon fontSize={25} />
        </Button>
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          variant="secondary"
        >
          <ArrowLeftIcon fontSize={25} />
        </Button>
        <Button
          variant="secondary"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ArrowRightIcon fontSize={25} />
        </Button>
        <Button
          variant="secondary"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <ArrowRightToLineIcon fontSize={25} />
        </Button>
        <span className="flex items-center gap-1 ml-2">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <span>|</span>
        <span className="flex items-center gap-1">
          Go to page:
          <Input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-2 px-3 rounded w-16 ml-2"
          />
        </span>
        <Select
          value={table.getState().pagination.pageSize.toString()}
          onValueChange={(e) => {
            table.setPageSize(Number(e));
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Page number" />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={pageSize.toString()}>
                Show {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="w-8 h-8">
          {isFetching ? <Spinner className="h-8 w-8" /> : null}
        </div>
      </div>
    </div>
  );
}

export const getColumns = (): ColumnDef<Order>[] => [
  {
    accessorFn: (row) => row.orderNo,
    header: "Order No",
    cell: (info) => info.getValue(),
  },
  {
    accessorFn: (row) => row.status,
    header: "Status",
    cell: (info) => {
      const status = info.getValue() as string;
      return status
        .toLowerCase()
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    },
  },
  {
    accessorFn: (row) => row.paymentMethod,
    header: "Payment Method",
    cell: (info) => info.getValue(),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <EllipsisIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link href={`/orders/${row.original.orderNo}`}>
                <Button variant="ghost" className="w-full h-full">
                  View details
                </Button>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const prepareFilterRequestPayload = (filters: Filters) => {
  const validFilters: Record<string, unknown> = {};
  for (const filterKey of Object.keys(filters) as Array<keyof Filters>) {
    const filterValue = filters[filterKey];

    if (!filterValue) {
      continue;
    }

    validFilters[filterKey] = filterValue;
  }

  return validFilters as GetOrdersFilterParams;
};

export default React.memo(OrdersTable);
