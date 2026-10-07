"use client";

import React, { useEffect, useRef } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import { useInfiniteTasks } from "@/hooks/useTasks";
import { TaskHeader } from "@/components/tasks/TaskHeader";
import { TaskStats } from "@/components/tasks/TaskStats";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskFormModal } from "@/components/tasks/TaskFormModal";
import { TaskDrawer } from "@/components/tasks/TaskDrawer";
import { DeleteConfirmModal } from "@/components/tasks/DeleteConfirmModal";
import { Button } from "@/components/ui/button";

export default function TaskManagementPage() {
  const filters = useTaskStore((state) => state.filters);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteTasks(filters);

  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allTasks = data?.pages.flatMap((page) => page.tasks) ?? [];
  const total = data?.pages[0]?.total ?? allTasks.length;

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <div className="shrink-0 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-3 space-y-4 border-b border-border/60 bg-background/95 backdrop-blur-sm z-10">
        <TaskHeader />
        <TaskStats tasks={allTasks} total={total} />
        <TaskFilters />
      </div>

      <main className="flex-1 overflow-y-auto max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <TaskList tasks={allTasks} isLoading={isLoading} />

        {hasNextPage && (
          <div ref={observerRef} className="py-6 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="text-xs"
            >
              {isFetchingNextPage ? "Loading more tasks..." : "Load More"}
            </Button>
          </div>
        )}
      </main>

      <TaskFormModal />
      <TaskDrawer />
      <DeleteConfirmModal />
    </div>
  );
}
