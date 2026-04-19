import { Activity, Wrench, Bug } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AIInsightsDiagnostics, AgentToolDefinition } from "@/types/ai-insights";

interface DiagnosticsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  diagnostics: AIInsightsDiagnostics | null;
  tools: AgentToolDefinition[];
}

export const DiagnosticsDrawer = ({
  open,
  onOpenChange,
  diagnostics,
  tools,
}: DiagnosticsDrawerProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-effect-strong max-h-[88vh] overflow-auto border-white/15 text-foreground sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-gradient-royal text-xl">Diagnostics</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Trace model behavior, tool metadata, and support context for debugging.
          </DialogDescription>
        </DialogHeader>

        <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.13em] text-muted-foreground">
            <Activity className="size-3.5 text-[hsl(191,73%,62%)]" aria-hidden="true" />
            Request Metadata
          </h3>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Correlation ID</dt>
              <dd className="mt-1 break-all text-foreground">{diagnostics?.correlationId || "-"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Latency</dt>
              <dd className="mt-1 text-foreground">
                {typeof diagnostics?.latencyMs === "number" ? `${diagnostics.latencyMs} ms` : "-"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Timestamp</dt>
              <dd className="mt-1 text-foreground">
                {diagnostics?.timestamp ? new Date(diagnostics.timestamp).toLocaleString() : "-"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Tools Called</dt>
              <dd className="mt-1 text-foreground">{diagnostics?.toolsCalled.length || 0}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.13em] text-muted-foreground">
            <Wrench className="size-3.5 text-[hsl(23,83%,72%)]" aria-hidden="true" />
            Available Tools
          </h3>
          {tools.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tool metadata available.</p>
          ) : (
            <ul className="space-y-2">
              {tools.map((tool) => (
                <li
                  key={tool.name}
                  className="rounded-lg border border-white/10 bg-[hsla(240,14%,6%,0.66)] p-2.5 text-sm"
                >
                  <p className="font-medium text-foreground">{tool.name}</p>
                  {tool.description && <p className="mt-1 text-xs text-muted-foreground">{tool.description}</p>}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.13em] text-muted-foreground">
            <Bug className="size-3.5 text-[hsl(35,74%,64%)]" aria-hidden="true" />
            Raw Diagnostic Payload
          </h3>
          <pre className="max-h-80 overflow-auto rounded-lg bg-[hsla(240,15%,4.5%,0.86)] p-3 text-xs text-foreground">
            {JSON.stringify(diagnostics, null, 2)}
          </pre>
        </section>
      </DialogContent>
    </Dialog>
  );
};
