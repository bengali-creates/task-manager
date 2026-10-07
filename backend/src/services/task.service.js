import { v4 as uuidv4 } from "uuid";

let tasks = [
  {
    id: "task-1",
    title: "Implement responsive dashboard UI",
    description: "Design clean task cards with status, priority, and date badges using shadcn components.",
    status: "completed",
    priority: "high",
    dueDate: "2026-10-08",
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: "task-2",
    title: "Integrate TanStack Query & Zustand",
    description: "Setup query invalidation for mutations, debounced search, and modal drawer client state.",
    status: "in_progress",
    priority: "high",
    dueDate: "2026-10-10",
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "task-3",
    title: "Build task creation & edit form with Zod",
    description: "Validate title (min 3 chars), description, status, and due date with instant feedback.",
    status: "pending",
    priority: "medium",
    dueDate: "2026-10-12",
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 10).toISOString(),
  },
  {
    id: "task-4",
    title: "Design slide-over task details drawer",
    description: "Allow users to inspect full task metadata, timestamps, and trigger quick edits.",
    status: "pending",
    priority: "low",
    dueDate: "2026-10-15",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "task-5",
    title: "Setup Node.js & Express REST API",
    description: "Implement routes, controllers, in-memory task service, and centralized error handling.",
    status: "pending",
    priority: "high",
    dueDate: "2026-10-09",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

export const taskService = {
  getAll({
    search = "",
    status = "all",
    priority = "all",
    sortBy = "createdAt",
    order = "desc",
    page = 1,
    limit = 6,
  }) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 6);

    let result = [...tasks];

    if (search && search.trim() !== "") {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(q) ||
          task.description.toLowerCase().includes(q)
      );
    }

    if (status && status !== "all") {
      result = result.filter((task) => task.status === status);
    }

    if (priority && priority !== "all") {
      result = result.filter((task) => task.priority === priority);
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "createdAt") {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === "dueDate") {
        const timeA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        const timeB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        comparison = timeA - timeB;
      } else if (sortBy === "priority") {
        const weight = { low: 1, medium: 2, high: 3 };
        comparison = (weight[a.priority] || 0) - (weight[b.priority] || 0);
      }
      return order === "asc" ? comparison : -comparison;
    });

    const total = result.length;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = result.slice(startIndex, startIndex + limitNum);

    return {
      tasks: paginated,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.max(1, Math.ceil(total / limitNum)),
    };
  },

  getById(id) {
    return tasks.find((task) => task.id === id) || null;
  },

  create({ title, description, status = "pending", priority = "medium", dueDate }) {
    const now = new Date().toISOString();
    const newTask = {
      id: uuidv4(),
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate: dueDate || undefined,
      createdAt: now,
      updatedAt: now,
    };

    tasks.unshift(newTask);
    return newTask;
  },

  update(id, updates) {
    const index = tasks.findIndex((task) => task.id === id);
    if (index === -1) return null;

    const existing = tasks[index];
    const updated = {
      ...existing,
      ...(updates.title !== undefined && { title: updates.title.trim() }),
      ...(updates.description !== undefined && { description: updates.description.trim() }),
      ...(updates.status !== undefined && { status: updates.status }),
      ...(updates.priority !== undefined && { priority: updates.priority }),
      ...(updates.dueDate !== undefined && { dueDate: updates.dueDate || undefined }),
      updatedAt: new Date().toISOString(),
    };

    tasks[index] = updated;
    return updated;
  },

  delete(id) {
    const initialLength = tasks.length;
    tasks = tasks.filter((task) => task.id !== id);
    return tasks.length < initialLength;
  },
};
