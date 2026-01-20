export default function RootLoading() {
  return (
    <div className="min-h-screen bg-[#FAFBFC] flex items-center justify-center">
      <div className="text-center">
        {/* Logo placeholder */}
        <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl animate-pulse" />
        
        {/* Loading spinner */}
        <div className="relative w-12 h-12 mx-auto">
          <div className="absolute inset-0 border-4 border-slate-200 rounded-full" />
          <div className="absolute inset-0 border-4 border-transparent border-t-amber-500 rounded-full animate-spin" />
        </div>
        
        {/* Text */}
        <p className="mt-6 text-slate-500 text-sm font-medium">Laden...</p>
      </div>
    </div>
  )
}
