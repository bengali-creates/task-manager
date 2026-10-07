import { taskService } from "../services/task.service.js";

export const taskController = {
  getTasks(req, res, next) {
    try {
      const result = taskService.getAll(req.query);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  getTaskById(req, res, next) {
    try {
      const task = taskService.getById(req.params.id);
      if (!task) {
        return res.status(404).json({
          success: false,
          message: "Task not found",
        });
      }
      return res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  },

  createTask(req, res, next) {
    try {
      const newTask = taskService.create(req.validatedBody);
      return res.status(201).json(newTask);
    } catch (error) {
      next(error);
    }
  },

  updateTask(req, res, next) {
    try {
      const updated = taskService.update(req.params.id, req.validatedBody);
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Task not found",
        });
      }
      return res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  },

  deleteTask(req, res, next) {
    try {
      const deleted = taskService.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Task not found",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Task deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};
