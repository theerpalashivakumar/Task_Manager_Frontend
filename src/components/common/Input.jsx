import React from 'react';

const Input = ({
  label,
  id,
  name,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  rows = 3,
  children,
  ...props
}) => {
  const inputId = id || name;

  const baseInputStyles =
    'w-full rounded-lg border text-sm transition-colors duration-150 focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed';

  const stateStyles = error
    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 text-slate-900 bg-rose-50/20'
    : 'border-slate-300 focus:border-brand-500 focus:ring-brand-100 text-slate-900 bg-white';

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}

      {type === 'textarea' ? (
        <textarea
          id={inputId}
          name={name}
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`${baseInputStyles} ${stateStyles} p-2.5 resize-y`}
          {...props}
        />
      ) : type === 'select' ? (
        <select
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`${baseInputStyles} ${stateStyles} px-3 py-2 bg-white`}
          {...props}
        >
          {children}
        </select>
      ) : (
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`${baseInputStyles} ${stateStyles} px-3 py-2`}
          {...props}
        />
      )}

      {error ? (
        <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Input;
