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
      <SheetContent side="right" className="sm:max-w-md flex flex-col justify-between overflow-y-auto">
        <div>
          <SheetHeader className="p-0 pb-4 border-b">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-[10px] font-mono">
                ID: {selectedTask.id.slice(0, 8)}
              </Badge>
              <Badge
                variant={
                  selectedTask.priority === "high"
                    ? "destructive"
                    : selectedTask.priority === "medium"
                    ? "outline"
                    : "secondary"
                }
                className="uppercase text-[10px]"
              >
                {selectedTask.priority} Priority
              </Badge>
            </div>
            <SheetTitle className="text-xl font-bold leading-snug">
              {selectedTask.title}
            </SheetTitle>
            <SheetDescription className="text-xs">
              Task details and status management
            </SheetDescription>
          </SheetHeader>

          <div className="py-4 border-b space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Current Status
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <Button
                variant={selectedTask.status === "pending" ? "default" : "outline"}
                size="sm"
                className="text-xs h-8"
                onClick={() => handleQuickStatusChange("pending")}
              >
                <Clock className="size-3 mr-1" />
                Pending
              </Button>
              <Button
                variant={selectedTask.status === "in_progress" ? "default" : "outline"}
                size="sm"
                className="text-xs h-8"
                onClick={() => handleQuickStatusChange("in_progress")}
              >
                <PlayCircle className="size-3 mr-1" />
                Progress
              </Button>
              <Button
                variant={selectedTask.status === "completed" ? "default" : "outline"}
                size="sm"
                className="text-xs h-8"
                onClick={() => handleQuickStatusChange("completed")}
              >
                <CheckCircle2 className="size-3 mr-1" />
                Done
              </Button>
            </div>
          </div>

          <div className="py-4 border-b space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Description
            </label>
            <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
              {selectedTask.description}
            </p>
          </div>

          <div className="py-4 space-y-3 text-xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5" /> Due Date:
              </span>
              <span className="font-medium text-foreground">{formattedDueDate}</span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Created At:</span>
              <span className="font-medium text-foreground">{formattedCreated}</span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Last Modified:</span>
              <span className="font-medium text-foreground">{formattedUpdated}</span>
            </div>
          </div>
        </div>

        <SheetFooter className="p-0 pt-4 border-t flex flex-row items-center gap-2">
          <Button
            variant="outline"
            className="flex-1"
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
            className="flex-1"
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
