
import { Card } from "@/components/ui/card";

export function LoadingDashboard() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="glass-morphism animate-pulse">
          <div className="p-6">
            <div className="h-6 bg-white/10 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-white/10 rounded w-2/3 mb-4"></div>
            <div className="h-24 bg-white/5 rounded mb-4"></div>
            <div className="h-10 bg-white/10 rounded w-full"></div>
          </div>
        </Card>
      ))}
    </div>
  );
}
