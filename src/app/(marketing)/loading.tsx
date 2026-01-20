export default function MarketingLoading() {
  return (
    <div className="min-h-screen bg-[#FAFBFC] animate-pulse">
      {/* Navigation Skeleton */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="w-32 h-8 bg-slate-200 rounded" />
            <div className="hidden lg:flex items-center gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-20 h-4 bg-slate-200 rounded" />
              ))}
            </div>
            <div className="w-28 h-10 bg-slate-200 rounded-full" />
          </div>
        </div>
      </nav>

      {/* Hero Skeleton */}
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="w-40 h-6 bg-slate-200 rounded-full mb-8" />
            <div className="w-full h-16 bg-slate-200 rounded mb-4" />
            <div className="w-3/4 h-16 bg-slate-200 rounded mb-6" />
            <div className="w-full max-w-md h-6 bg-slate-200 rounded mb-8" />
            <div className="flex gap-4">
              <div className="w-36 h-12 bg-slate-200 rounded-full" />
              <div className="w-36 h-12 bg-slate-200 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Content Grid Skeleton */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200">
                <div className="w-12 h-12 bg-slate-200 rounded-xl mb-4" />
                <div className="w-32 h-6 bg-slate-200 rounded mb-2" />
                <div className="w-full h-4 bg-slate-200 rounded mb-1" />
                <div className="w-3/4 h-4 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
