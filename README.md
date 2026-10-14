# Project & Team Management System - Frontend Client

> **Enterprise-grade, responsive single-page application built with React, Vite, Tailwind CSS, Redux Toolkit (RTK), and Axios.**

---

## 1. Overview & Core Features

The frontend application provides a modern, responsive, and accessible interface for managing projects, sprint tasks, team bandwidth, and collaboration comments.

### Key Capabilities:
- **Responsive Workspace**: Seamless user experience across mobile phones, tablets, laptops, and desktop screens with custom drawer navigation and glassmorphism cards.
- **Redux Toolkit State Management**: Centralized store handling slices for `auth`, `projects`, `tasks`, `dashboard`, `users`, and `ui` with async thunks.
- **Password-Protected "View Project" Feature**: Prominent top-bar button unlocking the protected system architecture documentation upon entering the passkey `Shiv@818780` (verified securely by backend).
- **Interactive Dashboard**: Real-time aggregated statistics from MongoDB, overdue alerts, tasks grouped by status, upcoming deadlines, and activity logs.
- **Sprint Task Lifecycle**: Real-time status transitions (`To Do`, `In Progress`, `In Review`, `Done`), multidimensional filters (project, priority, status, overdue), and instant search.
- **Project Progress Monitoring**: Visual completion rate trackers, timeline dates, and team member management.
- **User & Team Management**: Administrative portal to manage organizational roles (`Admin`, `Project Manager`, `Team Member`) and account activation.
- **Accessible UI Design System**: Tailored brand color tokens, WCAG-compliant contrasts, micro-animations, loading skeletons, and toast feedback.

---

## 2. Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **React (v19)** | Declarative component UI library |
| **Vite (v8)** | Next-generation frontend tooling and bundler |
| **Tailwind CSS (v3.4)** | Utility-first CSS framework with custom design tokens |
| **Redux Toolkit (RTK)** | Predictable, centralized application state container |
| **React Router DOM (v7)** | Client-side declarative routing and protected route guards |
| **Axios** | HTTP client with request and response interceptors |
| **Lucide React** | Crisp, consistent SVG icons |

---

## 3. Project Directory Structure

```
Task_Manager_Frontend/
├── public/
│   ├── _redirects              # Netlify client-side routing redirect rule
│   └── favicon.svg             # Application SVG favicon
├── src/
│   ├── assets/                 # Static media and brand assets
│   ├── components/
│   │   ├── common/             # Reusable UI primitives
│   │   │   ├── Button.jsx      # Buttons with variants (primary, outline, danger) & loading spinner
│   │   │   ├── Input.jsx       # Inputs, textareas, and select components with error states
│   │   │   ├── Modal.jsx       # Responsive modal with backdrop blur & escape listener
│   │   │   ├── Badge.jsx       # Color-coded badges for statuses, priorities, and roles
│   │   │   ├── Pagination.jsx  # Database-backed pagination controls
│   │   │   └── ToastContainer.jsx # Floating auto-dismiss notifications
│   │   ├── forms/
│   │   │   ├── ProjectFormModal.jsx # Project creation & editing modal
│   │   │   └── TaskFormModal.jsx    # Task creation & editing modal
│   │   └── layout/
│   │       ├── Navbar.jsx      # Header with "View Project" button & user profile
│   │       ├── Sidebar.jsx     # Responsive navigation sidebar
│   │       └── ViewProjectModal.jsx # Password entry modal for Shiv@818780
│   ├── layouts/
│   │   ├── AppLayout.jsx       # Authenticated layout with Navbar + Sidebar
│   │   ├── AuthLayout.jsx      # Unauthenticated layout with background gradients
│   │   └── ProtectedRoute.jsx  # Role-based route guard
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx   # Login page with 1-click recruiter demo account presets
│   │   │   └── RegisterPage.jsx# User registration with role selection
│   │   ├── dashboard/
│   │   │   └── DashboardPage.jsx # Database-driven metrics, status charts, activity feed
│   │   ├── projects/
│   │   │   ├── ProjectListPage.jsx # Projects grid with search, filter, and progress bars
│   │   │   └── ProjectDetailsPage.jsx # Project milestones, tasks, members & audit logs
│   │   ├── tasks/
│   │   │   ├── TaskListPage.jsx # Multidimensional task filtering, search & quick status updater
│   │   │   └── TaskDetailsPage.jsx # Task workflow, comments section, and history
│   │   ├── users/
│   │   │   └── UserManagementPage.jsx # User directory & role management (Admin/PM)
│   │   ├── project-explanation/
│   │   │   └── ProjectExplanationPage.jsx # Password-unlocked technical portfolio guide
│   │   └── NotFoundPage.jsx
│   ├── redux/
│   │   ├── slices/
│   │   │   ├── authSlice.js    # Auth tokens, user profile, login/logout thunks
│   │   │   ├── projectSlice.js # Projects list, details, CRUD thunks
│   │   │   ├── taskSlice.js    # Tasks filtering, status transition, comments
│   │   │   ├── dashboardSlice.js # Aggregated metrics and KPI state
│   │   │   ├── userSlice.js    # Team member directory and role management
│   │   │   └── uiSlice.js      # Modals, toasts, and View Project unlock state
│   │   └── store.js            # Combined Redux root store
│   ├── services/
│   │   ├── api.js              # Axios instance with auth interceptors & 401 handling
│   │   ├── authService.js
│   │   ├── projectService.js
│   │   ├── taskService.js
│   │   ├── dashboardService.js
│   │   ├── userService.js
│   │   └── explanationService.js
│   ├── routes/
│   │   └── AppRoutes.jsx       # Route table mapping paths to components
│   ├── App.jsx                 # App root with session hydration
│   ├── main.jsx                # Application mounting with Redux Provider
│   ├── index.css               # Tailwind CSS directives and custom utilities
│   └── vite.config.js
├── vercel.json                 # Vercel SPA rewrite configuration
├── tailwind.config.js
├── postcss.config.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 4. Prerequisites & Installation

### Prerequisites:
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)

### Installation Steps:
```bash
# 1. Navigate to frontend directory
cd Task_Manager_Frontend

