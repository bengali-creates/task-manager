"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import FuseButton from "@/components/ui/FuseButton";
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
        <AlertDialogFooter className="flex items-center gap-2">
          <AlertDialogCancel
            onClick={closeAllModals}
            disabled={deleteTaskMutation.isPending}
            className="rounded-full"
          >
            Cancel
          </AlertDialogCancel>
          <FuseButton
            label={deleteTaskMutation.isPending ? "Deleting..." : "Delete Task"}
            icon={<Trash2 className="size-4" />}
            undoLabel="Undo"
            doneLabel="Deleted"
            color="#ffffff"
            background="oklch(0.577 0.245 27.325)"
            fuseColor="#ffffff"
            size="sm"
            radius={22}
            undoWindow={3500}
            fuse="outline"
            fuseThickness={2}
            commitOn="fuseEnd"
            className="rounded-full font-medium"
            onFuseEnd={handleDelete}
            disabled={deleteTaskMutation.isPending}
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
