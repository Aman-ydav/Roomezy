export default function Loader() {
  return (
    <div className="flex flex-col justify-center items-center h-[60vh] w-full">
      {/* Loader circle */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-[5px] border-primary/20 rounded-full"></div>
        <div className="absolute inset-0 border-[5px] border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>

        {/* Subtle inner glow */}
        <div className="absolute inset-1 bg-linear-to-tr from-primary/10 to-transparent rounded-full blur-[1px]"></div>
      </div>

      {/* Loading text */}
      <p className="mt-4 text-primary font-medium tracking-wide animate-pulse">
        Loading...
      </p>
    </div>
  );
}
