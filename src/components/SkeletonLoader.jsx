export const CardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm animate-pulse flex flex-col justify-between h-full">
      <div>
        <div className="w-full aspect-square bg-slate-200 dark:bg-slate-800 rounded-2xl mb-3"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3 mb-2"></div>
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4 mb-1"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/4 mb-4"></div>
      </div>
      <div className="flex items-center justify-between mt-auto pt-2">
        <div className="space-y-1 w-1/2">
          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-lg w-2/3"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3"></div>
        </div>
        <div className="w-16 h-8 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
      </div>
    </div>
  );
};

export const GridSkeleton = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <CardSkeleton key={idx} />
      ))}
    </div>
  );
};

export const DetailSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 animate-pulse">
      {/* Gallery skeleton */}
      <div className="space-y-4">
        <div className="w-full aspect-square bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
        <div className="flex space-x-3">
          <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        </div>
      </div>

      {/* Info skeleton */}
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/4"></div>
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/5"></div>
        </div>

        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3"></div>

        <div className="flex items-center space-x-4 border-y border-slate-100 dark:border-slate-800 py-4">
          <div className="w-24 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          <div className="w-32 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>

        <div className="space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-full"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-full"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-2/3"></div>
        </div>

        <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
      </div>
    </div>
  );
};
