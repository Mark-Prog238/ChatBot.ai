import { forwardRef, useState } from "react";

interface CustomInputProps {
  label: string;
  type?: "text" | "email" | "password" | "tel" | "url";
  value: string;
  onChange: (value: string) => void;
  name?: string;
  id?: string;
  className?: string;
  required?: boolean;
}

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  (
    { label, type, value, onChange, name, id, className = "", ...rest },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputId =
      id || name || `input-${Math.random().toString(36).substr(2, 9)}`;
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);
    const shouldFloatLabel = isFocused || value.length > 0;
    return (
      <div className="relative">
        <input
          ref={ref}
          type={type}
          value={value}
          name={name}
          id={inputId}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder=" "
          className={`peer w-full bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 pt-6 pb-3 text-sm placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg ${className}`}
          {...rest}
        />

        <label
          htmlFor={inputId}
          className={`absolute left-4 text-gray-500 transition-all duration-200 pointer-events-none ${
            shouldFloatLabel
              ? "top-2 text-[11px] font-semibold text-indigo-600"
              : "top-4 text-sm"
          }`}
        >
          {label}
        </label>
      </div>
    );
  }
);
CustomInput.displayName = "CustomInput";
