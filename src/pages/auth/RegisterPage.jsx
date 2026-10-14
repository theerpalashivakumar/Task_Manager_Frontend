import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearAuthError } from '../../redux/slices/authSlice';
import { addToast } from '../../redux/slices/uiSlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { UserPlus } from 'lucide-react';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'team_member',
  });

  const handleChange = (e) => {
    if (error) dispatch(clearAuthError());
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(result)) {
      dispatch(addToast({ type: 'success', message: 'Account registered successfully!' }));
      navigate('/dashboard');
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-100 p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Account</h2>
        <p className="text-xs text-slate-500 mt-1">
          Join your organization's workspace and start collaborating
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          id="name"
          name="name"
          type="text"
          placeholder="Jane Doe"
          value={formData.name}
          onChange={handleChange}
          required
        />

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
          placeholder="At least 6 characters"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <Input
          label="Initial Role"
          id="role"
          name="role"
          type="select"
          value={formData.role}
          onChange={handleChange}
          helperText="Choose the initial permission level for testing"
        >
          <option value="team_member">Team Member (View tasks & update status)</option>
          <option value="project_manager">Project Manager (Create projects & tasks)</option>
          <option value="admin">Admin (Full organizational control)</option>
        </Input>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          loading={loading}
          icon={UserPlus}
        >
          Complete Registration
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
