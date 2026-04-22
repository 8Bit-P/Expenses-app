interface CardWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function CardWrapper({ children, className = "" }: CardWrapperProps) {
  return (
    <div
      className={`bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col justify-between flex-none w-[280px] sm:w-auto snap-center ${className}`}
    >
      {children}
    </div>
  );
}
