import React, { useState, ReactNode } from "react";
import Pagination from "./Pagination";
import SearchBar from "./SearchBar";
import EmptyState from "./EmptyState";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Column<T> {
  /** Column header label */
  header: string;
  /** Unique key for React list rendering */
  key: string;
  /** Render function for each cell */
  render: (item: T, index: number) => ReactNode;
  /** Optional: right-align this column (useful for "Actions") */
  alignRight?: boolean;
}

export interface PaginationInfo {
  page: number;
  totalPages: number;
  total?: number;
}

export interface DataTableProps<T> {
  /** Array of data items to display */
  data: T[];
  /** Column definitions */
  columns: Column<T>[];
  /** Unique key extractor for each row */
  rowKey: (item: T) => string;
  /** Pagination info from the API */
  pagination: PaginationInfo;
  /** Called when page changes */
  onPageChange: (page: number) => void;
  /** Current search value */
  search: string;
  /** Called when search value changes (page will auto-reset) */
  onSearchChange: (value: string) => void;
  /** Placeholder text for the search input */
  searchPlaceholder?: string;
  /** Empty state config when no data */
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  /** Empty state when search yields no results */
  emptySearchTitle?: string;
  emptySearchDescription?: string;
  /** Optional: min-width for the table (default: 600px) */
  minWidth?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

function DataTable<T>({
  data,
  columns,
  rowKey,
  pagination,
  onPageChange,
  search,
  onSearchChange,
  searchPlaceholder = "Search…",
  emptyTitle = "No records found",
  emptyDescription = "Get started by creating a new record.",
  emptyActionLabel,
  onEmptyAction,
  emptySearchTitle = "No results match your search",
  emptySearchDescription = "Try adjusting your search terms.",
  minWidth = "600px",
}: DataTableProps<T>) {
  const hasSearch = search.length > 0;
  const isEmpty = data.length === 0;

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200/60">
      {/* ── Toolbar / Search ── */}
      <div className="border-b border-gray-100 px-4 py-3 sm:px-5">
        <SearchBar
          value={search}
          onChange={(v) => {
            onSearchChange(v);
            onPageChange(1);
          }}
          placeholder={searchPlaceholder}
        />
      </div>

      {/* ── Table or Empty State ── */}
      {isEmpty ? (
        <EmptyState
          title={hasSearch ? emptySearchTitle : emptyTitle}
          description={hasSearch ? emptySearchDescription : emptyDescription}
          actionLabel={hasSearch ? undefined : emptyActionLabel}
          onAction={hasSearch ? undefined : onEmptyAction}
        />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm" style={{ minWidth }}>
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      scope="col"
                      className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400${
                        col.alignRight ? " text-right" : ""
                      }`}
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.map((item, index) => (
                  <tr
                    key={rowKey(item)}
                    className="group transition-colors duration-100 hover:bg-blue-50/40"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`px-5 py-3.5${
                          col.alignRight ? " text-right" : ""
                        }`}
                      >
                        {col.render(item, index)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
          />
        </>
      )}
    </div>
  );
}

export default DataTable;
