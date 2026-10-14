import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProjectById,
  deleteProject,
  clearCurrentProject,
} from '../../redux/slices/projectSlice';
import { fetchTasks } from '../../redux/slices/taskSlice';
import { addToast } from '../../redux/slices/uiSlice';
import projectService from '../../services/projectService';
import ProjectFormModal from '../../components/forms/ProjectFormModal';
import TaskFormModal from '../../components/forms/TaskFormModal';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import {
  FolderKanban,
  Calendar,
  Users,
  CheckSquare,
  Plus,
  Edit2,
  Trash2,
  Activity,
  ArrowLeft,
  Clock,
} from 'lucide-react';

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentProject, loading } = useSelector((state) => state.projects);
  const { items: tasks } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);

  const [activities, setActivities] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProjectById(id));
    dispatch(fetchTasks({ project: id, limit: 50 }));

    // Load audit activities
    projectService
      .getProjectActivity(id)
      .then((res) => setActivities(res.data || []))
      .catch(() => {});

    return () => {
      dispatch(clearCurrentProject());
    };
  }, [id, dispatch]);

  const pmId = (currentProject?.projectManager?._id || currentProject?.projectManager)?.toString();
  const currentUserId = (user?._id || user?.id)?.toString();
  const canManage =
    user?.role === 'admin' ||
    (user?.role === 'project_manager' && pmId && pmId === currentUserId);

  const handleDelete = async () => {
    if (window.confirm('Delete this project and all its associated tasks permanently?')) {
      try {
        await dispatch(deleteProject(id)).unwrap();
        dispatch(addToast({ type: 'success', message: 'Project deleted' }));
        navigate('/projects');
      } catch (err) {
        dispatch(addToast({ type: 'error', message: err || 'Failed to delete' }));
      }
    }
  };

  if (loading && !currentProject) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-lg" />
        <div className="h-48 bg-slate-200 animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-base font-bold text-slate-800">Project not found or access denied</h3>
        <Link to="/projects" className="mt-4 inline-block">
          <Button variant="outline" size="sm" icon={ArrowLeft}>
            Back to Projects
          </Button>
        </Link>
      </div>
    );
  }

  const { taskMetrics = {} } = currentProject;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Navigation Back */}
      <div className="flex items-center justify-between">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>

        {canManage && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Edit2}
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit
            </Button>
            <Button variant="danger" size="sm" icon={Trash2} onClick={handleDelete}>
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Main Project Header Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {currentProject.name}
              </h2>
              <Badge variant={currentProject.status} size="sm">
                {currentProject.status}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-2 max-w-2xl leading-relaxed">
              {currentProject.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block font-medium">Timeline</span>
              <span className="font-semibold text-slate-800">
                {new Date(currentProject.startDate).toLocaleDateString()} —{' '}
                {new Date(currentProject.deadline).toLocaleDateString()}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block font-medium">Project Manager</span>
              <span className="font-semibold text-slate-800">
                {currentProject.projectManager?.name || 'Unassigned'}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar & KPIs */}
        <div className="pt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-brand-50/60 border border-brand-100 text-brand-900">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-700">
              Completion
            </span>
            <span className="text-2xl font-black block mt-1">
              {currentProject.completionPercentage || 0}%
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Tasks
            </span>
            <span className="text-2xl font-black text-slate-800 block mt-1">
              {taskMetrics.total || tasks.length}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 text-emerald-900">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Done Tasks
            </span>
            <span className="text-2xl font-black block mt-1">
              {taskMetrics.done || 0}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-blue-900">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">
              In Progress
            </span>
            <span className="text-2xl font-black block mt-1">
              {taskMetrics.inProgress || 0}
            </span>
          </div>
        </div>

        {/* Members Roster */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-700">Project Members:</span>
            <div className="flex items-center gap-1.5 ml-2 flex-wrap">
              {currentProject.members && currentProject.members.length > 0 ? (
                currentProject.members.map((m) => (
                  <span
                    key={m._id}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {m.name}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">No members assigned</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Associated Tasks Section */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-brand-600" />
              Tasks in this Project
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Assigned tasks and sprint progress</p>
          </div>

          {canManage && (
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setIsTaskModalOpen(true)}
            >
              Add Task
            </Button>
          )}
        </div>

        {tasks.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {tasks.map((t) => (
              <div
                key={t._id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 p-2 rounded-xl transition-colors"
              >
                <div className="min-w-0">
                  <Link
                    to={`/tasks/${t._id}`}
                    className="text-sm font-bold text-slate-900 hover:text-brand-600 transition-colors"
                  >
                    {t.title}
                  </Link>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{t.description}</p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                    <span>Assigned to: {t.assignedTo?.name}</span>
                    <span>•</span>
                    <span>Due: {new Date(t.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={t.priority} size="xs">
                    {t.priority}
                  </Badge>
                  <Badge variant={t.status} size="xs">
                    {t.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-400">
            No tasks created for this project yet.
          </div>
        )}
      </div>

      {/* Activity Trail */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-brand-600" />
          Project Activity History
        </h3>

        {activities.length > 0 ? (
          <div className="space-y-3">
            {activities.map((act) => (
              <div
                key={act._id}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
              >
                <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center shrink-0">
                  {act.performedBy?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-slate-800">{act.details}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {new Date(act.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-3 text-center">No activity recorded yet.</p>
        )}
      </div>

      {/* Modals */}
      <ProjectFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={currentProject}
      />

      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        defaultProjectId={id}
      />
    </div>
  );
};

export default ProjectDetailsPage;
