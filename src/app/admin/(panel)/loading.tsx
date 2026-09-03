export default function AdminLoading() {
  return (
    <div>
      <div className="h-9 w-56 animate-pulse rounded-lg bg-line/60" />
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-xl bg-line/60" />
        ))}
      </div>
      <div className="mt-6 h-80 animate-pulse rounded-xl bg-line/60" />
    </div>
  );
}
