export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-120px)] w-full">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-800 border-t-black dark:border-t-white rounded-full animate-spin"></div>
        <p className="animate-pulse font-medium">Loading...</p>
      </div>
    </div>
  );
}