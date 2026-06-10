"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <p className="text-muted-foreground">Something went wrong loading this page.</p>
      <button onClick={reset} className="text-primary underline underline-offset-4 text-sm">
        Try again
      </button>
    </div>
  );
}
