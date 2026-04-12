import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Ban } from "lucide-react";
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
export function EmptyState({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <Card className="flex flex-col items-center justify-center py-12">
      <CardHeader className="flex flex-col items-center">
        <Ban className="w-10 h-10 text-muted-foreground mb-2" />
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {description && <p className="text-muted-foreground mb-2 text-center">{description}</p>}
        {action}
      </CardContent>
    </Card>
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
