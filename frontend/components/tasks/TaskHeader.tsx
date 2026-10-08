"use client";

import React from "react";
import { Plus, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTaskStore } from "@/store/useTaskStore";
import { ModeToggle } from "@/components/ui/mode-toggle";

export function TaskHeader() {
  const openCreate = useTaskStore((state) => state.openCreate);

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <CheckSquare className="size-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">TaskFlow</h1>
          <p className="text-sm text-muted-foreground">
            Manage your daily tasks with status, priority, and deadlines
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
        <ModeToggle />
        <Button onClick={openCreate} className="flex-1 sm:flex-none">
          <Plus className="size-4" />
          <span>Create Task</span>
        </Button>
      </div>
    </header>
  );
}
