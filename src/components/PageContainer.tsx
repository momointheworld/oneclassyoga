type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function PageContainer({
  children,
  className = '',
}: PageContainerProps) {
  return (
    <main
      className={`max-w-4xl mx-auto px-8 sm:px-6 md:px-4 py-24 sm:py-20 md:py-16 ${className}`}
    >
      {children}
    </main>
  );
}
