import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  FileCode,
  KeyRound,
  CheckCircle2,
  Terminal,
  Activity,
  Code2,
} from 'lucide-react';

const ProjectExplanationPage = () => {
  const dispatch = useDispatch();
  const {
    isExplanationUnlocked,
    explanationData,
    explanationLoading,
    explanationError,
  } = useSelector((state) => state.ui);

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
            This technical document contains full system designs, database schemas, and architectural walkthroughs.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
          <p className="font-semibold text-slate-800">Passkey Authentication Required</p>
          <p className="mt-1 text-slate-500">
            Please enter your private project access key to unlock the system documentation.
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

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4 animate-fade-in">
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
            Full-stack MERN enterprise architecture built with decoupled frontend/backend services, role-based authorization guards, and dynamic database metrics.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch(lockExplanation())}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md"
            icon={Lock}
          >
            Lock Overview
          </Button>
        </div>
      </div>

      {/* 1. Problem Solved & Executive Value */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-brand-600" />
          Problem Statement & Solution
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Modern teams struggle with fragmented task tracking, unmonitored team bandwidth, lack of audit trails, and insecure permission leaks where members can modify critical project parameters outside their authorization scope.
        </p>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          This system delivers strict server-enforced resource-level authorization, automated completion percentage calculations triggered by task status transitions, immutable audit logs with verified user identities, and database-level query optimization with zero placeholder data.
        </p>
      </div>

      {/* 2. Technology Stack Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-600" />
            Frontend Technology Stack
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-600">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>React 19 & Vite:</strong> Lightning-fast bundling, Hot Module Replacement (HMR).</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Tailwind CSS:</strong> Curated brand tokens, custom scrollbars, and accessible components.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Redux Toolkit (RTK):</strong> Global state slices for auth, projects, tasks, dashboard, and UI.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Axios:</strong> Request/response interceptors for Bearer token injection and 401 handling.</span>
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
              <span><strong>Node.js & Express.js:</strong> Modular Controller-Service-Repository pattern.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>MongoDB & Mongoose:</strong> Normalized references, schema indexes, and aggregation pipelines.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>JWT & bcrypt:</strong> Salted password hashing (10 rounds) and stateless token authentication.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Security Suite:</strong> Rate limiting, Helmet HTTP security headers, and CORS origin whitelisting.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. Role-Based Permissions Matrix */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-brand-600" />
          Role-Based Access Control (RBAC) Specification
        </h3>

        <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200/80">
              <tr>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Scope</th>
                <th className="p-3.5">Project Permissions</th>
                <th className="p-3.5">Task Permissions</th>
                <th className="p-3.5">Dashboard Visibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr className="hover:bg-slate-50/50">
                <td className="p-3.5 font-bold text-purple-700">Admin</td>
                <td className="p-3.5">Organization-wide</td>
                <td className="p-3.5">Full CRUD, archive, delete, member assignment across all projects</td>
                <td className="p-3.5">Full CRUD across all projects & assignments</td>
                <td className="p-3.5 font-semibold text-slate-900">Organization-wide metrics</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="p-3.5 font-bold text-indigo-700">Project Manager</td>
                <td className="p-3.5">Authorized Projects</td>
                <td className="p-3.5">Create projects, manage members for authorized projects</td>
                <td className="p-3.5">Create, assign, edit, and delete tasks in authorized projects</td>
                <td className="p-3.5">Managed projects & sprint metrics</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="p-3.5 font-bold text-teal-700">Team Member</td>
                <td className="p-3.5">Assigned Tasks</td>
                <td className="p-3.5">View projects where listed as a team member</td>
                <td className="p-3.5">View tasks, comment, update status of assigned tasks</td>
                <td className="p-3.5">My assigned tasks & personal deadlines</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Database Models & Schema Relationships */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-5 h-5 text-brand-600" />
          Database Entities & Relationships
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
            <span className="font-bold text-slate-900 block mb-1">User</span>
            <span className="text-slate-500 leading-relaxed">_id, name, email (unique), password (hash), role, avatar, isActive, timestamps</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
            <span className="font-bold text-slate-900 block mb-1">Project</span>
            <span className="text-slate-500 leading-relaxed">_id, name, description, startDate, deadline, status, projectManager (Ref), members ([Ref]), completionPercentage</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
            <span className="font-bold text-slate-900 block mb-1">Task</span>
            <span className="text-slate-500 leading-relaxed">_id, title, description, project (Ref), assignedTo (Ref), priority (Low-Critical), status (Todo-Done), dueDate</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
            <span className="font-bold text-slate-900 block mb-1">ActivityLog</span>
            <span className="text-slate-500 leading-relaxed">_id, action, entityType, entityId, project, task, performedBy (Ref), details, createdAt</span>
          </div>
        </div>
      </div>

      {/* 5. Pre-configured Demo Logins */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-50/80 to-indigo-50/60 border border-brand-100 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-brand-950 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-brand-600" />
          Evaluation Demo Credentials
        </h3>
        <p className="text-xs text-brand-700">
          Use the 1-click fill buttons on the Login page or use these pre-seeded accounts:
        </p>

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
  );
};

export default ProjectExplanationPage;
