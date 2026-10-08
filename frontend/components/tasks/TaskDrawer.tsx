"use client";

import React from "react";
import { Calendar, Clock, CheckCircle2, PlayCircle, Pencil, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import HoldButton from "@/components/ui/HoldButton";
import FuseButton from "@/components/ui/FuseButton";
import WarmTooltip, { WarmTooltipGroup } from "@/components/ui/WarmTooltip";
import { useTaskStore } from "@/store/useTaskStore";
import { useUpdateTask, useDeleteTask } from "@/hooks/useTasks";
import { TaskStatus } from "@/types/task";

export function TaskDrawer() {
  const isDetailsOpen = useTaskStore((state) => state.isDetailsOpen);
  const selectedTask = useTaskStore((state) => state.selectedTask);
  const updateSelectedTask = useTaskStore((state) => state.updateSelectedTask);
  const closeAllModals = useTaskStore((state) => state.closeAllModals);
  const openEdit = useTaskStore((state) => state.openEdit);

  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  if (!selectedTask) return null;

  const handleQuickStatusChange = async (newStatus: TaskStatus) => {
    if (newStatus === selectedTask.status) return;
    const previousStatus = selectedTask.status;
    updateSelectedTask({ status: newStatus });
    try {
      const updated = await updateTaskMutation.mutateAsync({
        id: selectedTask.id,
        data: { status: newStatus },
      });
      if (updated) {
        updateSelectedTask(updated);
      }
    } catch (err) {
      console.error(err);
      updateSelectedTask({ status: previousStatus });
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
              <Badge variant="outline" className="text-[10px] font-mono tracking-wider px-2 py-0.5 bg-muted/50 rounded-full">
                ID: {selectedTask.id.slice(0, 8)}
              </Badge>
              {selectedTask.priority === "high" && (
                <Badge
                  variant="outline"
                  className="uppercase text-[10px] tracking-wider font-semibold border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-500/10 rounded-full"
                >
                  High Priority
                </Badge>
              )}
              {selectedTask.priority === "medium" && (
                <Badge
                  variant="outline"
                  className="uppercase text-[10px] tracking-wider font-semibold border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10 rounded-full"
                >
                  Medium Priority
                </Badge>
              )}
              {selectedTask.priority === "low" && (
                <Badge
                  variant="outline"
                  className="uppercase text-[10px] tracking-wider font-semibold border-sky-500/30 text-sky-600 dark:text-sky-400 bg-sky-500/10 rounded-full"
                >
                  Low Priority
                </Badge>
              )}
              {selectedTask.status === "completed" && (
                <Badge
                  variant="secondary"
                  className="gap-1 border font-normal text-[11px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 rounded-full"
                >
                  <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Completed</span>
                </Badge>
              )}
              {selectedTask.status === "in_progress" && (
                <Badge
                  variant="default"
                  className="gap-1 font-normal text-[11px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-full"
                >
                  <PlayCircle className="size-3 text-blue-600 dark:text-blue-400" />
                  <span>In Progress</span>
                </Badge>
              )}
              {selectedTask.status === "pending" && (
                <Badge variant="outline" className="gap-1 font-normal text-[11px] rounded-full">
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
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Current Status
              </label>
              <span className="text-[11px] text-muted-foreground font-normal">
                Hold 2s to switch
              </span>
            </div>
            <WarmTooltipGroup delay={200} warmWindow={300}>
              <div className="grid grid-cols-3 gap-2">
                <WarmTooltip
                  content={selectedTask.status === "pending" ? "Active: Pending" : "Hold 2s to set as Pending"}
                  side="top"
                  surfaceColor="var(--popover)"
                  inkColor="var(--popover-foreground)"
                >
                  <HoldButton
                    holdTime={2000}
                    releaseTime={200}
                    size="sm"
                    radius={18}
                    backgroundColor={selectedTask.status === "pending" ? "#18181b" : "var(--muted)"}
                    fillColor="#64748b"
                    textColor={selectedTask.status === "pending" ? "#ffffff" : "var(--foreground)"}
                    fillTextColor="#ffffff"
                    icon={<Clock className="size-3.5 mr-1" />}
                    doneIcon={<Clock className="size-3.5 mr-1" />}
                    doneLabel="Pending"
                    onHold={() => handleQuickStatusChange("pending")}
                    className={`w-full justify-center rounded-full transition-all ${
                      selectedTask.status === "pending"
                        ? "ring-2 ring-foreground/20 font-semibold shadow-sm"
                        : "opacity-85 hover:opacity-100"
                    }`}
                  >
                    Pending
                  </HoldButton>
                </WarmTooltip>

                <WarmTooltip
                  content={selectedTask.status === "in_progress" ? "Active: In Progress" : "Hold 2s to set as In Progress"}
                  side="top"
                  surfaceColor="var(--popover)"
                  inkColor="var(--popover-foreground)"
                >
                  <HoldButton
                    holdTime={2000}
                    releaseTime={200}
                    size="sm"
                    radius={18}
                    backgroundColor={selectedTask.status === "in_progress" ? "#2563eb" : "var(--muted)"}
                    fillColor="#1d4ed8"
                    textColor={selectedTask.status === "in_progress" ? "#ffffff" : "var(--foreground)"}
                    fillTextColor="#ffffff"
                    icon={<PlayCircle className="size-3.5 mr-1" />}
                    doneIcon={<PlayCircle className="size-3.5 mr-1" />}
                    doneLabel="In Progress"
                    onHold={() => handleQuickStatusChange("in_progress")}
                    className={`w-full justify-center rounded-full transition-all ${
                      selectedTask.status === "in_progress"
                        ? "ring-2 ring-blue-500/40 font-semibold shadow-sm"
                        : "opacity-85 hover:opacity-100"
                    }`}
                  >
                    In Progress
                  </HoldButton>
                </WarmTooltip>

                <WarmTooltip
                  content={selectedTask.status === "completed" ? "Active: Completed" : "Hold 2s to set as Completed"}
                  side="top"
                  surfaceColor="var(--popover)"
                  inkColor="var(--popover-foreground)"
                >
                  <HoldButton
                    holdTime={2000}
                    releaseTime={200}
                    size="sm"
                    radius={18}
                    backgroundColor={selectedTask.status === "completed" ? "#16a34a" : "var(--muted)"}
                    fillColor="#15803d"
                    textColor={selectedTask.status === "completed" ? "#ffffff" : "var(--foreground)"}
                    fillTextColor="#ffffff"
                    icon={<CheckCircle2 className="size-3.5 mr-1" />}
                    doneIcon={<CheckCircle2 className="size-3.5 mr-1" />}
                    doneLabel="Completed"
                    onHold={() => handleQuickStatusChange("completed")}
                    className={`w-full justify-center rounded-full transition-all ${
                      selectedTask.status === "completed"
                        ? "ring-2 ring-emerald-500/40 font-semibold shadow-sm"
                        : "opacity-85 hover:opacity-100"
                    }`}
                  >
                    Completed
                  </HoldButton>
                </WarmTooltip>
              </div>
            </WarmTooltipGroup>
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
          <FuseButton
            label="Edit Task"
            icon={<Pencil className="size-4" />}
            undoLabel="Undo"
            doneLabel="Opening..."
            color="var(--foreground)"
            background="var(--muted)"
            fuseColor="var(--primary)"
            size="sm"
            radius={22}
            undoWindow={2500}
            fuse="outline"
            commitOn="fuseEnd"
            className="flex-1 rounded-full font-medium"
            onFuseEnd={() => {
              const taskToEdit = selectedTask;
              closeAllModals();
              openEdit(taskToEdit);
            }}
          />
          <FuseButton
            label="Delete Task"
            icon={<Trash2 className="size-4" />}
            undoLabel="Undo"
            doneLabel="Deleted"
            color="#ef4444"
            background="color-mix(in srgb, #ef4444 12%, transparent)"
            fuseColor="#ef4444"
            size="sm"
            radius={22}
            undoWindow={3500}
            fuse="outline"
            fuseThickness={2}
            commitOn="fuseEnd"
            className="flex-1 rounded-full font-medium"
            onFuseEnd={async () => {
              try {
                await deleteTaskMutation.mutateAsync(selectedTask.id);
                closeAllModals();
              } catch (err) {
                console.error(err);
              }
            }}
          />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
