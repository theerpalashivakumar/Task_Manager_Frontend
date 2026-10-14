import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  openExplanationModal,
  fetchExplanationContent,
  lockExplanation,
} from '../../redux/slices/uiSlice';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import {
  ShieldCheck,
  Lock,
  Unlock,
  Layers,
  Database,
  Cpu,
  Server,
  FolderTree,
  FileCode,
  KeyRound,
  CheckCircle2,
  Terminal,
  Activity,
  Code2,
  Globe,
  GitBranch,
  FileText,
  Workflow,
  Sparkles,
} from 'lucide-react';

const ProjectExplanationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    isExplanationUnlocked,
    explanationData,
    explanationLoading,
    explanationError,
  } = useSelector((state) => state.ui);

  const [activeTab, setActiveTab] = useState('prompt');

  useEffect(() => {
    if (isExplanationUnlocked) {
      dispatch(fetchExplanationContent());
    }
  }, [isExplanationUnlocked, dispatch]);

  if (!isExplanationUnlocked) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-2xl text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-500/20">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Restricted Architectural Specification
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            This technical portfolio document contains full system designs, database schemas, and architectural walkthroughs.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
          <p className="font-semibold text-slate-800">Passkey Authentication Required</p>
          <p className="mt-1 text-slate-500">
            Please enter your designated access passkey to unlock the system documentation.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={() => dispatch(openExplanationModal())}
          icon={KeyRound}
        >
          Enter Passkey to Unlock
        </Button>
      </div>
    );
  }

  if (explanationLoading && !explanationData) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-8">
        <div className="h-10 w-96 bg-slate-200 rounded-2xl animate-pulse" />
        <div className="h-64 bg-slate-200 rounded-3xl animate-pulse" />
      </div>
    );
  }

  const tabs = [
    { id: 'prompt', label: 'Development Prompt', icon: FileText },
    { id: 'stack', label: 'Tech Stack & Architecture', icon: Layers },
    { id: 'rbac', label: 'Roles & Permissions', icon: KeyRound },
    { id: 'folders', label: 'Folder Structures', icon: FolderTree },
    { id: 'database', label: 'Database Schemas', icon: Database },
    { id: 'api', label: 'REST API Catalog', icon: Globe },
    { id: 'deployment', label: 'Setup & Deployment', icon: Server },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-4 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" /> Authenticated System Specifications
            </span>
            <span className="text-xs text-slate-400">v1.0.0</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Project & Team Management System
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Full-stack MERN production system built with decoupled frontend/backend services, role-based authorization guards, and dynamic database metrics.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              dispatch(lockExplanation());
              navigate('/dashboard');
            }}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md"
            icon={Lock}
          >
            Lock & Exit
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 ">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${isActive
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Development Prompt & Overview */}
      {activeTab === 'prompt' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600" />
              Complete Full-Stack MERN Project Development Prompt
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              <strong>Objective:</strong> Develop a complete, professional, production-ready Project & Team Management System using the MERN stack. The application allows an organization to manage projects, assign tasks to team members, track project progress, monitor deadlines, and manage collaboration between users with different roles (Admin, Project Manager, Team Member).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <h4 className="text-xs font-bold text-slate-900">Key Architectural Principles</h4>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  <li>Modular and reusable architecture following the DRY principle</li>
                  <li>Strict server-side role-based authorization on all mutations</li>
                  <li>Database-backed metrics with zero hardcoded statistics</li>
                  <li>Automatic completion percentage calculations on task status changes</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <h4 className="text-xs font-bold text-slate-900">Portfolio Security Requirement</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Contains a password-protected View Project feature. Visitors must enter passkey <code className="bg-slate-200 px-1.5 py-0.5 rounded text-brand-700 font-mono font-bold">Personal_key</code> to unlock technical architecture specifications. Restrictive access ensures non-logged-in visitors cannot bypass verification.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-brand-600" />
              Problem Solved & Real-World Value
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Engineering and project operations teams frequently experience fragmented task tracking, unmonitored team bandwidth, lack of audit trails, and insecure permission leaks where members can modify critical project parameters outside their authorization scope.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              This system delivers strict server-enforced resource-level authorization, automated completion percentage calculations triggered by task status transitions, immutable audit logs with verified user identities, and database-level query optimization with zero placeholder data.
            </p>
          </div>

          {/* Evaluation Credentials */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-50/80 to-indigo-50/60 border border-brand-100 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-brand-950 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-brand-600" />
              Pre-Configured Demo Accounts for Evaluation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white border border-brand-200/80 shadow-sm">
                <span className="font-bold text-purple-700 block">Administrator</span>
                <span className="text-slate-700 block mt-1 font-mono">admin@taskmanager.com</span>
                <span className="text-slate-400 block text-[11px] mt-0.5">Password: Password@123</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-brand-200/80 shadow-sm">
                <span className="font-bold text-indigo-700 block">Project Manager</span>
                <span className="text-slate-700 block mt-1 font-mono">pm@taskmanager.com</span>
                <span className="text-slate-400 block text-[11px] mt-0.5">Password: Password@123</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-brand-200/80 shadow-sm">
                <span className="font-bold text-teal-700 block">Team Member</span>
                <span className="text-slate-700 block mt-1 font-mono">alex@taskmanager.com</span>
                <span className="text-slate-400 block text-[11px] mt-0.5">Password: Password@123</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Tech Stack & Architecture */}
      {activeTab === 'stack' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-brand-600" />
                Frontend Technology Stack
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>React 19 & Vite:</strong> Ultra-fast build times, ES modules, instant HMR.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Tailwind CSS:</strong> Curated design tokens, responsive breakpoints, accessible controls.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Redux Toolkit (RTK):</strong> Centralized state slices (auth, projects, tasks, users, dashboard, ui).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>React Router DOM v6:</strong> Declarative client-side routing, protected route guards.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Axios:</strong> Request/response interceptors for automatic JWT Bearer token injection.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Lucide React:</strong> Crisp, lightweight iconography throughout all screens.</span>
                </li>
              </ul>
            </div>

            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Server className="w-5 h-5 text-brand-600" />
                Backend Technology Stack
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Node.js & Express.js:</strong> Modular Controller-Service-Repository architecture.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>MongoDB & Mongoose:</strong> Document schemas, indexing, relations, aggregation pipelines.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>JWT & bcrypt:</strong> Salted password hashing (10 rounds) and stateless token authentication.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>express-rate-limit:</strong> Protection against brute-force attacks on sensitive endpoints.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Helmet & CORS:</strong> HTTP security headers and strict origin configuration.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Centralized Error Handling:</strong> Custom ApiError envelope with safe responses.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Workflow className="w-5 h-5 text-brand-600" />
              Core Architectural Decisions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="font-bold text-slate-900 block mb-1">Service Layer Abstraction</span>
                <span>Controllers only handle HTTP requests and parameter parsing. All business logic, DB queries, and validations live in dedicated Service modules.</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="font-bold text-slate-900 block mb-1">Atomic Progress Recalculation</span>
                <span>Project completion percentage updates automatically in MongoDB whenever tasks transition status, keeping dashboard queries fast and O(1).</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="font-bold text-slate-900 block mb-1">Database-Level Pagination</span>
                <span>Tasks and users are queried with MongoDB <code className="text-brand-700">.skip()</code> and <code className="text-brand-700">.limit()</code> with indexes on frequent filters.</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="font-bold text-slate-900 block mb-1">Tamper-Proof Activity Audit</span>
                <span>All activity records derive the actor from the verified server-side JWT context, never trusting client-supplied author IDs.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Roles & Permissions Matrix */}
      {activeTab === 'rbac' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-brand-600" />
              Role-Based Access Control (RBAC) Specification
            </h3>
            <p className="text-xs text-slate-500">
              Permissions are enforced on the backend middleware layer. Frontend buttons and forms conditionally render for enhanced user experience, but unauthorized direct API requests are blocked with HTTP 403 Forbidden.
            </p>

            <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200/80">
                  <tr>
                    <th className="p-3.5">Role</th>
                    <th className="p-3.5">Scope</th>
                    <th className="p-3.5">Project Operations</th>
                    <th className="p-3.5">Task Operations</th>
                    <th className="p-3.5">User Management</th>
                    <th className="p-3.5">Dashboard Visibility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-bold text-purple-700">Admin</td>
                    <td className="p-3.5 font-semibold text-slate-800">Organization-wide</td>
                    <td className="p-3.5">Create, edit, delete, archive, assign PM and members across all projects</td>
                    <td className="p-3.5">Full CRUD across all projects, assign & reassign tasks</td>
                    <td className="p-3.5 text-emerald-700 font-semibold">Full control: edit roles, toggle active status</td>
                    <td className="p-3.5 font-semibold text-slate-900">Global org metrics</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-bold text-indigo-700">Project Manager</td>
                    <td className="p-3.5 font-semibold text-slate-800">Authorized Projects</td>
                    <td className="p-3.5">Create projects, manage members & details for owned projects</td>
                    <td className="p-3.5">Create, edit, assign, and delete tasks in authorized projects</td>
                    <td className="p-3.5 text-slate-400">View team directory only</td>
                    <td className="p-3.5 font-semibold text-slate-900">Managed projects & team metrics</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-bold text-teal-700">Team Member</td>
                    <td className="p-3.5 font-semibold text-slate-800">Assigned Work</td>
                    <td className="p-3.5">View projects where listed as a team member</td>
                    <td className="p-3.5">View tasks, update status of assigned tasks, post comments</td>
                    <td className="p-3.5 text-slate-400">No access</td>
                    <td className="p-3.5 font-semibold text-slate-900">Personal assigned tasks & deadlines</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Folder Structures */}
      {activeTab === 'folders' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-brand-600" />
                Frontend Folder Structure
              </h3>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="font-mono font-bold text-brand-700">src/components/common/</span>
                  <p className="text-slate-500 mt-0.5">Reusable atoms: Button, Input, Modal, Badge, Pagination, Toast</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="font-mono font-bold text-brand-700">src/components/forms/</span>
                  <p className="text-slate-500 mt-0.5">ProjectFormModal, TaskFormModal with interactive validations</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="font-mono font-bold text-brand-700">src/components/layout/</span>
                  <p className="text-slate-500 mt-0.5">Navbar, Sidebar, ViewProjectModal passkey dialog</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="font-mono font-bold text-brand-700">src/layouts/</span>
                  <p className="text-slate-500 mt-0.5">AppLayout, AuthLayout, ProtectedRoute (role guards)</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="font-mono font-bold text-brand-700">src/pages/</span>
                  <p className="text-slate-500 mt-0.5">Dashboard, Projects, Tasks, Users, Project Explanation</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="font-mono font-bold text-brand-700">src/redux/slices/</span>
                  <p className="text-slate-500 mt-0.5">RTK slices: auth, projects, tasks, users, dashboard, ui</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="font-mono font-bold text-brand-700">src/services/</span>
                  <p className="text-slate-500 mt-0.5">Axios client with Bearer interceptors & unified error handling</p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-indigo-600" />
                Backend Folder Structure
              </h3>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="font-mono font-bold text-indigo-700">src/config/</span>
                  <p className="text-slate-500 mt-0.5">Mongoose connection configuration & environment validation</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="font-mono font-bold text-indigo-700">src/models/</span>
                  <p className="text-slate-500 mt-0.5">Mongoose schemas: User, Project, Task, TaskComment, ActivityLog</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="font-mono font-bold text-indigo-700">src/controllers/</span>
                  <p className="text-slate-500 mt-0.5">HTTP request parsing, status codes, standard ApiResponse</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="font-mono font-bold text-indigo-700">src/services/</span>
                  <p className="text-slate-500 mt-0.5">Business logic, aggregation queries, and calculation routines</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="font-mono font-bold text-indigo-700">src/middlewares/</span>
                  <p className="text-slate-500 mt-0.5">JWT authentication, RBAC authorization, rate limiting, error handling</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="font-mono font-bold text-indigo-700">src/validators/</span>
                  <p className="text-slate-500 mt-0.5">Express-validator request body schemas</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="font-mono font-bold text-indigo-700">tests/</span>
                  <p className="text-slate-500 mt-0.5">Automated test suite (47 tests covering all core scenarios)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Database Schemas */}
      {activeTab === 'database' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-brand-600" />
              Mongoose Schemas & Relational Reference Model
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1.5">
                <span className="font-bold text-brand-700 block text-sm">User</span>
                <p className="text-slate-500">Represents employees, managers, and administrators.</p>
                <div className="font-mono text-[11px] text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 space-y-0.5">
                  <div>_id: ObjectId</div>
                  <div>name: String (required)</div>
                  <div>email: String (unique, index)</div>
                  <div>password: String (bcrypt hash)</div>
                  <div>role: 'admin' | 'project_manager' | 'team_member'</div>
                  <div>avatar: String</div>
                  <div>isActive: Boolean (default true)</div>
                  <div>timestamps: true</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1.5">
                <span className="font-bold text-brand-700 block text-sm">Project</span>
                <p className="text-slate-500">Core organizational container for tasks and members.</p>
                <div className="font-mono text-[11px] text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 space-y-0.5">
                  <div>_id: ObjectId</div>
                  <div>name: String (required)</div>
                  <div>description: String</div>
                  <div>startDate: Date</div>
                  <div>deadline: Date</div>
                  <div>status: 'Planning' | 'Active' | 'On Hold' | 'Completed'</div>
                  <div>projectManager: ObjectId (Ref: User)</div>
                  <div>members: [ObjectId] (Ref: User)</div>
                  <div>isArchived: Boolean</div>
                  <div>completionPercentage: Number (0-100)</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1.5">
                <span className="font-bold text-brand-700 block text-sm">Task</span>
                <p className="text-slate-500">Atomic work unit assigned to an individual team member.</p>
                <div className="font-mono text-[11px] text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 space-y-0.5">
                  <div>_id: ObjectId</div>
                  <div>title: String (required)</div>
                  <div>description: String</div>
                  <div>project: ObjectId (Ref: Project, index)</div>
                  <div>assignedTo: ObjectId (Ref: User, index)</div>
                  <div>priority: 'Low' | 'Medium' | 'High' | 'Critical'</div>
                  <div>status: 'To Do' | 'In Progress' | 'In Review' | 'Done'</div>
                  <div>dueDate: Date (index)</div>
                  <div>createdBy: ObjectId (Ref: User)</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1.5">
                <span className="font-bold text-brand-700 block text-sm">ActivityLog & TaskComment</span>
                <p className="text-slate-500">Collaboration feedback and immutable audit trails.</p>
                <div className="font-mono text-[11px] text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 space-y-0.5">
                  <div><strong>TaskComment:</strong></div>
                  <div>content: String, task: Ref(Task), author: Ref(User)</div>
                  <div className="pt-1"><strong>ActivityLog:</strong></div>
                  <div>action: String, entityType: 'project' | 'task'</div>
                  <div>project: Ref(Project), task: Ref(Task)</div>
                  <div>performedBy: Ref(User), details: Object</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: REST API Catalog */}
      {activeTab === 'api' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-brand-600" />
              RESTful API Endpoint Documentation
            </h3>
            <p className="text-xs text-slate-500">
              All routes return a standard JSON envelope: <code className="text-brand-700 font-mono">&#123; success: true, message: "...", data: &#123; ... &#125; &#125;</code>
            </p>

            <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200/80">
                  <tr>
                    <th className="p-3">Method</th>
                    <th className="p-3">Endpoint</th>
                    <th className="p-3">Access Level</th>
                    <th className="p-3">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-mono">
                  <tr>
                    <td className="p-3 text-emerald-600 font-bold">POST</td>
                    <td className="p-3">/api/auth/register</td>
                    <td className="p-3 text-slate-500 font-sans">Public</td>
                    <td className="p-3 text-slate-700 font-sans">Register a new user account</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-emerald-600 font-bold">POST</td>
                    <td className="p-3">/api/auth/login</td>
                    <td className="p-3 text-slate-500 font-sans">Public</td>
                    <td className="p-3 text-slate-700 font-sans">Authenticate user and issue JWT</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-blue-600 font-bold">GET</td>
                    <td className="p-3">/api/projects</td>
                    <td className="p-3 text-slate-500 font-sans">Authenticated</td>
                    <td className="p-3 text-slate-700 font-sans">List projects scoped by user role</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-emerald-600 font-bold">POST</td>
                    <td className="p-3">/api/projects</td>
                    <td className="p-3 text-purple-600 font-sans font-bold">Admin / PM</td>
                    <td className="p-3 text-slate-700 font-sans">Create a new project</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-amber-600 font-bold">PATCH</td>
                    <td className="p-3">/api/projects/:id</td>
                    <td className="p-3 text-purple-600 font-sans font-bold">Admin / PM</td>
                    <td className="p-3 text-slate-700 font-sans">Update project details or status</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-rose-600 font-bold">DELETE</td>
                    <td className="p-3">/api/projects/:id</td>
                    <td className="p-3 text-purple-600 font-sans font-bold">Admin / PM</td>
                    <td className="p-3 text-slate-700 font-sans">Delete project and cascade tasks</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-blue-600 font-bold">GET</td>
                    <td className="p-3">/api/tasks</td>
                    <td className="p-3 text-slate-500 font-sans">Authenticated</td>
                    <td className="p-3 text-slate-700 font-sans">Search, filter, paginate task items</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-emerald-600 font-bold">POST</td>
                    <td className="p-3">/api/tasks</td>
                    <td className="p-3 text-purple-600 font-sans font-bold">Admin / PM</td>
                    <td className="p-3 text-slate-700 font-sans">Create and assign task</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-amber-600 font-bold">PATCH</td>
                    <td className="p-3">/api/tasks/:id</td>
                    <td className="p-3 text-slate-700 font-sans font-bold">Authorized</td>
                    <td className="p-3 text-slate-700 font-sans">Update task details or member status</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-blue-600 font-bold">GET</td>
                    <td className="p-3">/api/dashboard/summary</td>
                    <td className="p-3 text-slate-500 font-sans">Authenticated</td>
                    <td className="p-3 text-slate-700 font-sans">Role-scoped live dashboard metrics</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-emerald-600 font-bold">POST</td>
                    <td className="p-3">/api/project-explanation/verify</td>
                    <td className="p-3 text-slate-500 font-sans">Rate Limited</td>
                    <td className="p-3 text-slate-700 font-sans">Verify passkey "Personal_key"</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Setup & Deployment */}
      {activeTab === 'deployment' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Server className="w-5 h-5 text-brand-600" />
              Independent Deployment Architecture
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Frontend and Backend are organized into independent folders, each with their own git repository, package.json, and environment configurations.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="font-bold text-slate-900 block">Frontend (Vercel / Netlify)</span>
                <p className="text-slate-500">Build command: <code className="bg-slate-200 px-1 py-0.5 rounded">npm run build</code></p>
                <p className="text-slate-500">Output directory: <code className="bg-slate-200 px-1 py-0.5 rounded">dist</code></p>
                <div className="bg-slate-900 text-slate-200 p-3 rounded-xl font-mono text-[11px] overflow-x-auto">
                  <div># .env.example</div>
                  <div>VITE_API_BASE_URL=http://localhost:5000/api</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="font-bold text-slate-900 block">Backend (Render / Railway)</span>
                <p className="text-slate-500">Start command: <code className="bg-slate-200 px-1 py-0.5 rounded">npm start</code></p>
                <p className="text-slate-500">Runtime: Node.js 18+</p>
                <div className="bg-slate-900 text-slate-200 p-3 rounded-xl font-mono text-[11px] overflow-x-auto">
                  <div># .env.example</div>
                  <div>PORT=5000</div>
                  <div>MONGODB_URI=your_mongodb_atlas_connection_string</div>
                  <div>JWT_SECRET=your_jwt_secret_key</div>
                  <div>PROJECT_VIEW_PASSWORD=Personal_key</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectExplanationPage;
