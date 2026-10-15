import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, clearAuthError } from '../../redux/slices/authSlice';
import { addToast } from '../../redux/slices/uiSlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { LogIn } from 'lucide-react';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    if (error) dispatch(clearAuthError());
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(formData));
    if (loginUser.fulfilled.match(result)) {
      dispatch(addToast({ type: 'success', message: 'Welcome back!' }));
      navigate('/dashboard');
    }
  };

  // Quick autofill helper for recruiters & interviewers
  const handleQuickFill = (email, password) => {
    setFormData({ email, password });
    if (error) dispatch(clearAuthError());
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-100 p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sign In</h2>
        <p className="text-xs text-slate-500 mt-1">
          Access your projects, tasks, and team collaboration dashboard
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          id="email"
          name="email"
          type="email"
          placeholder="name@company.com"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <Input
          label="Password"
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          loading={loading}
          icon={LogIn}
        >
          Sign In to Workspace
        </Button>
      </form>

      {/* Recruiter / Evaluator Quick Demo Accounts */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center mb-2.5">
          Recruiter Demo Accounts (1-Click Fill)
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickFill('admin@taskmanager.com', 'Password@123')}
            className="py-1.5 px-2 text-[11px] font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg border border-purple-200/60 transition-all text-center"
          >
            Admin
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('pm@taskmanager.com', 'Password@123')}
            className="py-1.5 px-2 text-[11px] font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg border border-indigo-200/60 transition-all text-center"
          >
            Manager
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('alex@taskmanager.com', 'Password@123')}
            className="py-1.5 px-2 text-[11px] font-semibold bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-lg border border-teal-200/60 transition-all text-center"
          >
            Member
          </button>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-slate-500">
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
          Create an account
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
