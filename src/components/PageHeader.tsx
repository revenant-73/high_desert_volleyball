interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="relative bg-gray-950 pt-52 md:pt-40 pb-16 px-4 overflow-hidden border-b border-gray-900">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
