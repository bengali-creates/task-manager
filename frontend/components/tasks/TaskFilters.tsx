"use client";

import React, { useEffect, useState } from "react";
import { Search, ArrowUpDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RubberSegment from "@/components/ui/RubberSegment";
import GlideSelect from "@/components/ui/GlideSelect";
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

  const statusItems = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

  const priorityOptions = [
    { value: "all", label: "All Priorities" },
    { value: "high", label: "High", tag: "Urgent" },
    { value: "medium", label: "Medium", tag: "Normal" },
    { value: "low", label: "Low", tag: "Low" },
  ];

  const sortOptions = [
    { value: "createdAt", label: "Date Created", tag: "Date" },
    { value: "dueDate", label: "Due Date", tag: "Due" },
    { value: "priority", label: "Priority", tag: "Rank" },
  ];

  const hasActiveFilters =
    filters.search !== "" ||
    filters.status !== "all" ||
    filters.priority !== "all" ||
    filters.sortBy !== "createdAt" ||
    filters.order !== "desc";

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search tasks..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-8 pr-8 h-8 text-sm w-full bg-background"
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <GlideSelect
            options={priorityOptions}
            value={filters.priority}
            onChange={(val) => setPriorityFilter(val as "all" | TaskPriority)}
            ariaLabel="Filter by priority"
            surfaceColor="var(--background)"
            highlightColor="var(--muted)"
            textColor="var(--foreground)"
            accentColor="var(--primary)"
            size="sm"
            radius={8}
            menuWidth={140}
            placement="bottom"
            align="right"
          />

          <GlideSelect
            options={sortOptions}
            value={filters.sortBy}
            onChange={(val) => setSortBy(val as "createdAt" | "dueDate" | "priority")}
            ariaLabel="Sort by field"
            surfaceColor="var(--background)"
            highlightColor="var(--muted)"
            textColor="var(--foreground)"
            accentColor="var(--primary)"
            size="sm"
            radius={8}
            menuWidth={145}
            placement="bottom"
            align="right"
          />

          <Button
            variant="outline"
            size="icon"
            onClick={toggleOrder}
            title={`Sort Order: ${filters.order.toUpperCase()}`}
            aria-label="Toggle sort order"
            className="h-8 w-8"
          >
            <ArrowUpDown className="size-3.5" />
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setLocalSearch("");
                resetFilters();
              }}
              className="text-sm h-8 px-2 text-muted-foreground hover:text-foreground"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center overflow-x-auto pb-0.5">
        <RubberSegment
          items={statusItems}
          value={filters.status}
          onChange={(val) => setStatusFilter(val as "all" | TaskStatus)}
          trackColor="var(--muted)"
          thumbColor="var(--foreground)"
          textColor="var(--muted-foreground)"
          activeTextColor="var(--background)"
          size="sm"
          fontSize={11}
          radius={8}
          inset={2}
          equalSlots={false}
          stretch={90}
          squash={2}
          speed={1}
          glide={70}
          draggable
        />
      </div>
    </div>
  );
}
