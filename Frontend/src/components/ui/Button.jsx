export default function Button({ children, loading, disabled, ...props }) {
  return (
    <button
      className="  items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold tracking-wide transition-all duration-300 bg-slate-900 hover:bg-slate-700 "
      disabled={loading || disabled}
      {...props}
    >
      {loading ? "Processing" : children}
    </button>
  );
}
