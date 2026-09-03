export default function CatalogLoading() {
  return (
    <div className="container-site py-10">
      <div className="h-10 w-72 animate-pulse rounded-lg bg-surface" />
      <div className="mt-7 flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-11 w-28 animate-pulse rounded-full bg-surface" />
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="h-72 animate-pulse rounded-xl bg-surface" />
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[380px] animate-pulse rounded-xl bg-surface" />
          ))}
        </div>
      </div>
    </div>
  );
}
