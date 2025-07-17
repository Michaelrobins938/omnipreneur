import * as React from "react";

export function Select({ value, onValueChange, children }) {
  return (
    <div className="relative inline-block w-48">
      <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {children}
      </select>
    </div>
  );
}

export function SelectTrigger({ children }) {
  return <>{children}</>;
}

export function SelectValue({ placeholder }) {
  return <option disabled value="">{placeholder}</option>;
}

export function SelectContent({ children }) {
  return <>{children}</>;
}

export function SelectItem({ value, children }) {
  return <option value={value}>{children}</option>;
}
