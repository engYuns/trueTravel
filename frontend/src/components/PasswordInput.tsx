'use client';

import { useId, useState } from 'react';

type PasswordInputProps = {
  value?: string;
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  name?: string;
  autoComplete?: string;
  disabled?: boolean;
};

export default function PasswordInput({
  value,
  defaultValue,
  onChange,
  placeholder,
  className,
  inputClassName,
  buttonClassName,
  name,
  autoComplete,
  disabled
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const inputId = useId();

  return (
    <div className={className ?? 'flex items-center gap-3'}>
      <input
        id={inputId}
        className={
          inputClassName ??
          'flex-1 border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500'
        }
        type={visible ? 'text' : 'password'}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        autoComplete={autoComplete}
        disabled={disabled}
      />
      <button
        type="button"
        className={
          buttonClassName ??
          'shrink-0 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300 rounded-md font-semibold cursor-pointer'
        }
        onClick={() => setVisible((v) => !v)}
        aria-controls={inputId}
        aria-label={visible ? 'Hide password' : 'Show password'}
        disabled={disabled}
      >
        {visible ? 'Hide' : 'Show'}
      </button>
    </div>
  );
}
