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
import { ShieldCheck, Eye, EyeOff, KeyRound } from 'lucide-react';

const ViewProjectModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isExplanationModalOpen, explanationLoading, explanationError } = useSelector(
    (state) => state.ui
  );

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
      subtitle="Restricted technical specifications for evaluators and recruiters"
      maxWidth="max-w-md"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} type="button">
            Cancel
          </Button>
          <Button
            type="submit"
            form="explanation-form"
            variant="primary"
            loading={explanationLoading}
            disabled={!password.trim()}
            icon={KeyRound}
          >
            Unlock Documentation
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-gradient-to-r from-brand-50 to-indigo-50/60 border border-brand-100 text-brand-900 shadow-sm">
          <div className="p-2.5 rounded-xl bg-brand-600 text-white shrink-0 shadow-md shadow-brand-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-brand-950">Protected Technical Overview</p>
            <p className="text-brand-700 mt-0.5 leading-relaxed">
              Enter your designated access passkey to view the end-to-end architecture and documentation.
            </p>
          </div>
        </div>

        <form id="explanation-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              label="Access Passkey"
              id="explanation-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter authorized passkey..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={explanationError}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-9 text-slate-400 hover:text-slate-600 transition-colors p-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ViewProjectModal;
