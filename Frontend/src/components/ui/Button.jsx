export default function Button({ children, loading, disabled, ...props }) {
  return (
    <button
      className="bg-secondary text-white font-semibold cursor-pointer px-4 py-2 rounded hover:bg-primary disabled:opacity-50 transition"
      disabled={loading || disabled}
      {...props}
    >
      {loading ? "Processing" : children}
    </button>
  );
}
