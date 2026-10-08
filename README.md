# TaskFlow — Modern Full-Stack Task Management System

TaskFlow is a minimalist, high-performance task management application built with Next.js 16 (React 19), Tailwind CSS, shadcn/ui, and Express. It features fluid micro-interactions, dark/light theme switching, infinite scroll pagination, debounced real-time search, multi-faceted filtering, and undo protection.

---

## Features

### 1. Infinite Scroll Pagination
- **Powered by TanStack Query (`useInfiniteQuery`)**: Fetches task batches seamlessly as you scroll down.
- **IntersectionObserver Sentinel**: An automated viewport observer triggers `fetchNextPage()` when approaching the end of the list.
- **Manual "Load More" Fallback**: Ensures accessible pagination controls on all devices.
- **Dynamic Total Metrics**: Real-time summary cards display Total Tasks, Completed, In Progress, and Pending counts.

### 2. Debounced Real-Time Search
- **Custom `useDebounce` Hook**: 300ms debounce buffer prevents superfluous API calls while typing.
- **Store Synchronization**: Decoupled local input state smoothly synchronizes with Zustand filter state and invalidates TanStack Query keys.
- **Full-Text Matching**: Searches across both task titles and descriptions.

### 3. Dark & Light Mode (Official shadcn/ui Theme System)
- **`next-themes` Integration**: Complete dark, light, and system theme support.
- **OKLCH Color Tokens**: Tailored CSS variable design system in `globals.css` with smooth transitions.
- **Theme Toggle Component (`ModeToggle`)**: Accessible dropdown menu with rotating Sun and Moon icons positioned directly in the application header.

### 4. Interactive Components & Micro-Interactions (React Bits)
- **`<RubberSegment />`**: Elastic spring-physics tab selector for instant status filtering (`All`, `Pending`, `In Progress`, `Completed`).
- **`<GlideSelect />`**: Smooth animated pill dropdown menus for priority filtering and field sorting.
- **`<HoldButton />`**: 2-second hold-to-confirm interaction for status switching inside the task drawer, preventing accidental updates.
- **`<FuseButton />`**: Interactive burning fuse animation with an undo window (2.5s to 3.5s) for task editing and deletion.
- **`<WarmTooltip />`**: Context-aware tooltips with fluid enter/exit transitions and warm group coordination.

### 5. Task Details Slide-Over Drawer
- Slide-over sheet (`TaskDrawer`) displaying complete task metadata:
  - Formatted creation and last modified timestamps.
  - Priority badges (High: Rose, Medium: Amber, Low: Sky).
  - Status indicator badges (Completed: Emerald, In Progress: Blue, Pending: Slate).
  - Inline 2-second hold status switchers with instant optimistic UI reactivity.
  - Quick action buttons for task editing and deletion with undo fuses.

### 6. Validation & Error Handling
- **Zod Schema Validation**: Enforced both client-side and server-side on creation and updates.
- **Centralized Error Responses**: Clean error messages and validation feedback.

---

## Tech Stack

### Frontend
- **Framework**: [Next.js 16 (App Router, Turbopack)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Component Primitives**: [shadcn/ui](https://ui.shadcn.com/) with [@base-ui/react](https://base-ui.com/)
- **Theming**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Animations**: [motion (Framer Motion)](https://motion.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching & Cache**: [@tanstack/react-query](https://tanstack.com/query)
- **Form Validation**: [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/) & [Hugeicons](https://hugeicons.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express 5](https://expressjs.com/)
- **Validation**: [Zod](https://zod.dev/)
- **API Documentation**: [Swagger UI Express](https://github.com/scottie1984/swagger-ui-express)
- **ID Generation**: [uuid](https://github.com/uuidjs/uuid)
- **CORS Support**: [cors](https://github.com/expressjs/cors)
- **Environment Management**: [dotenv](https://github.com/motdotla/dotenv)

---

## Project Structure

```text
task-manager/
├── backend/
│   ├── src/
│   │   ├── config/             # Swagger and environment configurations
│   │   ├── controllers/        # Request and response controllers
│   │   ├── middleware/         # Zod validation & error handlers
│   │   ├── routes/             # Express task router definitions
│   │   ├── services/           # Business logic & in-memory task store
│   │   ├── app.js              # Express app setup and middleware
│   │   └── server.js           # Server entry point
│   ├── .env                    # Backend environment variables
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── globals.css         # OKLCH design tokens & Tailwind imports
│   │   ├── layout.tsx          # Root layout with ThemeProvider & QueryProvider
│   │   └── page.tsx            # Main dashboard with infinite scroll
│   ├── components/
│   │   ├── tasks/
│   │   │   ├── DeleteConfirmModal.tsx # Delete modal with FuseButton undo
│   │   │   ├── TaskCard.tsx           # Task card with hover effects & badges
│   │   │   ├── TaskDrawer.tsx         # Slide-over drawer with 2s HoldButton
│   │   │   ├── TaskFilters.tsx        # Search, RubberSegment & GlideSelect
│   │   │   ├── TaskFormModal.tsx      # Create/Edit form modal
│   │   │   ├── TaskHeader.tsx         # Header with branding & ModeToggle
│   │   │   ├── TaskList.tsx           # Responsive task cards grid
│   │   │   └── TaskStats.tsx          # Overview counters
│   │   ├── theme-provider.tsx         # NextThemes wrapper
│   │   └── ui/                        # shadcn/ui & React Bits components
│   │       ├── mode-toggle.tsx        # Dark/Light theme toggler
│   │       ├── FuseButton.tsx         # Fuse button with undo window
│   │       ├── GlideSelect.tsx        # Sliding dropdown selector
│   │       ├── HoldButton.tsx         # 2-second press hold button
│   │       ├── RubberSegment.tsx      # Elastic status segmented control
│   │       └── WarmTooltip.tsx        # Micro-animation tooltip
│   ├── hooks/
│   │   ├── useDebounce.ts             # 300ms debounce hook
│   │   └── useTasks.ts                # TanStack query and mutation hooks
│   ├── lib/
│   │   ├── api.ts                     # Fetch client wrapper
│   │   ├── schemas/taskSchema.ts      # Client Zod validation schemas
│   │   └── utils.ts                   # Class name merging utility
│   ├── providers/
│   │   └── QueryProvider.tsx          # TanStack Query client provider
│   ├── store/
│   │   └── useTaskStore.ts            # Zustand client state store
│   ├── .env.local                     # Frontend environment variables
│   └── package.json
└── README.md
```

---

## API Endpoints

Interactive Swagger API documentation is available at `http://localhost:5000/api/docs`.

| Method | Endpoint | Description | Query Parameters |
|---|---|---|---|
| `GET` | `/api/tasks` | Get paginated tasks | `search`, `status`, `priority`, `sortBy`, `order`, `page`, `limit` |
| `GET` | `/api/tasks/:id` | Get single task details | `id` |
| `POST` | `/api/tasks` | Create a new task | Request body validated with Zod |
| `PUT` | `/api/tasks/:id` | Update an existing task | Request body validated with Zod |
| `DELETE` | `/api/tasks/:id` | Delete a task | `id` |

---

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm, pnpm, or yarn

### 1. Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend server runs on `http://localhost:5000`.

### 2. Frontend Setup

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend client runs on `http://localhost:3000`.

---

## Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
CLIENT_URL=http://localhost:3000
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
