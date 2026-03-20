import Link from "next/link";
import { KeyboardEvent, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Bot,
  Clock3,
  LoaderCircle,
  Send,
  Sparkles,
  Wand2,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAIInsights } from "@/hooks/useAIInsights";
import {
  AIResolvedPageContext,
  buildContextualPrompt,
} from "@/lib/ai-contextual-assistant";
import { cn } from "@/lib/utils";

interface ContextualAIAssistantProps {
  context: AIResolvedPageContext;
}

const formatTimestamp = (value: string | undefined) => {
  if (!value) {
    return "";
  }

  try {
    return new Date(value).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

export const ContextualAIAssistant = ({
  context,
}: ContextualAIAssistantProps) => {
  const prefersReducedMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);

  const transformPrompt = useMemo(
    () => (prompt: string) => buildContextualPrompt(context, prompt),
    [context],
  );

  const {
    prompt,
    setPrompt,
    submitPrompt,
    clearPrompt,
    responseText,
    diagnostics,
    friendlyError,
    lifecycle,
    history,
    canSubmit,
    promptValidationMessage,
  } = useAIInsights({
    maxPromptLength: 1200,
    storageNamespace: context.sessionNamespace,
    transformPrompt,
  });

  useEffect(() => {
    setPrompt("");
  }, [context.sessionNamespace, setPrompt]);

  const onPromptSubmit = () => {
    if (!canSubmit) {
      return;
    }

    void submitPrompt();
  };

  const runQuickAction = (nextPrompt: string) => {
    setPrompt(nextPrompt);
    setIsOpen(true);
    void submitPrompt(nextPrompt);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    event.preventDefault();
    onPromptSubmit();
  };

  const workspaceHref = {
    pathname: "/dashboard/ai-insights",
    query: {
      sourceTitle: context.title,
      sourcePath: context.route,
      prefill: prompt,
    },
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-end px-3 sm:px-5">
      <AnimatePresence initial={false} mode="wait">
        {isOpen ? (
          <motion.aside
            key="assistant-panel"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : 14, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto w-full max-w-[26rem]"
            aria-label={`${context.title} contextual AI assistant`}
          >
            <div className="glass-effect-strong border-gradient relative overflow-hidden rounded-[28px] p-4 shadow-[0_24px_80px_hsla(240,30%,3%,0.55)]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsla(263,70%,58%,0.2),transparent_36%),radial-gradient(circle_at_bottom_left,hsla(160,84%,39%,0.16),transparent_34%)]" />

              <div className="relative z-10 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/[0.08] text-[hsl(43,96%,68%)] shadow-[0_14px_30px_hsla(43,96%,56%,0.12)]">
                    <Bot className="size-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                          Contextual Copilot
                        </p>
                        <h2 className="mt-1 text-lg font-semibold text-foreground">
                          {context.title}
                        </h2>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsOpen(false)}
                        className="size-8 rounded-xl text-muted-foreground hover:bg-white/[0.08]"
                        aria-label="Close contextual AI assistant"
                      >
                        <X className="size-4" aria-hidden="true" />
                      </Button>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {context.summary}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {context.focusAreas.map((item) => (
                    <Badge
                      key={item}
                      variant="outline"
                      className="border-white/15 bg-white/[0.04] text-foreground"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Quick Tasks
                    </p>
                    <p className="text-xs text-muted-foreground">
                      One tap runs the task
                    </p>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {context.quickActions.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => runQuickAction(item.prompt)}
                        className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-left transition hover:border-[hsla(263,70%,58%,0.35)] hover:bg-white/[0.08]"
                      >
                        <p className="text-sm font-semibold text-foreground">
                          {item.label}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          {item.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Textarea
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder={context.placeholder}
                    className="min-h-[118px] rounded-2xl border-white/15 bg-[hsla(240,14%,5%,0.84)] text-foreground placeholder:text-muted-foreground focus-visible:border-[hsla(263,70%,58%,0.55)] focus-visible:ring-[hsla(263,70%,58%,0.3)]"
                    aria-label={`Ask AI about ${context.title}`}
                  />
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <p
                      className={cn(
                        "text-muted-foreground",
                        promptValidationMessage && "text-[hsl(43,96%,72%)]",
                      )}
                    >
                      {promptValidationMessage || "Enter sends. Shift+Enter adds a line."}
                    </p>
                    <p className="text-muted-foreground">
                      {history.length} saved exchanges
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    onClick={onPromptSubmit}
                    disabled={!canSubmit}
                    className="gradient-purple h-10 rounded-xl px-4 font-semibold text-white hover:opacity-95"
                  >
                    {lifecycle === "loading" ? (
                      <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Send className="size-4" aria-hidden="true" />
                    )}
                    {lifecycle === "loading" ? "Working..." : "Ask Copilot"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearPrompt}
                    className="h-10 rounded-xl border-white/15 bg-white/[0.03] text-foreground hover:bg-white/[0.08]"
                  >
                    Clear
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    asChild
                    className="ml-auto h-10 rounded-xl text-[hsl(160,84%,72%)] hover:bg-[hsla(160,84%,39%,0.14)]"
                  >
                    <Link href={workspaceHref}>
                      Full Workspace
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[hsla(240,14%,6%,0.72)] p-3">
                  {lifecycle === "loading" ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-[hsl(160,84%,72%)]">
                        <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />
                        Running page-aware tools
                      </div>
                      <div className="h-3 w-full animate-pulse rounded bg-white/10" />
                      <div className="h-3 w-5/6 animate-pulse rounded bg-white/10" />
                    </div>
                  ) : friendlyError ? (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-[hsl(43,96%,78%)]">
                        Request needs attention
                      </p>
                      <p className="text-sm text-[hsl(43,96%,88%)]">
                        {friendlyError}
                      </p>
                    </div>
                  ) : responseText ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge className="gradient-emerald text-white">
                          <Sparkles className="size-3.5" aria-hidden="true" />
                          Page-aware response
                        </Badge>
                        {diagnostics?.toolsCalled?.length ? (
                          <span className="text-xs text-muted-foreground">
                            {diagnostics.toolsCalled.length} tool
                            {diagnostics.toolsCalled.length === 1 ? "" : "s"}
                          </span>
                        ) : null}
                        {diagnostics?.timestamp ? (
                          <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock3 className="size-3.5" aria-hidden="true" />
                            {formatTimestamp(diagnostics.timestamp)}
                          </span>
                        ) : null}
                      </div>
                      <p className="max-h-40 overflow-y-auto whitespace-pre-wrap text-sm leading-6 text-foreground">
                        {responseText}
                      </p>
                      {diagnostics?.toolsCalled?.length ? (
                        <div className="flex flex-wrap gap-2">
                          {diagnostics.toolsCalled.map((tool) => (
                            <Badge
                              key={tool}
                              variant="outline"
                              className="border-[hsla(160,84%,39%,0.3)] bg-[hsla(160,84%,39%,0.12)] text-[hsl(160,84%,78%)]"
                            >
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Wand2 className="size-4 text-[hsl(43,96%,62%)]" aria-hidden="true" />
                        Ready on this page
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Use a quick task for a one-click investigation or ask a
                        custom question without leaving your workflow.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.aside>
        ) : (
          <motion.button
            key="assistant-trigger"
            type="button"
            onClick={() => setIsOpen(true)}
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/12 bg-[hsla(240,14%,8%,0.9)] px-4 py-3 text-left shadow-[0_18px_50px_hsla(240,30%,3%,0.5)] backdrop-blur-xl transition hover:border-[hsla(263,70%,58%,0.35)] hover:bg-[hsla(240,14%,10%,0.94)]"
            aria-label={`Open AI assistant for ${context.title}`}
          >
            <span className="flex size-10 items-center justify-center rounded-full gradient-purple text-white shadow-[0_10px_26px_hsla(263,70%,58%,0.28)]">
              <Bot className="size-4.5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  Ask AI
                </span>
                <Badge className="bg-[hsla(160,84%,39%,0.18)] text-[hsl(160,84%,78%)]">
                  {context.title}
                </Badge>
              </span>
              <span className="mt-0.5 block max-w-[16rem] truncate text-xs text-muted-foreground">
                Context-aware help without leaving the page
              </span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
