"use client";

import React from "react";
import { Calendar, Pencil, Trash2, CheckCircle2, Clock, PlayCircle } from "lucide-react";
import { Task } from "@/types/task";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTaskStore } from "@/store/useTaskStore";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const openDetails = useTaskStore((state) => state.openDetails);
  const openEdit = useTaskStore((state) => state.openEdit);
  const openDelete = useTaskStore((state) => state.openDelete);

  const getStatusBadge = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="secondary" className="gap-1 border font-normal">
            <CheckCircle2 className="size-3 text-primary" />
            <span>Completed</span>
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="default" className="gap-1 font-normal">
            <PlayCircle className="size-3" />
            <span>In Progress</span>
          </Badge>
        );
      case "pending":
      default:
        return (
          <Badge variant="outline" className="gap-1 font-normal">
            <Clock className="size-3 text-muted-foreground" />
            <span>Pending</span>
          </Badge>
        );
    }
  };

  const getPriorityBadge = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return (
          <Badge
            variant="outline"
            className="font-normal uppercase text-[10px] tracking-wider border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-500/10"
          >
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge
            variant="outline"
            className="font-normal uppercase text-[10px] tracking-wider border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10"
          >
            Medium
          </Badge>
        );
      case "low":
      default:
        return (
          <Badge
            variant="outline"
            className="font-normal uppercase text-[10px] tracking-wider border-sky-500/30 text-sky-600 dark:text-sky-400 bg-sky-500/10"
          >
            Low
          </Badge>
        );
    }
  };

  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => openDetails(task)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openDetails(task);
        }
      }}
      className="group relative flex flex-col justify-between overflow-hidden cursor-pointer border border-border/80 transition-all duration-300 ease-out hover:border-primary/60 hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <span className="pointer-events-none absolute top-0 left-0 h-3 w-3 rounded-tl border-t-2 border-l-2 border-primary opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out" />
      <span className="pointer-events-none absolute top-0 right-0 h-3 w-3 rounded-tr border-t-2 border-r-2 border-primary opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out" />
      <span className="pointer-events-none absolute bottom-0 left-0 h-3 w-3 rounded-bl border-b-2 border-l-2 border-primary opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out" />
      <span className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 rounded-br border-b-2 border-r-2 border-primary opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out" />

      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {getStatusBadge(task.status)}
            {getPriorityBadge(task.priority)}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={(e) => {
                e.stopPropagation();
                openEdit(task);
              }}
              className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted"
              aria-label="Edit task"
              title="Edit task"
            >
              <Pencil className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={(e) => {
                e.stopPropagation();
                openDelete(task);
              }}
              className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              aria-label="Delete task"
              title="Delete task"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>

        <CardTitle className="mt-2 line-clamp-1 text-base font-semibold group-hover:text-primary transition-colors">
          {task.title}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-xs leading-relaxed">
          {task.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="py-0" />

      <CardFooter className="pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Calendar className="size-3.5" />
          <span>{formattedDueDate ? `Due ${formattedDueDate}` : "No due date"}</span>
        </div>

        <Button
          variant="ghost"
          size="xs"
          onClick={(e) => {
            e.stopPropagation();
            openDetails(task);
          }}
          className="text-xs hover:text-foreground"
        >
          View
        </Button>
      </CardFooter>
    </Card>
  );
}
