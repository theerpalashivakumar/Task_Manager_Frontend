import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import {
  Calendar,
  User,
  AlertCircle,
  ArrowRight,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

const COLUMNS = [
  {
    id: 'To Do',
    title: 'To Do',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    dotClass: 'bg-slate-400',
    accentBorder: 'border-slate-200',
  },
  {
    id: 'In Progress',
    title: 'In Progress',
    badgeClass: 'bg-brand-50 text-brand-700 border-brand-200',
    dotClass: 'bg-brand-500',
    accentBorder: 'border-brand-200',
  },
  {
    id: 'In Review',
    title: 'In Review',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    dotClass: 'bg-amber-500',
    accentBorder: 'border-amber-200',
  },
  {
    id: 'Done',
    title: 'Done',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotClass: 'bg-emerald-500',
    accentBorder: 'border-emerald-200',
  },
];

const TaskKanbanBoard = ({ tasks = [], onStatusChange, onEditTask, onDeleteTask, user }) => {
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [activeDropColumn, setActiveDropColumn] = useState(null);

  const currentUserId = (user?._id || user?.id)?.toString();

  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeDropColumn !== columnId) {
      setActiveDropColumn(columnId);
    }
  };

  const handleDragLeave = (e, columnId) => {
    if (activeDropColumn === columnId) {
      setActiveDropColumn(null);
    }
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    setActiveDropColumn(null);
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId && targetStatus) {
      onStatusChange(taskId, targetStatus);
    }
    setDraggedTaskId(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
      {COLUMNS.map((column) => {
        const columnTasks = tasks.filter((t) => t.status === column.id);
        const isDropTarget = activeDropColumn === column.id;

        return (
          <div
            key={column.id}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={(e) => handleDragLeave(e, column.id)}
            onDrop={(e) => handleDrop(e, column.id)}
            className={`flex flex-col rounded-2xl bg-slate-50/70 border-2 transition-all min-h-[500px] p-3.5 ${
              isDropTarget
                ? 'border-brand-500 bg-brand-50/30 ring-4 ring-brand-500/10'
                : 'border-slate-200/80'
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${column.dotClass}`} />
                <h3 className="text-xs font-bold text-slate-800 tracking-wide uppercase">
                  {column.title}
                </h3>
              </div>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${column.badgeClass}`}
              >
                {columnTasks.length}
              </span>
            </div>

            {/* Task Cards Column */}
            <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
              {columnTasks.length > 0 ? (
                columnTasks.map((task) => {
                  const isOverdue =
                    new Date(task.dueDate).getTime() < Date.now() && task.status !== 'Done';
                  const assigneeId = (task.assignedTo?._id || task.assignedTo)?.toString();
                  const isAssignee = assigneeId && currentUserId && assigneeId === currentUserId;
                  const pmId = (task.project?.projectManager?._id || task.project?.projectManager)?.toString();
                  const canEdit =
                    user?.role === 'admin' ||
                    (user?.role === 'project_manager' && pmId && pmId === currentUserId);

                  return (
                    <div
                      key={task._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task._id)}
                      className={`group p-3.5 rounded-xl bg-white border transition-all cursor-grab active:cursor-grabbing hover:shadow-md ${
                        draggedTaskId === task._id ? 'opacity-40 scale-95' : 'opacity-100'
                      } ${
                        isOverdue
                          ? 'border-rose-200 hover:border-rose-300'
                          : 'border-slate-200 hover:border-brand-300'
                      }`}
                    >
                      {/* Project Tag & Priority */}
                      <div className="flex items-center justify-between gap-1.5 mb-2">
                        <span className="text-[10px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md truncate max-w-[120px]">
                          {task.project?.name || 'Project'}
                        </span>
                        <Badge variant={task.priority} size="xs">
                          {task.priority}
                        </Badge>
                      </div>

                      {/* Title */}
                      <Link
                        to={`/tasks/${task._id}`}
                        className="text-xs font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 mb-2 block"
                      >
                        {task.title}
                      </Link>

                      {/* Assignee & Due Date */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 truncate text-slate-600">
                            <User className="w-3 h-3 text-slate-400 shrink-0" />
                            {task.assignedTo?.name} {isAssignee && '(You)'}
                          </span>

                          <span
                            className={`flex items-center gap-1 shrink-0 ${
                              isOverdue ? 'text-rose-600 font-bold' : ''
                            }`}
                          >
                            <Calendar className="w-3 h-3" />
                            {new Date(task.dueDate).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>

                        {isOverdue && (
                          <div className="flex items-center gap-1 text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">
                            <AlertCircle className="w-2.5 h-2.5 shrink-0" /> Overdue
                          </div>
                        )}
                      </div>

                      {/* Card Footer: Quick status jumper & edit buttons */}
                      <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-slate-100">
                        <select
                          value={task.status}
                          onChange={(e) => onStatusChange(task._id, e.target.value)}
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="In Review">In Review</option>
                          <option value="Done">Done</option>
                        </select>

                        <div className="flex items-center gap-1">
                          <Link
                            to={`/tasks/${task._id}`}
                            className="p-1 rounded text-slate-400 hover:text-brand-600 hover:bg-slate-100 transition-colors"
                            title="View details"
                          >
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                          {canEdit && (
                            <>
                              <button
                                onClick={() => onEditTask(task)}
                                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => onDeleteTask(task._id, task.title)}
                                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-32 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-3 text-slate-400">
                  <span className="text-xs font-semibold">No tasks</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    Drag items here to update
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskKanbanBoard;
