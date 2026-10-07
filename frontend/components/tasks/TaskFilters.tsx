"use client";

import React, { useEffect, useState } from "react";
import { Search, ArrowUpDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTaskStore } from "@/store/useTaskStore";
import { useDebounce } from "@/hooks/useDebounce";
import { TaskPriority, TaskStatus } from "@/types/task";

export function TaskFilters() {
  const filters = useTaskStore((state) => state.filters);
  const setSearch = useTaskStore((state) => state.setSearch);
  const setStatusFilter = useTaskStore((state) => state.setStatusFilter);
  const setPriorityFilter = useTaskStore((state) => state.setPriorityFilter);
  const setSortBy = useTaskStore((state) => state.setSortBy);
  const toggleOrder = useTaskStore((state) => state.toggleOrder);
  const resetFilters = useTaskStore((state) => state.resetFilters);

  const [localSearch, setLocalSearch] = useState(filters.search);
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  const statusOptions: { label: string; value: "all" | TaskStatus }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "In Progress", value: "in_progress" },
    { label: "Completed", value: "completed" },
  ];

  const hasActiveFilters =
    filters.search !== "" ||
    filters.status !== "all" ||
    filters.priority !== "all" ||
    filters.sortBy !== "createdAt" ||
    filters.order !== "desc";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search tasks by title or description..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-9 pr-9 w-full bg-background"
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filters.priority}
            onChange={(e) => setPriorityFilter(e.target.value as "all" | TaskPriority)}
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            aria-label="Filter by priority"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "createdAt" | "dueDate" | "priority")
            }
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            aria-label="Sort by field"
          >
            <option value="createdAt">Date Created</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleOrder}
            title={`Sort Order: ${filters.order.toUpperCase()}`}
            aria-label="Toggle sort order"
          >
            <ArrowUpDown className="size-4" />
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setLocalSearch("");
                resetFilters();
              }}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {statusOptions.map((opt) => {
          const isActive = filters.status === opt.value;
          return (
            <Button
              key={opt.value}
              size="sm"
              variant={isActive ? "default" : "outline"}
              onClick={() => setStatusFilter(opt.value)}
              className="text-xs h-7 px-3 rounded-full shrink-0"
            >
              {opt.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
