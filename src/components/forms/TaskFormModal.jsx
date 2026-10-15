import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTask, updateTask } from '../../redux/slices/taskSlice';
import { fetchProjects } from '../../redux/slices/projectSlice';
import { fetchUsers } from '../../redux/slices/userSlice';
import { addToast } from '../../redux/slices/uiSlice';
import aiService from '../../services/aiService';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { CheckSquare, Sparkles } from 'lucide-react';

const TaskFormModal = ({ isOpen, onClose, initialData = null, defaultProjectId = null }) => {
  const dispatch = useDispatch();
  const { items: projects } = useSelector((state) => state.projects);
  const { items: users } = useSelector((state) => state.users);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: '',
    assignedTo: '',
    priority: 'Medium',
    status: 'To Do',
    dueDate: '',
  });

  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchProjects({ limit: 100 }));
      dispatch(fetchUsers({ limit: 100 }));
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        project: initialData.project?._id || initialData.project || defaultProjectId || '',
        assignedTo: initialData.assignedTo?._id || initialData.assignedTo || '',
        priority: initialData.priority || 'Medium',
        status: initialData.status || 'To Do',
        dueDate: initialData.dueDate ? initialData.dueDate.split('T')[0] : '',
      });
    } else {
      setFormData((prev) => ({
        title: '',
        description: '',
        project: defaultProjectId || prev.project || (projects[0]?._id || ''),
        assignedTo: prev.assignedTo || (users[0]?._id || ''),
        priority: 'Medium',
        status: 'To Do',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      }));
    }
    setError(null);
  }, [initialData, defaultProjectId, isOpen]);

  useEffect(() => {
    if (isOpen && !initialData) {
      setFormData((prev) => ({
        ...prev,
        project: prev.project || defaultProjectId || (projects[0]?._id || ''),
        assignedTo: prev.assignedTo || (users[0]?._id || ''),
      }));
    }
  }, [projects, users, isOpen, initialData, defaultProjectId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAiAssist = async () => {
    if (!formData.title || !formData.title.trim()) {
      dispatch(addToast({ type: 'warning', message: 'Please enter a task title first' }));
      return;
    }

    setAiGenerating(true);
    try {
      const res = await aiService.suggestTask({
        title: formData.title,
        description: formData.description,
      });

      if (res.data) {
        setFormData((prev) => ({
          ...prev,
          description: res.data.generatedDescription || prev.description,
          priority: res.data.suggestedPriority || prev.priority,
        }));
        dispatch(
          addToast({
            type: 'success',
            message: `✨ AI generated breakdown (~${res.data.estimatedHours}h / ${res.data.storyPoints} story pts)`,
          })
        );
      }
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message || 'AI breakdown failed' }));
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (initialData) {
        await dispatch(updateTask({ id: initialData._id, data: formData })).unwrap();
        dispatch(addToast({ type: 'success', message: 'Task updated successfully' }));
      } else {
        await dispatch(createTask(formData)).unwrap();
        dispatch(addToast({ type: 'success', message: 'Task created successfully' }));
      }
      onClose();
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Task Details' : 'Create New Task'}
      subtitle="Define actionable requirements, assignee, priority, and deadline"
      maxWidth="max-w-2xl"
      footer={
        <>
          <Button variant="ghost" size="md" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button
            type="submit"
            form="task-modal-form"
            variant="primary"
            size="md"
            loading={loading}
            icon={CheckSquare}
          >
            {initialData ? 'Save Changes' : 'Create Task'}
          </Button>
        </>
      }
    >
      <form id="task-modal-form" onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <button
              type="button"
              onClick={handleAiAssist}
              disabled={aiGenerating || !formData.title.trim()}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100/80 px-2.5 py-1 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-brand-200/60"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-600 animate-spin-slow" />
              {aiGenerating ? 'Generating...' : '✨ AI Assist'}
            </button>
          </div>
          <input
            type="text"
            name="title"
            placeholder="e.g. Implement API Gateway validation filter"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-slate-800"
          />
        </div>

        <Input
          label="Description & Acceptance Criteria"
          name="description"
          type="textarea"
          rows={4}
          placeholder="Detailed task instructions, acceptance criteria, or generate via AI Assist..."
          value={formData.description}
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Associated Project"
            name="project"
            type="select"
            value={formData.project}
            onChange={handleChange}
            required
            disabled={Boolean(defaultProjectId)}
          >
            <option value="">Select Project...</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </Input>

          <Input
            label="Assigned Team Member"
            name="assignedTo"
            type="select"
            value={formData.assignedTo}
            onChange={handleChange}
            required
          >
            <option value="">Select Assignee...</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.role?.replace('_', ' ')})
              </option>
            ))}
          </Input>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <Input
            label="Priority"
            name="priority"
            type="select"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </Input>

          <Input
            label="Initial Status"
            name="status"
            type="select"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="In Review">In Review</option>
            <option value="Done">Done</option>
          </Input>

          <Input
            label="Due Date"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
        </div>
      </form>
    </Modal>
  );
};

export default TaskFormModal;
