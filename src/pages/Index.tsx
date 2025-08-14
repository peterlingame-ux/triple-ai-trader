import { memo, Suspense, lazy } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load the main dashboard for better performance
const TradingDashboard = lazy(() => import("@/components/TradingDashboard"));

// Error fallback component
const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center p-6">
      <h2 className="text-xl font-bold text-destructive mb-2">出现错误</h2>
      <p className="text-muted-foreground mb-4">{error.message}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
      >
        重新加载
      </button>
    </div>
  </div>
);

// Loading skeleton for the dashboard
const DashboardSkeleton = () => (
  <div className="min-h-screen p-6 bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900">
    <div className="max-w-7xl mx-auto space-y-8">
      <Skeleton className="h-32 w-full rounded-2xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);

const Index = memo(() => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<DashboardSkeleton />}>
        <TradingDashboard />
      </Suspense>
    </ErrorBoundary>
  );
});

Index.displayName = "Index";

export default Index;
