import React from "react";

type SelectProps = {
  options: string[];
  ref: React.RefObject<HTMLSelectElement | null>;
  labelFor?: string;
  labelText?: string;
  onChange?: (opt: string) => void;
};

function Select({ options, ref, labelFor, labelText, onChange }: SelectProps) {
   
    
  return (
    <div>
      {labelText && <label htmlFor={labelFor}>{labelText}</label>}
      <select
        id={labelFor}
        ref={ref}
        onChange={(e) => {
          if (onChange) {
            onChange(e.target.value);
          }
        }}
        className="bg-white border border-gray-300 text-gray-900 text-lg rounded-lg p-1"
      >
        {options.map((opt) => {
          return (
            <option key={opt} value={opt}>
              {opt}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default Select;
