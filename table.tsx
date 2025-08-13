// /components/ui/table.tsx
import { ReactNode } from 'react';

export function Table({ children }: { children: ReactNode }) {
  return <table className="w-full border-collapse border">{children}</table>;
}

export function TableHead({ children }: { children: ReactNode }) {
  return <thead className="bg-gray-100">{children}</thead>;
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TableRow({ children }: { children: ReactNode }) {
  return <tr className="border-b">{children}</tr>;
}

export function TableCell({ children }: { children: ReactNode }) {
  return <td className="p-2 text-sm text-gray-800">{children}</td>;
}
