import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProject, updateProject } from '../../redux/slices/projectSlice';
import { fetchUsers } from '../../redux/slices/userSlice';
import { addToast } from '../../redux/slices/uiSlice';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { FolderKanban } from 'lucide-react';

const ProjectFormModal = ({ isOpen, onClose, initialData = null }) => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { items: users } = useSelector((state) => state.users);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    deadline: '',
    status: 'Planning',
    projectManager: '',
    members: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchUsers({ limit: 100 }));
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        startDate: initialData.startDate ? initialData.startDate.split('T')[0] : '',
        deadline: initialData.deadline ? initialData.deadline.split('T')[0] : '',
        status: initialData.status || 'Planning',
        projectManager: initialData.projectManager?._id || initialData.projectManager || '',
        members: initialData.members?.map((m) => m._id || m) || [],
      });
    } else {
      setFormData({
        name: '',
        description: '',
        startDate: new Date().toISOString().split('T')[0],
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'Planning',
        projectManager: currentUser?.role === 'project_manager' ? (currentUser?._id || currentUser?.id || '') : '',
        members: [],
      });
    }
    setError(null);
  }, [initialData, isOpen, currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMemberToggle = (userId) => {
    setFormData((prev) => {
      const exists = prev.members.includes(userId);
      return {
        ...prev,
        members: exists ? prev.members.filter((id) => id !== userId) : [...prev.members, userId],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (initialData) {
        await dispatch(updateProject({ id: initialData._id, data: formData })).unwrap();
        dispatch(addToast({ type: 'success', message: 'Project updated successfully' }));
      } else {
        await dispatch(createProject(formData)).unwrap();
        dispatch(addToast({ type: 'success', message: 'Project created successfully' }));
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
      title={initialData ? 'Edit Project' : 'Create New Project'}
      subtitle="Define project milestones, dates, and assign team members"
      maxWidth="max-w-2xl"
      footer={
        <>
          <Button variant="ghost" size="md" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button
            type="submit"
            form="project-modal-form"
            variant="primary"
            size="md"
            loading={loading}
            icon={FolderKanban}
          >
            {initialData ? 'Save Changes' : 'Create Project'}
          </Button>
        </>
      }
    >
      <form id="project-modal-form" onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
            {error}
          </div>
        )}

        <Input
          label="Project Name"
          name="name"
          placeholder="e.g. NextGen Microservices Migration"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <Input
          label="Description"
          name="description"
          type="textarea"
          rows={3}
          placeholder="Detailed goals and deliverables..."
          value={formData.description}
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Start Date"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            required
          />

          <Input
            label="Deadline"
            name="deadline"
            type="date"
            value={formData.deadline}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Status"
            name="status"
            type="select"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Planning">Planning</option>
            <option value="Active">Active</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
          </Input>

          {currentUser?.role === 'admin' ? (
            <Input
              label="Assigned Project Manager"
              name="projectManager"
              type="select"
              value={formData.projectManager}
              onChange={handleChange}
              required
            >
              <option value="">Select Project Manager...</option>
              {users
                .filter((u) => u.role === 'admin' || u.role === 'project_manager')
                .map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.role?.replace('_', ' ')})
                  </option>
                ))}
            </Input>
          ) : (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Project Manager</label>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700 font-medium">
                {currentUser?.name} (You)
              </div>
            </div>
          )}
        </div>

        {/* Team Members Assignment */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Assign Team Members
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50/50">
            {users.map((u) => {
              const isSelected = formData.members.includes(u._id);
              return (
                <div
                  key={u._id}
                  onClick={() => handleMemberToggle(u._id)}
                  className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-xs transition-colors border ${
                    isSelected
                      ? 'bg-brand-50 border-brand-200 text-brand-900 font-semibold'
                      : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span className="truncate">{u.name}</span>
                  <span className="text-[10px] text-slate-400 ml-auto capitalize">
                    {u.role?.replace('_', ' ')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectFormModal;
