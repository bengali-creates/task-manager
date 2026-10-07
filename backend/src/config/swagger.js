export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Task Management API",
    version: "1.0.0",
    description: "RESTful API for the Task Management System with in-memory storage, filtering, sorting, and pagination.",
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local Development Server",
    },
  ],
  paths: {
    "/api/tasks": {
      get: {
        summary: "Get all tasks",
        description: "Retrieve a paginated list of tasks with search, status, priority, and sorting options.",
        parameters: [
          {
            name: "search",
            in: "query",
            schema: { type: "string" },
            description: "Search keyword matching title or description",
          },
          {
            name: "status",
            in: "query",
            schema: {
              type: "string",
              enum: ["all", "pending", "in_progress", "completed"],
              default: "all",
            },
          },
          {
            name: "priority",
            in: "query",
            schema: {
              type: "string",
              enum: ["all", "low", "medium", "high"],
              default: "all",
            },
          },
          {
            name: "sortBy",
            in: "query",
            schema: {
              type: "string",
              enum: ["createdAt", "dueDate", "priority"],
              default: "createdAt",
            },
          },
          {
            name: "order",
            in: "query",
            schema: {
              type: "string",
              enum: ["asc", "desc"],
              default: "desc",
            },
          },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 6 },
          },
        ],
        responses: {
          200: {
            description: "List of tasks retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    tasks: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Task" },
                    },
                    total: { type: "integer" },
                    page: { type: "integer" },
                    limit: { type: "integer" },
                    totalPages: { type: "integer" },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a task",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TaskInput" },
            },
          },
        },
        responses: {
          201: {
            description: "Task created successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Task" },
              },
            },
          },
          400: {
            description: "Validation error",
          },
        },
      },
    },
    "/api/tasks/{id}": {
      get: {
        summary: "Get a single task by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Task details",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Task" },
              },
            },
          },
          404: {
            description: "Task not found",
          },
        },
      },
      put: {
        summary: "Update an existing task",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TaskUpdateInput" },
            },
          },
        },
        responses: {
          200: {
            description: "Task updated successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Task" },
              },
            },
          },
          400: {
            description: "Validation error",
          },
          404: {
            description: "Task not found",
          },
        },
      },
      delete: {
        summary: "Delete a task by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Task deleted successfully",
          },
          404: {
            description: "Task not found",
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Task: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          status: {
            type: "string",
            enum: ["pending", "in_progress", "completed"],
          },
          priority: {
            type: "string",
            enum: ["low", "medium", "high"],
          },
          dueDate: { type: "string", format: "date" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      TaskInput: {
        type: "object",
        required: ["title", "description"],
        properties: {
          title: { type: "string", example: "Complete assignment" },
          description: { type: "string", example: "Build full-stack task manager" },
          status: {
            type: "string",
            enum: ["pending", "in_progress", "completed"],
            default: "pending",
          },
          priority: {
            type: "string",
            enum: ["low", "medium", "high"],
            default: "medium",
          },
          dueDate: { type: "string", format: "date", example: "2026-10-15" },
        },
      },
      TaskUpdateInput: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          status: {
            type: "string",
            enum: ["pending", "in_progress", "completed"],
          },
          priority: {
            type: "string",
            enum: ["low", "medium", "high"],
          },
          dueDate: { type: "string", format: "date" },
        },
      },
    },
  },
};
