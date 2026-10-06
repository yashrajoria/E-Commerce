import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ShieldAlert,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  confirmMutation,
  fetchPendingMutations,
  triggerWatchdogScan,
  PendingMutation,
} from "@/lib/ai-insights-api";

export const IncidentTriageBanner: React.FC = () => {
  const [incidents, setIncidents] = useState<PendingMutation[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const loadIncidents = async () => {
    setLoading(true);
    try {
      const data = await fetchPendingMutations();
      setIncidents(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const handleAction = async (requestId: string, approve: boolean) => {
    setActionInProgress(requestId);
    try {
      const res = await confirmMutation(requestId, approve);
      if (res.success) {
        setIncidents((prev) => prev.filter((i) => i.request_id !== requestId));
      }
    } finally {
      setActionInProgress(null);
    }
  };

  const handleScan = async () => {
    setScanning(true);
    try {
      await triggerWatchdogScan();
      await loadIncidents();
    } finally {
      setScanning(false);
    }
  };

  if (incidents.length === 0 && !loading) {
    return (
      <div className="flex items-center justify-between rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm">
        <div className="flex items-center gap-2.5 text-emerald-400">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>
            <strong className="font-semibold">Autonomous Ops Sentry:</strong> All systems operating normally. Zero pending incidents.
          </span>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleScan}
          disabled={scanning}
          className="h-8 gap-1.5 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10"
        >
          <RefreshCw className={`size-3.5 ${scanning ? "animate-spin" : ""}`} />
          {scanning ? "Scanning..." : "Run Sentry Scan"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="size-5 text-amber-400" />
          <h2 className="text-base font-semibold text-foreground">
            Active Ops Incident Triage ({incidents.length})
          </h2>
        </div>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={handleScan}
          disabled={scanning}
          className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className={`size-3.5 ${scanning ? "animate-spin" : ""}`} />
          {scanning ? "Scanning..." : "Rescan"}
        </Button>
      </div>

      <AnimatePresence>
        {incidents.map((incident) => {
          const args =
            typeof incident.arguments === "string"
              ? JSON.parse(incident.arguments)
              : incident.arguments;

          return (
            <motion.div
              key={incident.request_id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 backdrop-blur"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-amber-400 text-amber-300">
                      <AlertTriangle className="mr-1 size-3" />
                      Pending Approval
                    </Badge>
                    <span className="font-mono text-xs text-muted-foreground">
                      tool: {incident.tool}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {incident.prompt}
                  </p>
                  {args && Object.keys(args).length > 0 && (
                    <div className="font-mono text-xs text-amber-200/80">
                      Params: {JSON.stringify(args)}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleAction(incident.request_id, false)}
                    disabled={actionInProgress === incident.request_id}
                    className="h-8 text-xs text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  >
                    <XCircle className="mr-1 size-3.5" />
                    Dismiss
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleAction(incident.request_id, true)}
                    disabled={actionInProgress === incident.request_id}
                    className="h-8 gap-1.5 bg-amber-500 text-xs font-semibold text-black hover:bg-amber-400"
                  >
                    <Zap className="size-3.5" />
                    {actionInProgress === incident.request_id ? "Executing..." : "Approve & Execute"}
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