# 2. Install dependencies
npm install

# 3. Create your local .env file
cp .env.example .env
```

---

## 5. Environment Variables Configuration

Configure `.env` using `.env.example`:

```env
# Backend REST API base URL
VITE_API_BASE_URL=http://localhost:5000/api
```

For production deployment, set `VITE_API_BASE_URL` to your live deployed backend URL (e.g. `https://your-backend-api.onrender.com/api`).

---

## 6. Running Locally

```bash
# Start development server
npm run dev
```

The application will start at `http://localhost:5173`.

---

## 7. Password-Protected "View Project" Feature

A key feature for portfolio reviewers, recruiters, and evaluators:
1. Click the **View Project** button in the top navigation bar (or from the login page header).
2. Enter the passcode: `Shiv@818780`.
3. The password is submitted to the backend API (`/api/project-explanation/verify`), which validates the key and issues a signed, short-lived JWT token.
4. The client unlocks the **Architecture & Docs** page, presenting:
   - System introduction & business problem solved
   - Frontend and Backend technology choices
   - Role-Based Access Control matrix
   - Database model schemas & relationships
   - API endpoints documentation
   - 1-Click demo test credentials

---

## 8. 1-Click Demo Accounts for Quick Evaluation

On the Login page, 3 one-click autofill buttons are available:
- **Admin**: `admin@taskmanager.com` / `Password@123`
- **Project Manager**: `pm@taskmanager.com` / `Password@123`
- **Team Member**: `alex@taskmanager.com` / `Password@123`

---

## 9. Production Build & Deployment

### Building the Bundle:
```bash
npm run build
```
This generates an optimized production bundle in the `dist/` directory.

### Deploying to Vercel:
1. Connect your GitHub repository `project-team-management-frontend`.
2. Configure **Root Directory** as `Task_Manager_Frontend` (or root if standalone repo).
3. Set **Framework Preset** to `Vite`.
4. Add environment variable:
   - `VITE_API_BASE_URL=https://your-live-backend-domain.com/api`
5. The included `vercel.json` automatically handles client-side SPA routing rewrites.

### Deploying to Netlify:
1. Connect your repository.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. The included `public/_redirects` ensures all paths resolve to `index.html`.

---

## 10. Git Repository Push Commands

To publish this frontend into its own independent GitHub repository:

```bash
cd Task_Manager_Frontend
git init
git add .
git commit -m "feat: complete production-ready project & team management frontend"
git branch -M main
git remote add origin https://github.com/<your-username>/project-team-management-frontend.git
git push -u origin main
```
