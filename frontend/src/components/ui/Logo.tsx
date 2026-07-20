import { Sparkles } from "lucide-react";

export default function Logo({ withText = true }: { withText?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-purple-600 shadow-glow">
        <Sparkles className="h-5 w-5 text-white" strokeWidth={2.2} />
      </div>
      {withText && (
        <span className="text-lg font-bold tracking-tight">
          Resume<span className="gradient-text">AI</span>
        </span>
      )}
    </div>
  );
}
