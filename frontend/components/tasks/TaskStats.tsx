"use client";

import React from "react";
import { CheckCircle2, Clock, ListTodo, PlayCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Task } from "@/types/task";

interface TaskStatsProps {
  tasks: Task[];
  total: number;
}

export function TaskStats({ tasks, total }: TaskStatsProps) {
  const pendingCount = tasks.filter((t) => t.status === "pending").length;
  const inProgressCount = tasks.filter((t) => t.status === "in_progress").length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;

  const stats = [
    {
      label: "Total Tasks",
      value: total,
      icon: ListTodo,
    },
    {
      label: "Pending",
      value: pendingCount,
      icon: Clock,
    },
    {
      label: "In Progress",
      value: inProgressCount,
      icon: PlayCircle,
    },
    {
      label: "Completed",
      value: completedCount,
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="p-4 shadow-none">
            <CardContent className="p-0 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
                  {stat.value}
                </p>
              </div>
              <div className="rounded-lg bg-muted p-2 text-muted-foreground">
                <Icon className="size-4" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
