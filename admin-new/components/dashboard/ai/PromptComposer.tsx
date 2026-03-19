import { KeyboardEvent, RefObject } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, Send, Eraser, Bookmark, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PromptComposerProps {
  prompt: string;
  onPromptChange: (next: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  onSavePrompt: () => void;
  canSubmit: boolean;
  pending: boolean;
  validationMessage: string | null;
  promptRef: RefObject<HTMLTextAreaElement | null>;
  maxPromptLength: number;
  recentPrompts: string[];
  onUseRecentPrompt: (value: string) => void;
  suggestedPrompts: string[];
}

export const PromptComposer = ({
  prompt,
  onPromptChange,
  onSubmit,
  onClear,
  onSavePrompt,
  canSubmit,
  pending,
  validationMessage,
  promptRef,
  maxPromptLength,
  recentPrompts,
  onUseRecentPrompt,
  suggestedPrompts,
}: PromptComposerProps) => {
  const prefersReducedMotion = useReducedMotion();

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter") {
      return;
    }

    if (event.shiftKey) {
      return;
    }

    event.preventDefault();
    if (canSubmit) {
      onSubmit();
    }
  };

  return (
    <section
      aria-label="AI prompt composer"
      className="glass-effect border-gradient relative overflow-hidden rounded-2xl p-4 sm:p-6"
    >
      <div className="pointer-events-none absolute -right-20 -top-16 h-56 w-56 rounded-full bg-[hsla(263,70%,58%,0.22)] blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-56 w-56 rounded-full bg-[hsla(160,84%,39%,0.16)] blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 space-y-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Prompt Composer
            </p>
            <h2 className="text-gradient mt-1 text-lg font-semibold">
              What should the AI investigate?
            </h2>
          </div>
          <Badge
            variant="outline"
            className="border-white/20 bg-white/[0.05] text-foreground"
          >
            <Wand2 className="size-3" aria-hidden="true" />
            Enter to run
          </Badge>
        </div>

        <div className="space-y-2">
          <Textarea
            ref={promptRef}
            aria-label="Ask AI insights prompt"
            placeholder="Ask for revenue anomalies, SKU risk patterns, return insights, or campaign opportunities..."
            value={prompt}
            onChange={(event) => onPromptChange(event.target.value)}
            onKeyDown={onKeyDown}
            className="min-h-[130px] resize-y rounded-2xl border-white/15 bg-[hsla(240,14%,5%,0.85)] text-foreground placeholder:text-muted-foreground focus-visible:border-[hsla(263,70%,58%,0.55)] focus-visible:ring-[hsla(263,70%,58%,0.35)]"
          />
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <p
              className={cn(
                "text-slate-300/80",
                validationMessage ? "text-[hsl(43,96%,70%)]" : "text-muted-foreground",
              )}
            >
              {validationMessage || "Shift+Enter adds a new line"}
            </p>
            <p className="font-medium text-muted-foreground">
              {prompt.length}/{maxPromptLength}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {suggestedPrompts.map((item, index) => (
            <motion.button
              key={item}
              type="button"
              onClick={() => onUseRecentPrompt(item)}
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: prefersReducedMotion ? 0 : 0.05 + index * 0.03 }}
              whileHover={prefersReducedMotion ? undefined : { y: -1, scale: 1.01 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
              className="rounded-full border border-white/12 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-[hsla(263,70%,58%,0.45)] hover:bg-[hsla(263,70%,58%,0.14)]"
              aria-label={`Use suggested prompt: ${item}`}
            >
              {item}
            </motion.button>
          ))}
        </div>

        {recentPrompts.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Recent Prompts
            </p>
            <div className="flex flex-wrap gap-2">
              {recentPrompts.map((item, index) => (
                <motion.button
                  key={item}
                  type="button"
                  onClick={() => onUseRecentPrompt(item)}
                  initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: prefersReducedMotion ? 0 : index * 0.02 }}
                  whileHover={prefersReducedMotion ? undefined : { y: -1 }}
                  className="rounded-xl border border-white/12 bg-white/[0.03] px-3 py-1.5 text-xs text-foreground transition hover:border-[hsla(160,84%,39%,0.45)] hover:text-[hsl(160,84%,72%)]"
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Button
            type="button"
            disabled={!canSubmit}
            onClick={onSubmit}
            className="gradient-purple glow-purple h-10 rounded-xl px-4 font-semibold text-white hover:opacity-95"
          >
            <Send className="size-4" aria-hidden="true" />
            {pending ? "Asking..." : "Ask AI"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClear}
            className="h-10 rounded-xl border-white/20 bg-white/[0.03] px-4 text-foreground hover:bg-white/[0.08]"
          >
            <Eraser className="size-4" aria-hidden="true" />
            Clear
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onSavePrompt}
            className="h-10 rounded-xl text-[hsl(160,84%,72%)] hover:bg-[hsla(160,84%,39%,0.16)]"
          >
            <Bookmark className="size-4" aria-hidden="true" />
            Save Prompt
          </Button>
          <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-white/12 bg-white/[0.04] px-2.5 py-1 text-[11px] text-muted-foreground">
            <Sparkles className="size-3.5 text-[hsl(43,96%,56%)]" aria-hidden="true" />
            Ctrl/Cmd+K focus
          </span>
        </div>
      </motion.div>
    </section>
  );
};
