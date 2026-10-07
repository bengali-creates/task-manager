"use client";

import React from "react";
import { useTaskStore } from "@/store/useTaskStore";
import { useTasks } from "@/hooks/useTasks";
import { TaskHeader } from "@/components/tasks/TaskHeader";
import { TaskStats } from "@/components/tasks/TaskStats";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskPagination } from "@/components/tasks/TaskPagination";
import { TaskFormModal } from "@/components/tasks/TaskFormModal";
import { TaskDrawer } from "@/components/tasks/TaskDrawer";
import { DeleteConfirmModal } from "@/components/tasks/DeleteConfirmModal";

export default function TaskManagementPage() {
  const filters = useTaskStore((state) => state.filters);
  const setPage = useTaskStore((state) => state.setPage);

  const { data, isLoading } = useTasks(filters);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top Header & New Task Action */}
        <TaskHeader />

        {/* Task Metric Statistics */}
        <TaskStats tasks={data?.tasks || []} total={data?.total || 0} />

        {/* Search, Filter Pills & Sorting */}
        <TaskFilters />

        {/* Responsive Grid List with Loading/Empty states */}
        <TaskList tasks={data?.tasks || []} isLoading={isLoading} />

        {/* Pagination Controls */}
        {data && (
          <TaskPagination
            currentPage={data.page}
            totalPages={data.totalPages}
            total={data.total}
            limit={filters.limit}
            onPageChange={setPage}
          />
        )}

        {/* Modals & Slide-over Drawers */}
        <TaskFormModal />
        <TaskDrawer />
        <DeleteConfirmModal />
      </main>
    </div>
  );
}
