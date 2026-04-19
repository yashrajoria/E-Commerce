import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Ban, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

// TableSkeleton — shows N skeleton rows while loading
export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i}>
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j}>
              <Skeleton className="h-6 w-full rounded" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

// EmptyState — shows when list is empty
export function EmptyState({
  title,
  description,
  icon: Icon = Ban,
  action,
  actionLabel,
  onAction,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="w-16 h-16 rounded-2xl gradient-purple glow-purple flex items-center justify-center mb-6">
        <Icon size={28} className="text-white" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        {description}
      </p>
      {action}
      {!action && actionLabel && onAction && (
        <Button
          onClick={onAction}
          size="sm"
          className="gradient-purple text-white hover:opacity-90 rounded-xl border-0"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}

// ErrorState — shows when fetch fails
export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <Alert variant="destructive" className="flex flex-col items-center">
      <AlertCircle className="w-6 h-6 mb-2" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message || "Something went wrong."}</AlertDescription>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="mt-2">
          Retry
        </Button>
      )}
    </Alert>
  );
}

// StatusBadge — consistent status colours
export function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, "secondary" | "default" | "destructive"> = {
    pending: "secondary",
    processing: "default",
    shipped: "default",
    delivered: "default",
    cancelled: "destructive",
    sent: "default",
    failed: "destructive",
    active: "default",
    expired: "secondary",
  };
  return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
}
