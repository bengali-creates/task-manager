"use client";

import React from "react";
import { Calendar, Clock, Edit, Trash2, CheckCircle2, PlayCircle } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTaskStore } from "@/store/useTaskStore";
import { useUpdateTask } from "@/hooks/useTasks";
import { TaskStatus } from "@/types/task";

export function TaskDrawer() {
  const isDetailsOpen = useTaskStore((state) => state.isDetailsOpen);
  const selectedTask = useTaskStore((state) => state.selectedTask);
  const closeAllModals = useTaskStore((state) => state.closeAllModals);
  const openEdit = useTaskStore((state) => state.openEdit);
  const openDelete = useTaskStore((state) => state.openDelete);

  const updateTaskMutation = useUpdateTask();

  if (!selectedTask) return null;

  const handleQuickStatusChange = async (newStatus: TaskStatus) => {
    if (newStatus === selectedTask.status) return;
    try {
      await updateTaskMutation.mutateAsync({
        id: selectedTask.id,
        data: { status: newStatus },
      });
      closeAllModals();
    } catch (err) {
      console.error(err);
    }
  };

  const formattedDueDate = selectedTask.dueDate
    ? new Date(selectedTask.dueDate).toLocaleDateString(undefined, {
        dateStyle: "medium",
      })
    : "No deadline specified";

  const formattedCreated = new Date(selectedTask.createdAt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const formattedUpdated = new Date(selectedTask.updatedAt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <Sheet open={isDetailsOpen} onOpenChange={(open) => !open && closeAllModals()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-background border-l border-border/80"
      >
        <div className="space-y-6">
          <SheetHeader className="p-0 space-y-3 pb-5 border-b border-border/60">
            <div className="flex flex-wrap items-center gap-2 pr-8">
              <Badge variant="outline" className="text-[10px] font-mono tracking-wider px-2 py-0.5 bg-muted/50">
                ID: {selectedTask.id.slice(0, 8)}
              </Badge>
              {selectedTask.priority === "high" && (
                <Badge variant="destructive" className="uppercase text-[10px] tracking-wider font-semibold">
                  High Priority
                </Badge>
              )}
              {selectedTask.priority === "medium" && (
                <Badge
                  variant="outline"
                  className="uppercase text-[10px] tracking-wider font-semibold border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10"
                >
                  Medium Priority
                </Badge>
              )}
              {selectedTask.priority === "low" && (
                <Badge
                  variant="secondary"
                  className="uppercase text-[10px] tracking-wider font-semibold text-muted-foreground"
                >
                  Low Priority
                </Badge>
              )}
              {selectedTask.status === "completed" && (
                <Badge
                  variant="secondary"
                  className="gap-1 border font-normal text-[11px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                >
                  <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Completed</span>
                </Badge>
              )}
              {selectedTask.status === "in_progress" && (
                <Badge
                  variant="default"
                  className="gap-1 font-normal text-[11px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                >
                  <PlayCircle className="size-3 text-blue-600 dark:text-blue-400" />
                  <span>In Progress</span>
                </Badge>
              )}
              {selectedTask.status === "pending" && (
                <Badge variant="outline" className="gap-1 font-normal text-[11px]">
                  <Clock className="size-3 text-muted-foreground" />
                  <span>Pending</span>
                </Badge>
              )}
            </div>

            <SheetTitle className="text-xl sm:text-2xl font-bold leading-snug tracking-tight text-foreground pr-8 break-words">
              {selectedTask.title}
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              Task details and status management
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-2.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Current Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={selectedTask.status === "pending" ? "default" : "outline"}
                size="sm"
                className="text-xs h-9 font-medium transition-all"
                onClick={() => handleQuickStatusChange("pending")}
              >
                <Clock className="size-3.5 mr-1.5" />
                Pending
              </Button>
              <Button
                variant={selectedTask.status === "in_progress" ? "default" : "outline"}
                size="sm"
                className="text-xs h-9 font-medium transition-all"
                onClick={() => handleQuickStatusChange("in_progress")}
              >
                <PlayCircle className="size-3.5 mr-1.5" />
                Progress
              </Button>
              <Button
                variant={selectedTask.status === "completed" ? "default" : "outline"}
                size="sm"
                className="text-xs h-9 font-medium transition-all"
                onClick={() => handleQuickStatusChange("completed")}
              >
                <CheckCircle2 className="size-3.5 mr-1.5" />
                Done
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Description
            </label>
            <div className="bg-muted/30 border border-border/60 rounded-xl p-4">
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {selectedTask.description}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Task Information
            </label>
            <div className="bg-muted/20 border border-border/50 rounded-xl p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="size-3.5" /> Due Date
                </span>
                <span className="font-medium text-foreground">{formattedDueDate}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border/40 pt-2.5">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="size-3.5" /> Created At
                </span>
                <span className="font-medium text-foreground">{formattedCreated}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border/40 pt-2.5">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="size-3.5" /> Last Modified
                </span>
                <span className="font-medium text-foreground">{formattedUpdated}</span>
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="p-0 pt-6 mt-6 border-t border-border/60 flex flex-row items-center gap-3">
          <Button
            variant="outline"
            className="flex-1 h-10 font-medium hover:bg-muted"
            onClick={() => {
              const taskToEdit = selectedTask;
              closeAllModals();
              openEdit(taskToEdit);
            }}
          >
            <Edit className="size-4 mr-1.5" />
            Edit
          </Button>
          <Button
            variant="destructive"
            className="flex-1 h-10 font-medium"
            onClick={() => {
              const taskToDelete = selectedTask;
              closeAllModals();
              openDelete(taskToDelete);
            }}
          >
            <Trash2 className="size-4 mr-1.5" />
            Delete
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
