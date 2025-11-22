export default function Loader() {
  return (
    <div className="flex flex-col justify-center items-center h-[60vh] w-full space-y-4">
      {/* Modern dot pulse loader */}
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
      </div>

      {/* Minimal text */}
      <p className="text-sm text-muted-foreground font-light">Loading</p>
    </div>
  );
}