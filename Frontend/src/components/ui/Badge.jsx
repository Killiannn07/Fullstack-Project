export default function Badge({ status }) {
  const styles = {
    pending: "bg-amber-500",
    on_delivery: "bg-blue-500",
    complete: "bg-green-500",
  };

  return (
    <span className={`text-white text-xs px-2 py-1 rounded ${styles[status]}`}>
      {status}
    </span>
  );
}
