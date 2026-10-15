import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUsers,
  updateUserRole,
  toggleUserStatus,
} from '../../redux/slices/userSlice';
import { addToast } from '../../redux/slices/uiSlice';
import userService from '../../services/userService';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import { Search, UserCheck, UserX, Trash2 } from 'lucide-react';
import { useCallback } from 'react';

const UserManagementPage = () => {
  const dispatch = useDispatch();
  const { items: users, pagination } = useSelector((state) => state.users);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const isAdmin = currentUser?.role === 'admin';

  const loadUsers = useCallback((page = 1) => {
    dispatch(
      fetchUsers({
        page,
        limit: 15,
        search,
        role: roleFilter,
      })
    );
  }, [dispatch, search, roleFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [loadUsers]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await dispatch(updateUserRole({ id: userId, role: newRole })).unwrap();
      dispatch(addToast({ type: 'success', message: 'User role updated' }));
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err || 'Failed to update role' }));
    }
  };

  const handleStatusToggle = async (userId, currentActive) => {
    try {
      await dispatch(toggleUserStatus(userId)).unwrap();
      dispatch(
        addToast({
          type: 'success',
          message: `User ${currentActive ? 'deactivated' : 'activated'}`,
        })
      );
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err || 'Status update failed' }));
    }
  };

  const handleDeleteUser = async (userId, name) => {
    if (window.confirm(`Permanently remove user "${name}"?`)) {
      try {
        await userService.deleteUser(userId);
        dispatch(addToast({ type: 'success', message: 'User removed' }));
        loadUsers(pagination.page);
      } catch (err) {
        dispatch(addToast({ type: 'error', message: err.message || 'Failed to delete' }));
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Team & User Directory
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage organization members, assign roles, and control system authorization
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        >
          <option value="">All Roles</option>
          <option value="admin">Administrators</option>
          <option value="project_manager">Project Managers</option>
          <option value="team_member">Team Members</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">User</th>
                <th className="py-3.5 px-6">Current Role</th>
                <th className="py-3.5 px-6">Account Status</th>
                <th className="py-3.5 px-6">Registered</th>
                {isAdmin && <th className="py-3.5 px-6 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => {
                const targetUserId = (u._id || u.id)?.toString();
                const currentUserId = (currentUser?._id || currentUser?.id)?.toString();
                const isSelf = targetUserId && currentUserId && targetUserId === currentUserId;

                return (
                  <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      {u.avatar ? (
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-slate-900 block">
                          {u.name} {isSelf && '(You)'}
                        </span>
                        <span className="text-slate-400 text-[11px]">{u.email}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      {isAdmin && !isSelf ? (
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="text-xs font-semibold px-2 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                        >
                          <option value="admin">Admin</option>
                          <option value="project_manager">Project Manager</option>
                          <option value="team_member">Team Member</option>
                        </select>
                      ) : (
                        <Badge variant={u.role} size="xs">
                          {u.role?.replace('_', ' ')}
                        </Badge>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium ${u.isActive
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                          }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                        />
                        {u.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    {isAdmin && (
                      <td className="py-4 px-6 text-right">
                        {!isSelf && (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleStatusToggle(u._id, u.isActive)}
                              className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${u.isActive
                                  ? 'text-amber-600 hover:bg-amber-50'
                                  : 'text-emerald-600 hover:bg-emerald-50'
                                }`}
                              title={u.isActive ? 'Deactivate Account' : 'Activate Account'}
                            >
                              {u.isActive ? (
                                <UserX className="w-4 h-4" />
                              ) : (
                                <UserCheck className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u._id, u.name)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination pagination={pagination} onPageChange={(p) => loadUsers(p)} />
    </div>
  );
};

export default UserManagementPage;
