export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-blue)] flex items-center justify-center animate-pulse">
          <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
            <path d="M18 4L8 18H15L12 28L24 14H17L20 4H18Z" fill="#fbbf24" />
          </svg>
        </div>
        <div className="w-32 h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-[var(--color-blue)] rounded-full animate-[slide_1.2s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}
