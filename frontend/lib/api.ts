import { Task, TaskFilters, TaskListResponse } from "@/types/task";
import { TaskFormData } from "@/lib/schemas/taskSchema";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Fallback seed data in case backend is not running yet during initial frontend development
let mockTasks: Task[] = [
  {
    id: "1",
    title: "Implement responsive dashboard UI",
    description: "Design clean task cards with status, priority, and date badges using shadcn components.",
    status: "completed",
    priority: "high",
    dueDate: "2026-10-08",
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: "2",
    title: "Integrate TanStack Query & Zustand",
    description: "Setup query invalidation for mutations, debounced search, and modal drawer client state.",
    status: "in_progress",
    priority: "high",
    dueDate: "2026-10-10",
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "3",
    title: "Build task creation & edit form with Zod",
    description: "Validate title (min 3 chars), description, status, and due date with instant feedback.",
    status: "pending",
    priority: "medium",
    dueDate: "2026-10-12",
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 10).toISOString(),
  },
  {
    id: "4",
    title: "Design slide-over task details drawer",
    description: "Allow users to inspect full task metadata, timestamps, and trigger quick edits.",
    status: "pending",
    priority: "low",
    dueDate: "2026-10-15",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "5",
    title: "Setup Node.js & Express REST API",
    description: "Implement routes, controllers, in-memory task service, and centralized error handling.",
    status: "pending",
    priority: "high",
    dueDate: "2026-10-09",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

export async function fetchTasks(filters: TaskFilters): Promise<TaskListResponse> {
  const queryParams = new URLSearchParams({
    search: filters.search || "",
    status: filters.status,
    priority: filters.priority,
    sortBy: filters.sortBy,
    order: filters.order,
    page: String(filters.page),
    limit: String(filters.limit),
  });

  try {
    const res = await fetch(`${API_BASE}/tasks?${queryParams.toString()}`, {
      cache: "no-store",
    });

    if (res.ok) {
      return await res.json();
    }
  } catch {
    // If backend isn't running, gracefully serve from mock memory
  }

  // Local fallback processing
  let filtered = [...mockTasks];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(
      (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    );
  }

  if (filters.status !== "all") {
    filtered = filtered.filter((t) => t.status === filters.status);
  }

  if (filters.priority !== "all") {
    filtered = filtered.filter((t) => t.priority === filters.priority);
  }

  // Sorting
  filtered.sort((a, b) => {
    let comparison = 0;
    if (filters.sortBy === "createdAt") {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (filters.sortBy === "dueDate") {
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
      comparison = dateA - dateB;
    } else if (filters.sortBy === "priority") {
      const priorityWeight: Record<string, number> = { low: 1, medium: 2, high: 3 };
      comparison = priorityWeight[a.priority] - priorityWeight[b.priority];
    }
    return filters.order === "asc" ? comparison : -comparison;
  });

  const total = filtered.length;
  const start = (filters.page - 1) * filters.limit;
  const paginatedTasks = filtered.slice(start, start + filters.limit);

  return {
    tasks: paginatedTasks,
    total,
    page: filters.page,
    limit: filters.limit,
    totalPages: Math.max(1, Math.ceil(total / filters.limit)),
  };
}

export async function fetchTaskById(id: string): Promise<Task> {
  try {
    const res = await fetch(`${API_BASE}/tasks/${id}`, { cache: "no-store" });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback
  }

  const found = mockTasks.find((t) => t.id === id);
  if (!found) throw new Error("Task not found");
  return found;
}

export async function createTask(data: TaskFormData): Promise<Task> {
  try {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback
  }

  const newTask: Task = {
    id: String(Date.now()),
    title: data.title,
    description: data.description,
    status: data.status,
    priority: data.priority,
    dueDate: data.dueDate || undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockTasks.unshift(newTask);
  return newTask;
}

export async function updateTask(id: string, data: Partial<TaskFormData>): Promise<Task> {
  try {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback
  }

  const index = mockTasks.findIndex((t) => t.id === id);
  if (index === -1) throw new Error("Task not found");

  const updated: Task = {
    ...mockTasks[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  mockTasks[index] = updated;
  return updated;
}

export async function deleteTask(id: string): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/tasks/${id}`, { method: "DELETE" });
    if (res.ok) {
      return;
    }
  } catch {
    // Fallback
  }

  mockTasks = mockTasks.filter((t) => t.id !== id);
}
