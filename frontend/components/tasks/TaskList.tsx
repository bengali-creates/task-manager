"use client";

import React from "react";
import { Plus, Inbox } from "lucide-react";
import { Task } from "@/types/task";
import { TaskCard } from "./TaskCard";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useTaskStore } from "@/store/useTaskStore";

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
}

export function TaskList({ tasks, isLoading }: TaskListProps) {
  const openCreate = useTaskStore((state) => state.openCreate);
  const resetFilters = useTaskStore((state) => state.resetFilters);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <Card key={n} className="p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="pt-3 border-t flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-12" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card className="border-dashed p-12 text-center shadow-none bg-card/50">
        <CardContent className="flex flex-col items-center justify-center p-0 space-y-3">
          <div className="rounded-full bg-muted p-4 text-muted-foreground">
            <Inbox className="size-8 stroke-[1.5]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground">No tasks found</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              We couldn&apos;t find any tasks matching your current filters. Try resetting them or add a new task.
            </p>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={resetFilters}>
              Reset Filters
            </Button>
            <Button size="sm" onClick={openCreate}>
              <Plus className="size-4" />
              Create Task
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
