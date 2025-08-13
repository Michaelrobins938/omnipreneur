import * as React from "react";

export function Table({ children }) {
  return (
    <table className="min-w-full text-sm table-auto border-collapse">
      {children}
    </table>
  );
}

export function TableHead({ children }) {
  return (
    <thead className="bg-gray-100 border-b">
      {children}
    </thead>
  );
}

export function TableBody({ children }) {
  return <tbody>{children}</tbody>;
}

export function TableRow({ children }) {
  return <tr className="border-b">{children}</tr>;
}

export function TableCell({ children }) {
  return <td className="p-2 align-top">{children}</td>;
}
