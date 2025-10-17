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
          className={`peer w-full bg-gray-200 rounded-lg px-3 pt-5 pb-2 text-sm placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
          {...rest}
        />

        <label
          htmlFor={inputId}
          className={`absolute left-3 text-gray-500 transition-all duration-200 ${
            shouldFloatLabel ? "top-1 text-[8px]" : "top-3 text-[14px]"
          }`}
        >
          {label}
        </label>
      </div>
    );
  }
);
CustomInput.displayName = "CustomInput";
