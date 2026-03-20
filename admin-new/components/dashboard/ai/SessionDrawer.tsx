import { Trash2, MessageSquareText, Clock4 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PromptHistoryItem } from "@/types/ai-insights";

interface SessionDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  history: PromptHistoryItem[];
  savedPrompts: string[];
  onUsePrompt: (value: string) => void;
  onRemoveSavedPrompt: (value: string) => void;
}

export const SessionDrawer = ({
  open,
  onOpenChange,
  history,
  savedPrompts,
  onUsePrompt,
  onRemoveSavedPrompt,
}: SessionDrawerProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-effect-strong max-h-[88vh] overflow-auto border-white/15 text-foreground sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-gradient-royal text-xl">Session History</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Reuse your prior prompts and keep continuity across this admin session.
          </DialogDescription>
        </DialogHeader>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Saved Prompts
          </h3>
          {savedPrompts.length === 0 ? (
            <p className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-muted-foreground">
              No saved prompts yet.
            </p>
          ) : (
            <div className="space-y-2">
              {savedPrompts.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-2"
                >
                  <button
                    type="button"
                    onClick={() => onUsePrompt(item)}
                    className="flex-1 text-left text-sm text-foreground hover:text-[hsl(191,73%,72%)]"
                  >
                    {item}
                  </button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemoveSavedPrompt(item)}
                    className="h-8 rounded-lg text-[hsl(35,74%,76%)] hover:bg-[hsla(35,74%,64%,0.14)]"
                    aria-label={`Remove saved prompt ${item}`}
                  >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Recent Answers
          </h3>

          {history.length === 0 ? (
            <p className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-muted-foreground">
              Start a prompt to build session history.
            </p>
          ) : (
            <div className="space-y-2">
              {history.map((item) => (
                <article
                  key={item.id}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
                >
                  <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <MessageSquareText className="size-3.5" aria-hidden="true" />
                    <span>{item.prompt}</span>
                  </div>
                  <p className="line-clamp-3 text-sm text-foreground">{item.answer}</p>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock4 className="size-3.5" aria-hidden="true" />
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => onUsePrompt(item.prompt)}
                      className="h-7 rounded-lg border-white/20 bg-transparent text-[hsl(191,73%,72%)]"
                    >
                      Reuse
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </DialogContent>
    </Dialog>
  );
};
