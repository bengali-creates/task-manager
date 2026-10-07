import { create } from "zustand";
import { Task, TaskFilters, TaskPriority, TaskStatus } from "@/types/task";

interface TaskStoreState {
  isCreateOpen: boolean;
  isEditOpen: boolean;
  isDetailsOpen: boolean;
  isDeleteOpen: boolean;
  selectedTask: Task | null;

  filters: TaskFilters;

  openCreate: () => void;
  openEdit: (task: Task) => void;
  openDetails: (task: Task) => void;
  openDelete: (task: Task) => void;
  closeAllModals: () => void;

  setSearch: (search: string) => void;
  setStatusFilter: (status: "all" | TaskStatus) => void;
  setPriorityFilter: (priority: "all" | TaskPriority) => void;
  setSortBy: (sortBy: "createdAt" | "dueDate" | "priority") => void;
  toggleOrder: () => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

const initialFilters: TaskFilters = {
  search: "",
  status: "all",
  priority: "all",
  sortBy: "createdAt",
  order: "desc",
  page: 1,
  limit: 6,
};

export const useTaskStore = create<TaskStoreState>((set) => ({
  isCreateOpen: false,
  isEditOpen: false,
  isDetailsOpen: false,
  isDeleteOpen: false,
  selectedTask: null,

  filters: initialFilters,

  openCreate: () =>
    set({
      isCreateOpen: true,
      selectedTask: null,
    }),

  openEdit: (task) =>
    set({
      isEditOpen: true,
      selectedTask: task,
    }),

  openDetails: (task) =>
    set({
      isDetailsOpen: true,
      selectedTask: task,
    }),

  openDelete: (task) =>
    set({
      isDeleteOpen: true,
      selectedTask: task,
    }),

  closeAllModals: () =>
    set({
      isCreateOpen: false,
      isEditOpen: false,
      isDetailsOpen: false,
      isDeleteOpen: false,
      selectedTask: null,
    }),

  setSearch: (search) =>
    set((state) => ({
      filters: { ...state.filters, search, page: 1 },
    })),

  setStatusFilter: (status) =>
    set((state) => ({
      filters: { ...state.filters, status, page: 1 },
    })),

  setPriorityFilter: (priority) =>
    set((state) => ({
      filters: { ...state.filters, priority, page: 1 },
    })),

  setSortBy: (sortBy) =>
    set((state) => ({
      filters: { ...state.filters, sortBy, page: 1 },
    })),

  toggleOrder: () =>
    set((state) => ({
      filters: {
        ...state.filters,
        order: state.filters.order === "asc" ? "desc" : "asc",
        page: 1,
      },
    })),

  setPage: (page) =>
    set((state) => ({
      filters: { ...state.filters, page },
    })),

  resetFilters: () =>
    set({
      filters: initialFilters,
    }),
}));
