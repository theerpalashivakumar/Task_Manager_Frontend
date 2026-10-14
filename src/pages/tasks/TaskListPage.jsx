import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchTasks, updateTaskStatus, deleteTask } from '../../redux/slices/taskSlice';
import { fetchProjects } from '../../redux/slices/projectSlice';
import { fetchUsers } from '../../redux/slices/userSlice';
import { addToast } from '../../redux/slices/uiSlice';
import TaskFormModal from '../../components/forms/TaskFormModal';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Calendar,
  AlertCircle,
  Edit2,
  Trash2,
  ArrowRight,
  User,
} from 'lucide-react';

const TaskListPage = () => {
  const dispatch = useDispatch();
  const { items: tasks, pagination, loading } = useSelector((state) => state.tasks);
  const { items: projects } = useSelector((state) => state.projects);
  const { items: users } = useSelector((state) => state.users);
  const { user } = useSelector((state) => state.auth);

  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isOverdueOnly, setIsOverdueOnly] = useState(false);
  const [sortBy, setSortBy] = useState('dueDate');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const canCreate = user?.role === 'admin' || user?.role === 'project_manager';

  const loadTasks = (page = 1) => {
    dispatch(
      fetchTasks({
        page,
        limit: 10,
        search,
        project: projectFilter,
        priority: priorityFilter,
        status: statusFilter,
        isOverdue: isOverdueOnly ? 'true' : undefined,
        sort: sortBy,
      })
    );
  };

  useEffect(() => {
    dispatch(fetchProjects({ limit: 100 }));
    dispatch(fetchUsers({ limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadTasks(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, projectFilter, priorityFilter, statusFilter, isOverdueOnly, sortBy]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await dispatch(updateTaskStatus({ id: taskId, status: newStatus })).unwrap();
      dispatch(addToast({ type: 'success', message: `Task status updated to ${newStatus}` }));
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err || 'Unauthorized to update status' }));
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete task "${title}"?`)) {
      try {
        await dispatch(deleteTask(id)).unwrap();
        dispatch(addToast({ type: 'success', message: 'Task deleted' }));
      } catch (err) {
        dispatch(addToast({ type: 'error', message: err || 'Failed to delete task' }));
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Tasks</h2>
          <p className="text-xs text-slate-500 mt-1">
            Browse, filter, and track status transitions across all assignments
          </p>
        </div>

        {canCreate && (
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
          >
            Create Task
          </Button>
        )}
      </div>

      {/* Multidimensional Filters & Search */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          {/* Project Filter */}
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-slate-700"
          >
            <option value="">All Projects</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-slate-700"
          >
            <option value="">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="In Review">In Review</option>
            <option value="Done">Done</option>
          </select>
        </div>

        {/* Secondary Bar: Overdue toggle & Sorting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isOverdueOnly}
              onChange={(e) => setIsOverdueOnly(e.target.checked)}
              className="rounded text-rose-600 focus:ring-rose-500"
            />
            <span className={`font-semibold ${isOverdueOnly ? 'text-rose-600' : 'text-slate-600'}`}>
              🚨 Show Overdue Tasks Only
            </span>
          </label>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white text-slate-700"
            >
              <option value="dueDate">Due Date (Earliest)</option>
              <option value="-dueDate">Due Date (Latest)</option>
              <option value="-createdAt">Recently Created</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List / Table */}
      {loading && tasks.length === 0 ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-slate-200/60 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : tasks.length > 0 ? (
        <div className="space-y-3">
          {tasks.map((task) => {
            const isOverdue =
              new Date(task.dueDate) < new Date() && task.status !== 'Done';
            const isAssignee = task.assignedTo?._id === user?._id;
            const canEdit =
              user?.role === 'admin' ||
              (user?.role === 'project_manager' &&
                task.project?.projectManager === user?._id);

            return (
              <div
                key={task._id}
                className={`p-4 rounded-2xl bg-white border transition-all hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isOverdue ? 'border-rose-200 bg-rose-50/10' : 'border-slate-200/80'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[11px] font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
                      {task.project?.name || 'Project'}
                    </span>
                    <Badge variant={task.priority} size="xs">
                      {task.priority}
                    </Badge>
                    {isOverdue && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                        <AlertCircle className="w-3 h-3" /> Overdue
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/tasks/${task._id}`}
                    className="text-sm font-bold text-slate-900 hover:text-brand-600 transition-colors block"
                  >
                    {task.title}
                  </Link>

                  <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {task.assignedTo?.name} {isAssignee && '(You)'}
                    </span>
                    <span>•</span>
                    <span
                      className={`flex items-center gap-1 ${
                        isOverdue ? 'text-rose-600 font-semibold' : ''
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Right Actions: Quick Status Transition & Controls */}
                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  {/* Quick status selector */}
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="In Review">In Review</option>
                    <option value="Done">Done</option>
                  </select>

                  <Link
                    to={`/tasks/${task._id}`}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-600 text-slate-600 transition-colors"
                    title="View Discussion & Details"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  {canEdit && (
                    <>
                      <button
                        onClick={() => {
                          setEditingTask(task);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                        title="Edit Task"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(task._id, task.title)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                        title="Delete Task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200/80 shadow-sm">
          <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No tasks match criteria</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {search || statusFilter || priorityFilter || isOverdueOnly
              ? 'Try adjusting your search criteria or active filters.'
              : 'Create a task to assign work and start tracking completion.'}
          </p>
        </div>
      )}

      {/* Pagination */}
      <Pagination pagination={pagination} onPageChange={(p) => loadTasks(p)} />

      {/* Task Modal */}
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        initialData={editingTask}
      />
    </div>
  );
};

export default TaskListPage;
