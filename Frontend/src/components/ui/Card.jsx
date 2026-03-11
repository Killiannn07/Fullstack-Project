export default function Card({ children }) {
  return (
    <div className="bg-white border rounded-lg p-4 mb-3 shadow-sm">
      {children}
    </div>
  );
}
