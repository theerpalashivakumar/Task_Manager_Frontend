import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  closeExplanationModal,
  verifyExplanationPassword,
} from '../../redux/slices/uiSlice';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { Lock, KeyRound, Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';

const ViewProjectModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isExplanationModalOpen, isExplanationUnlocked, explanationLoading, explanationError } =
    useSelector((state) => state.ui);

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) return;

    const resultAction = await dispatch(verifyExplanationPassword(password));
    if (verifyExplanationPassword.fulfilled.match(resultAction)) {
      setPassword('');
      navigate('/project-explanation');
    }
  };

  const handleClose = () => {
    setPassword('');
    dispatch(closeExplanationModal());
  };

  return (
    <Modal
      isOpen={isExplanationModalOpen}
      onClose={handleClose}
      title="System Architecture & Portfolio Review"
      subtitle="Restricted access for recruiters, evaluators & developers"
      maxWidth="max-w-md"
    >
      <div className="space-y-5">
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-brand-50 border border-brand-100/80 text-brand-900">
          <div className="p-2 rounded-lg bg-brand-600 text-white shrink-0 shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <p className="font-semibold text-brand-900">Protected Architecture Overview</p>
            <p className="text-brand-700 mt-0.5">
              Enter the designated reviewer password to unlock the comprehensive architectural documentation.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              label="Reviewer Access Password"
              id="explanation-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={explanationError}
              helperText="Passcode: Shiv@818780"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={explanationLoading}
              disabled={!password.trim()}
              icon={Sparkles}
            >
              Unlock Documentation
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ViewProjectModal;
