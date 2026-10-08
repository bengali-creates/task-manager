"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil } from "lucide-react";
import GlideSelect from "@/components/ui/GlideSelect";
import FuseButton from "@/components/ui/FuseButton";
import { useTaskStore } from "@/store/useTaskStore";
import { useCreateTask, useUpdateTask } from "@/hooks/useTasks";
import { TaskFormData, taskFormSchema } from "@/lib/schemas/taskSchema";
import { TaskPriority, TaskStatus } from "@/types/task";

const statusOptions = [
  { value: "pending", label: "Pending", tag: "To Do" },
  { value: "in_progress", label: "In Progress", tag: "Active" },
  { value: "completed", label: "Completed", tag: "Done" },
];

const priorityOptions = [
  { value: "high", label: "High Priority", tag: "Urgent" },
  { value: "medium", label: "Medium Priority", tag: "Normal" },
  { value: "low", label: "Low Priority", tag: "Low" },
];

export function TaskFormModal() {
  const isCreateOpen = useTaskStore((state) => state.isCreateOpen);
  const isEditOpen = useTaskStore((state) => state.isEditOpen);
  const selectedTask = useTaskStore((state) => state.selectedTask);
  const closeAllModals = useTaskStore((state) => state.closeAllModals);

  const isOpen = isCreateOpen || isEditOpen;
  const isEditMode = isEditOpen && !!selectedTask;

  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();

  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    dueDate: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditMode && selectedTask) {
      setFormData({
        title: selectedTask.title,
        description: selectedTask.description,
        status: selectedTask.status,
        priority: selectedTask.priority,
        dueDate: selectedTask.dueDate ? selectedTask.dueDate.slice(0, 10) : "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
        dueDate: "",
      });
    }
    setErrors({});
  }, [isEditMode, selectedTask, isOpen]);

  const executeSubmit = async () => {
    const result = taskFormSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});

    try {
      if (isEditMode && selectedTask) {
        await updateTaskMutation.mutateAsync({
          id: selectedTask.id,
          data: result.data,
        });
      } else {
        await createTaskMutation.mutateAsync(result.data);
      }
      closeAllModals();
      return true;
    } catch (err) {
      console.error("Failed to save task:", err);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeSubmit();
  };

  const isSubmitting = createTaskMutation.isPending || updateTaskMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeAllModals()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Task" : "Create New Task"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the details and deadline of your task below."
              : "Fill in the required information to add a task to your board."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Task Title <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="e.g., Finalize project report"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Description <span className="text-destructive">*</span>
            </label>
            <Textarea
              placeholder="Provide context, deliverables, and checklist items..."
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              aria-invalid={!!errors.description}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 flex flex-col">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </label>
              <GlideSelect
                options={statusOptions}
                value={formData.status}
                onChange={(val) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: val as TaskStatus,
                  }))
                }
                ariaLabel="Select task status"
                surfaceColor="var(--background)"
                highlightColor="var(--muted)"
                textColor="var(--foreground)"
                accentColor="var(--primary)"
                size="md"
                radius={8}
                menuWidth={210}
                placement="bottom"
                align="left"
                showTags
                className="w-full [&>button]:w-full [&>button]:justify-between [&>button]:h-9"
              />
            </div>

            <div className="space-y-1.5 flex flex-col">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Priority
              </label>
              <GlideSelect
                options={priorityOptions}
                value={formData.priority}
                onChange={(val) =>
                  setFormData((prev) => ({
                    ...prev,
                    priority: val as TaskPriority,
                  }))
                }
                ariaLabel="Select task priority"
                surfaceColor="var(--background)"
                highlightColor="var(--muted)"
                textColor="var(--foreground)"
                accentColor="var(--primary)"
                size="md"
                radius={8}
                menuWidth={210}
                placement="bottom"
                align="left"
                showTags
                className="w-full [&>button]:w-full [&>button]:justify-between [&>button]:h-9"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Due Date
            </label>
            <Input
              type="date"
              value={formData.dueDate || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
              }
            />
            {errors.dueDate && (
              <p className="text-xs text-destructive">{errors.dueDate}</p>
            )}
          </div>

          <DialogFooter className="pt-4 border-t flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={closeAllModals}
              disabled={isSubmitting}
              className="rounded-full"
            >
              Cancel
            </Button>
            {isEditMode ? (
              <FuseButton
                label={isSubmitting ? "Saving..." : "Update Task"}
                icon={<Pencil className="size-4 mr-1.5" />}
                undoLabel="Undo"
                doneLabel="Updated"
                color="var(--primary-foreground)"
                background="var(--primary)"
                fuseColor="var(--primary-foreground)"
                size="sm"
                radius={22}
                undoWindow={3000}
                fuse="outline"
                commitOn="fuseEnd"
                className="rounded-full font-medium"
                onFuseEnd={executeSubmit}
                disabled={isSubmitting}
              />
            ) : (
              <Button type="submit" disabled={isSubmitting} className="rounded-full font-medium">
                <Plus className="size-4 mr-1.5" />
                {isSubmitting ? "Saving..." : "Create Task"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
