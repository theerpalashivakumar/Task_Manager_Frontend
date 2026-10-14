import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProjects, deleteProject } from '../../redux/slices/projectSlice';
import { addToast } from '../../redux/slices/uiSlice';
import ProjectFormModal from '../../components/forms/ProjectFormModal';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import {
  FolderKanban,
  Plus,
  Search,
  Calendar,
  Users,
  Edit2,
  Trash2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

const ProjectListPage = () => {
  const dispatch = useDispatch();
  const { items: projects, pagination, loading, error } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const canManage = user?.role === 'admin' || user?.role === 'project_manager';

  const loadProjects = (page = 1) => {
    dispatch(
      fetchProjects({
        page,
        limit: 9,
        search,
        status: statusFilter,
      })
    );
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadProjects(1);
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [search, statusFilter]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete project "${name}"? All associated tasks will be removed.`)) {
      try {
        await dispatch(deleteProject(id)).unwrap();
        dispatch(addToast({ type: 'success', message: 'Project deleted successfully' }));
      } catch (err) {
        dispatch(addToast({ type: 'error', message: err || 'Failed to delete project' }));
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Projects</h2>
          <p className="text-xs text-slate-500 mt-1">
            Track milestones, workloads, and progress across active organizational initiatives
          </p>
        </div>

        {canManage && (
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => {
              setEditingProject(null);
              setIsModalOpen(true);
            }}
          >
            Create Project
          </Button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search projects by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
          {['', 'Planning', 'Active', 'On Hold', 'Completed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st || 'All Projects'}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {loading && projects.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-slate-200/60 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => {
            const isPM = proj.projectManager?._id === user?._id;
            const canEdit = user?.role === 'admin' || isPM;
            const isDeadlinePassed = new Date(proj.deadline) < new Date() && proj.status !== 'Completed';

            return (
              <div
                key={proj._id}
                className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <Badge variant={proj.status} size="xs">
                      {proj.status}
                    </Badge>
                    {canEdit && (
                      <div className="flex items-center gap-1 text-slate-400">
                        <button
                          onClick={() => {
                            setEditingProject(proj);
                            setIsModalOpen(true);
                          }}
                          className="p-1 hover:text-slate-700 rounded-md"
                          title="Edit Project"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(proj._id, proj.name)}
                          className="p-1 hover:text-rose-600 rounded-md"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <Link
                    to={`/projects/${proj._id}`}
                    className="text-base font-bold text-slate-900 hover:text-brand-600 transition-colors line-clamp-1"
                  >
                    {proj.name}
                  </Link>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="my-4 pt-3 border-t border-slate-100">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                    <span>Progress</span>
                    <span>{proj.completionPercentage || 0}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-brand-600 rounded-full transition-all duration-500"
                      style={{ width: `${proj.completionPercentage || 0}%` }}
                    />
                  </div>
                </div>

                {/* Footer with dates & members */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className={isDeadlinePassed ? 'text-rose-600 font-bold' : ''}>
                      {new Date(proj.deadline).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-medium text-slate-400">
                      PM: {proj.projectManager?.name?.split(' ')[0]}
                    </span>
                    <Link
                      to={`/projects/${proj._id}`}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-600 text-slate-600 transition-colors"
                      title="View Details"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200/80 shadow-sm">
          <FolderKanban className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No projects found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {search || statusFilter
              ? 'Try modifying your search query or status filter.'
              : 'Create your first project to organize tasks and assign team members.'}
          </p>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        pagination={pagination}
        onPageChange={(newPage) => loadProjects(newPage)}
      />

      {/* Modal */}
      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProject(null);
        }}
        initialData={editingProject}
      />
    </div>
  );
};

export default ProjectListPage;
