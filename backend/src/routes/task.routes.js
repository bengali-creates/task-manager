import { Router } from "express";
import { taskController } from "../controllers/task.controller.js";
import { validateCreateTask, validateUpdateTask } from "../middleware/validateTask.js";

const router = Router();

router.get("/", taskController.getTasks);
router.get("/:id", taskController.getTaskById);
router.post("/", validateCreateTask, taskController.createTask);
router.put("/:id", validateUpdateTask, taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

export default router;
