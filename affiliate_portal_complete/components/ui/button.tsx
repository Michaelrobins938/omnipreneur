export function Button({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="bg-black text-white px-4 py-2 rounded text-sm hover:opacity-90"
    >
      {children}
    </button>
  );
}
