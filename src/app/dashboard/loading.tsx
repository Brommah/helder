export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#FAFBFC] animate-pulse">
      {/* Header Skeleton */}
      <div className="h-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="w-32 h-8 bg-slate-200 rounded" />
          <div className="w-10 h-10 bg-slate-200 rounded-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Title Skeleton */}
        <div className="mb-8">
          <div className="w-48 h-8 bg-slate-200 rounded mb-2" />
          <div className="w-64 h-4 bg-slate-200 rounded" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-slate-200 rounded-xl" />
                <div className="flex-1">
                  <div className="w-16 h-6 bg-slate-200 rounded mb-1" />
                  <div className="w-24 h-4 bg-slate-200 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Skeleton */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="w-40 h-6 bg-slate-200 rounded mb-6" />
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-xl" />
                    <div className="flex-1">
                      <div className="w-32 h-4 bg-slate-200 rounded mb-2" />
                      <div className="w-48 h-3 bg-slate-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 h-64" />
          </div>
        </div>
      </div>
    </div>
  )
}
