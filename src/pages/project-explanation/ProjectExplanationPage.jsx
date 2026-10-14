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
  ExternalLink,
  Terminal,
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
      <div className="max-w-xl mx-auto my-12 p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-xl text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Protected Architectural Specification
          </h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            This technical walkthrough is protected for recruitment, technical evaluation, and portfolio assessment.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
          <p className="font-semibold text-slate-800">Evaluator Passcode Required</p>
          <p className="mt-1 text-slate-500">
            Please enter <code className="bg-slate-200 px-1.5 py-0.5 rounded text-brand-700 font-mono">Shiv@818780</code> to unlock this comprehensive design document.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={() => dispatch(openExplanationModal())}
          icon={KeyRound}
        >
          Enter Password to Unlock
        </Button>
      </div>
    );
  }

  if (explanationLoading && !explanationData) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-8">
        <div className="h-10 w-96 bg-slate-200 rounded-xl animate-pulse" />
        <div className="h-64 bg-slate-200 rounded-3xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-6 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Authenticated Architectural Overview
            </span>
            <span className="text-xs text-slate-400">v1.0.0</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Project & Team Management System
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Full-stack MERN application engineered with clean layered architecture, JWT stateless authentication, role-based authorization, and real-time MongoDB aggregations.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch(lockExplanation())}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            icon={Lock}
          >
            Lock Overview
          </Button>
        </div>
      </div>

      {/* 1. Problem Solved & Executive Value */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-brand-600" />
          Problem Statement & Solution
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Modern product teams frequently suffer from fragmented task tracking, unmonitored team bandwidth, lack of audit trails, and insecure permission leaks where any team member can tamper with critical project parameters.
        </p>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          This system solves these issues through server-enforced resource-level authorization, automated completion rate calculations triggered by task status changes, a complete audit history trail, and database-level query optimization with zero placeholder data.
        </p>
      </div>

      {/* 2. Technology Stack Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-600" />
            Frontend Technology Stack
          </h3>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>React 19 & Vite:</strong> Ultra-fast build times, Hot Module Replacement (HMR).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Tailwind CSS:</strong> Curated brand tokens, custom scrollbars, and accessible components.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Redux Toolkit (RTK):</strong> Global state slices for auth, projects, tasks, dashboard, and UI.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Axios:</strong> Request/response interceptors for Bearer token injection and 401 handling.</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Server className="w-5 h-5 text-brand-600" />
            Backend Technology Stack
          </h3>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Node.js & Express.js:</strong> Modular Controller-Service-Repository pattern.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>MongoDB & Mongoose:</strong> Normalized references, schema indexes, and aggregation pipelines.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>JWT & bcrypt:</strong> Salted password hashing and stateless token authentication.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Security Suite:</strong> Rate limiting, Helmet HTTP headers, and CORS origin whitelisting.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. Role-Based Permissions Matrix */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-brand-600" />
          Role-Based Access Control (RBAC) Specification
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Role</th>
                <th className="p-3">Scope</th>
                <th className="p-3">Project Permissions</th>
                <th className="p-3">Task Permissions</th>
                <th className="p-3">Dashboard Visibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="p-3 font-bold text-purple-700">Admin</td>
                <td className="p-3">Organization-wide</td>
                <td className="p-3">Create, update, delete, archive all projects & members</td>
                <td className="p-3">Full CRUD across all projects & assignments</td>
                <td className="p-3">Entire database metrics & audit trails</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-indigo-700">Project Manager</td>
                <td className="p-3">Authorized Projects</td>
                <td className="p-3">Create projects, manage members for authorized projects</td>
                <td className="p-3">Create, assign, edit, and delete tasks in their projects</td>
                <td className="p-3">Metrics for managed projects</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-teal-700">Team Member</td>
                <td className="p-3">Assigned Tasks</td>
                <td className="p-3">View projects where listed as a member</td>
                <td className="p-3">View tasks, comment, update status of assigned tasks</td>
                <td className="p-3">My assigned tasks and deadlines</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Database Models & Schema Relationships */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-5 h-5 text-brand-600" />
          Database Entities & Relationships
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">User</span>
            <span className="text-slate-500">_id, name, email (unique), password (hash), role, avatar, isActive, timestamps</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">Project</span>
            <span className="text-slate-500">_id, name, description, startDate, deadline, status, projectManager (Ref User), members ([Ref User]), completionPercentage</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">Task</span>
            <span className="text-slate-500">_id, title, description, project (Ref), assignedTo (Ref), priority (Low-Critical), status (Todo-Done), dueDate</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">ActivityLog</span>
            <span className="text-slate-500">_id, action, entityType, entityId, project, task, performedBy (Ref), details, createdAt</span>
          </div>
        </div>
      </div>

      {/* 5. Demo Test Credentials */}
      <div className="p-6 sm:p-8 rounded-2xl bg-brand-50/60 border border-brand-100 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-brand-900 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-brand-600" />
          Pre-Configured Demo Credentials
        </h3>
        <p className="text-xs text-brand-700">
          The database seed script initializes these roles with password <code className="bg-brand-100 px-1 rounded text-brand-900 font-mono">Password@123</code>:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white border border-brand-200/80">
            <span className="font-bold text-purple-700 block">Administrator</span>
            <span className="text-slate-600 block mt-1 font-mono">admin@taskmanager.com</span>
            <span className="text-slate-400 block text-[11px]">Pass: Password@123</span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-brand-200/80">
            <span className="font-bold text-indigo-700 block">Project Manager</span>
            <span className="text-slate-600 block mt-1 font-mono">pm@taskmanager.com</span>
            <span className="text-slate-400 block text-[11px]">Pass: Password@123</span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-brand-200/80">
            <span className="font-bold text-teal-700 block">Team Member</span>
            <span className="text-slate-600 block mt-1 font-mono">alex@taskmanager.com</span>
            <span className="text-slate-400 block text-[11px]">Pass: Password@123</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectExplanationPage;
