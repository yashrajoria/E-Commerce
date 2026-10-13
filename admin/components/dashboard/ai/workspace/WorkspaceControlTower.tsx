import { Button } from "@/components/ui/button";
import { BrainCircuit, History, Trash2 } from "lucide-react";
import React from "react";

interface WorkspaceControlTowerProps {
  savedPrompts: string[];
  onUsePrompt: (prompt: string) => void;
  onOpenClearDialog: () => void;
}

export function WorkspaceControlTower({
  savedPrompts,
  onUsePrompt,
  onOpenClearDialog,
}: WorkspaceControlTowerProps) {
  return (
    <aside className="glass-effect rounded-[28px] p-4 lg:sticky lg:top-24 lg:h-fit">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        Control Tower
      </p>
      <div className="mt-3 space-y-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <div className="flex items-center gap-2">
            <BrainCircuit
              className="size-4 text-[hsl(23,83%,72%)]"
              aria-hidden="true"
            />
            <p className="text-sm font-semibold text-foreground">
              Workspace Runbook
            </p>
          </div>
          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
            <p>1. Pick a workflow lane or guided start.</p>
            <p>2. Refine the brief in the command deck.</p>
            <p>3. Validate the answer against traces and diagnostics.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <div className="flex items-center gap-2">
            <History
              className="size-4 text-[hsl(191,73%,72%)]"
              aria-hidden="true"
            />
            <p className="text-sm font-semibold text-foreground">
              Saved Prompt Vault
            </p>
          </div>
          {savedPrompts.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Save the prompts you reuse most and they will appear here as
              one-click brief starters.
            </p>
          ) : (
            <div className="mt-3 space-y-2">
              {savedPrompts.slice(0, 4).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => onUsePrompt(item)}
                  className="w-full rounded-xl border border-white/10 bg-[hsla(210,16%,10%,0.72)] px-3 py-2 text-left text-sm text-foreground transition hover:border-[hsla(191,73%,56%,0.3)] hover:text-[hsl(191,73%,72%)]"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-[hsla(35,74%,64%,0.35)] bg-[hsla(35,74%,64%,0.08)] p-3">
          <p className="text-sm font-semibold text-[hsl(35,74%,84%)]">
            Reset session context
          </p>
          <p className="mt-1 text-xs leading-5 text-[hsl(35,74%,84%)]">
            Clear the current thread when you want the next answer to start
            from a clean analytical baseline.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={onOpenClearDialog}
            className="mt-3 h-9 rounded-xl border-[hsla(35,74%,64%,0.42)] bg-transparent text-[hsl(35,74%,84%)] hover:bg-[hsla(35,74%,64%,0.14)]"
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
            Clear Session
          </Button>
        </div>
      </div>
    </aside>
  );
}

