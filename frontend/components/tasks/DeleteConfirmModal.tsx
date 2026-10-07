"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useTaskStore } from "@/store/useTaskStore";
import { useDeleteTask } from "@/hooks/useTasks";

export function DeleteConfirmModal() {
  const isDeleteOpen = useTaskStore((state) => state.isDeleteOpen);
  const selectedTask = useTaskStore((state) => state.selectedTask);
  const closeAllModals = useTaskStore((state) => state.closeAllModals);

  const deleteTaskMutation = useDeleteTask();

  if (!selectedTask) return null;

  const handleDelete = async () => {
    try {
      await deleteTaskMutation.mutateAsync(selectedTask.id);
      closeAllModals();
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  return (
    <AlertDialog open={isDeleteOpen} onOpenChange={(open) => !open && closeAllModals()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Task</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              &ldquo;{selectedTask.title}&rdquo;
            </span>
            ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={closeAllModals} disabled={deleteTaskMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteTaskMutation.isPending}
          >
            {deleteTaskMutation.isPending ? "Deleting..." : "Delete Task"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
