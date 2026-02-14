export default function PropertyCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="h-56 bg-gray-200 dark:bg-gray-700" />
      <div className="p-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4" />
        <div className="flex gap-4 border-t border-gray-100 dark:border-gray-700 pt-3 mb-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8" />
        </div>
        <div className="flex items-center gap-3 border-t border-gray-100 dark:border-gray-700 pt-3">
          <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="flex-1">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-1" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
