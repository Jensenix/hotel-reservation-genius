const RevenueHeader = () => {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-light text-slate-800 mb-2 tracking-tight">
            Revenue <span className="font-semibold text-amber-600">Dashboard</span>
          </h1>
          <p className="text-slate-500 text-sm tracking-wide uppercase">
            Financial Performance & Analytics
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-amber-500"></div>
          <span className="text-amber-600 text-xs font-semibold tracking-widest">
            GENIUS SOCIETY HOTEL
          </span>
          <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-amber-500"></div>
        </div>
      </div>
    </div>
  );
};

export default RevenueHeader;