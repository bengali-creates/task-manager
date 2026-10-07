"use client";

import React from "react";
import { Calendar, MoreVertical, Eye, Pencil, Trash2, CheckCircle2, Clock, PlayCircle } from "lucide-react";
import { Task } from "@/types/task";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
          <Badge variant="destructive" className="font-normal uppercase text-[10px] tracking-wider">
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="outline" className="font-normal uppercase text-[10px] tracking-wider">
            Medium
          </Badge>
        );
      case "low":
      default:
        return (
          <Badge variant="secondary" className="font-normal uppercase text-[10px] tracking-wider">
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
    <Card className="flex flex-col justify-between transition-all hover:shadow-md border-border/80">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {getStatusBadge(task.status)}
            {getPriorityBadge(task.priority)}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Task options"
                >
                  <MoreVertical className="size-4" />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openDetails(task)}>
                <Eye className="size-4 mr-2" />
                <span>View Details</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openEdit(task)}>
                <Pencil className="size-4 mr-2" />
                <span>Edit Task</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => openDelete(task)}
              >
                <Trash2 className="size-4 mr-2" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <CardTitle
          onClick={() => openDetails(task)}
          className="mt-2 line-clamp-1 cursor-pointer text-base font-semibold hover:underline"
        >
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
          onClick={() => openDetails(task)}
          className="text-xs hover:text-foreground"
        >
          View
        </Button>
      </CardFooter>
    </Card>
  );
}
