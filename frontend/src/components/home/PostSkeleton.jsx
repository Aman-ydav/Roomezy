export default function PostSkeleton() {
  return (
    <div className="animate-pulse border border-input bg-card rounded-lg p-3">
      <div className="h-40 bg-muted/80 rounded mb-3" />
      <div className="h-4 bg-muted/80 rounded w-3/4 mb-2" />
      <div className="h-3 bg-muted/80 rounded w-1/2 mb-2" />
      <div className="flex justify-between items-center mt-2">
        <div className="h-4 w-16 bg-muted/80 rounded" />
        <div className="h-4 w-10 bg-muted/80 rounded" />
      </div>
    </div>
  );
}
