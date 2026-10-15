import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTaskById,
  updateTaskStatus,
  deleteTask,
  addTaskComment,
  clearCurrentTask,
} from '../../redux/slices/taskSlice';
import { addToast } from '../../redux/slices/uiSlice';
import taskService from '../../services/taskService';
import TaskFormModal from '../../components/forms/TaskFormModal';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import {
  Calendar,
  User,
  MessageSquare,
  Activity,
  ArrowLeft,
  Edit2,
  Trash2,
  Send,
  AlertCircle,
  Clock,
} from 'lucide-react';

const TaskDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentTask, comments, loading } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);

  const [newComment, setNewComment] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [activities, setActivities] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const now = useMemo(() => Date.now(), []);

  useEffect(() => {
    dispatch(fetchTaskById(id));

    // Load audit trail
    taskService
      .getTaskActivity(id)
      .then((res) => setActivities(res.data || []))
      .catch(() => { });

    return () => {
      dispatch(clearCurrentTask());
    };
  }, [id, dispatch]);

  const currentUserId = (user?._id || user?.id)?.toString();
  const pmId = (currentTask?.project?.projectManager?._id || currentTask?.project?.projectManager)?.toString();
  const assigneeId = (currentTask?.assignedTo?._id || currentTask?.assignedTo)?.toString();

  const canEdit =
    user?.role === 'admin' ||
    (user?.role === 'project_manager' && pmId && pmId === currentUserId);

  const isAssignee = assigneeId && currentUserId && assigneeId === currentUserId;
  const canUpdateStatus = canEdit || isAssignee;

  // Members of the project + admin + PM can comment
  const isMember = currentTask?.project?.members?.some(
    (m) => (m?._id || m)?.toString() === currentUserId
  );
  const canComment = canEdit || isAssignee || isMember;

  const handleStatusChange = async (newStatus) => {
    try {
      await dispatch(updateTaskStatus({ id, status: newStatus })).unwrap();
      dispatch(addToast({ type: 'success', message: `Status updated to ${newStatus}` }));
      dispatch(fetchTaskById(id));
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err || 'Status update failed' }));
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setCommentSubmitting(true);
    try {
      await dispatch(addTaskComment({ id, comment: newComment })).unwrap();
      setNewComment('');
      dispatch(addToast({ type: 'success', message: 'Comment posted' }));
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err || 'Failed to post comment' }));
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete task "${currentTask.title}"?`)) {
      try {
        await dispatch(deleteTask(id)).unwrap();
        dispatch(addToast({ type: 'success', message: 'Task deleted' }));
        navigate('/tasks');
      } catch (err) {
        dispatch(addToast({ type: 'error', message: err || 'Failed to delete' }));
      }
    }
  };

  if (loading && !currentTask) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-lg" />
        <div className="h-48 bg-slate-200 animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (!currentTask) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-base font-bold text-slate-800">Task not found</h3>
        <Link to="/tasks" className="mt-4 inline-block">
          <Button variant="outline" size="sm" icon={ArrowLeft}>
            Back to Tasks
          </Button>
        </Link>
      </div>
    );
  }

  // const now = useMemo(() => Date.now(), []);
  const isOverdue =
    new Date(currentTask.dueDate).getTime() < now && currentTask.status !== 'Done';

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Back button & controls */}
      <div className="flex items-center justify-between">
        <Link
          to="/tasks"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tasks
        </Link>

        {canEdit && (
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

      {/* Main Task Header Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap mb-2">
              <Link
                to={`/projects/${currentTask.project?._id}`}
                className="text-xs font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 px-2.5 py-1 rounded-md transition-colors"
              >
                📁 {currentTask.project?.name}
              </Link>
              <Badge variant={currentTask.priority} size="xs">
                {currentTask.priority}
              </Badge>
              <Badge variant={currentTask.status} size="xs">
                {currentTask.status}
              </Badge>
              {isOverdue && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200">
                  <AlertCircle className="w-3.5 h-3.5" /> Overdue
                </span>
              )}
            </div>

            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {currentTask.title}
            </h2>
          </div>

          {/* Quick Status Workflow Buttons */}
          {canUpdateStatus && (
            <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200/80 shrink-0">
              {['To Do', 'In Progress', 'In Review', 'Done'].map((st) => (
                <button
                  key={st}
                  onClick={() => handleStatusChange(st)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${currentTask.status === st
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                >
                  {st}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Description
          </h4>
          <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
            {currentTask.description}
          </p>
        </div>

        {/* Task Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block font-medium">Assigned To</span>
            <div className="flex items-center gap-2 mt-1.5 font-semibold text-slate-800">
              <User className="w-4 h-4 text-brand-600" />
              <span>{currentTask.assignedTo?.name}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block font-medium">Due Date</span>
            <div
              className={`flex items-center gap-2 mt-1.5 font-semibold ${isOverdue ? 'text-rose-600 font-bold' : 'text-slate-800'
                }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{new Date(currentTask.dueDate).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block font-medium">Created On</span>
            <div className="flex items-center gap-2 mt-1.5 font-semibold text-slate-800">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{new Date(currentTask.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Collaboration / Comments Section */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-brand-600" />
          Collaboration Comments ({comments.length})
        </h3>

        {/* Comments Feed */}
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((c) => {
              const isAuthorAdmin = c.author?.role === 'admin';
              const isAuthorPM = c.author?.role === 'project_manager';
              const isMe = c.author?._id === user?._id;

              const avatarBg = isAuthorAdmin
                ? 'bg-rose-100 text-rose-700'
                : isAuthorPM
                  ? 'bg-violet-100 text-violet-700'
                  : 'bg-brand-100 text-brand-700';

              const roleBadge = isAuthorAdmin
                ? { label: 'Admin', cls: 'bg-rose-50 text-rose-600 border border-rose-200' }
                : isAuthorPM
                  ? { label: 'Project Manager', cls: 'bg-violet-50 text-violet-600 border border-violet-200' }
                  : { label: 'Team Member', cls: 'bg-slate-100 text-slate-500 border border-slate-200' };

              return (
                <div
                  key={c._id}
                  className={`p-4 rounded-xl border flex items-start gap-3 ${isMe
                    ? 'bg-brand-50/60 border-brand-200/60'
                    : 'bg-slate-50 border-slate-100'
                    }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full font-bold flex items-center justify-center shrink-0 text-xs ${avatarBg}`}
                  >
                    {c.author?.name?.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className="text-xs font-bold text-slate-900">
                        {c.author?.name}
                        {isMe && (
                          <span className="ml-1 text-[10px] font-normal text-slate-400">(you)</span>
                        )}
                      </span>
                      {/* Role badge */}
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${roleBadge.cls}`}
                      >
                        {roleBadge.label}
                      </span>
                      <span className="ml-auto text-[10px] text-slate-400">
                        {new Date(c.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {c.comment}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-4">
            No comments yet. Be the first to start the discussion!
          </p>
        )}

        {/* Add Comment Form — visible to project members, PM, and admin only */}
        {canComment ? (
          <form onSubmit={handleCommentSubmit} className="space-y-3 pt-3 border-t border-slate-100">
            <textarea
              rows={3}
              placeholder="Write a comment or post an update..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-y"
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                loading={commentSubmitting}
                disabled={!newComment.trim()}
                icon={Send}
              >
                Post Comment
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-xs text-slate-400 text-center pt-3 border-t border-slate-100">
            You must be a project member to post comments.
          </p>
        )}
      </div>

      {/* Task Audit Trail */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-brand-600" />
          Task Activity History
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
          <p className="text-xs text-slate-400 py-3 text-center">No task activity logged yet.</p>
        )}
      </div>

      {/* Edit Modal */}
      <TaskFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={currentTask}
      />
    </div>
  );
};

export default TaskDetailsPage;
