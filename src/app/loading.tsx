export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-slate-100 rounded-full"></div>
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div className="mt-8 text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] animate-pulse">
        HIMASAKTA ITS
      </div>
    </div>
  );
}
