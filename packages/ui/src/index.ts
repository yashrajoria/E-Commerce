/**
 * Barrel module re-exporting the ShopSwift design system: the `cn` class-name utility,
 * the shadcn-style primitives (with ShopSwift variants and styling) and the shared
 * pattern components.
 */

// Utilities
export { cn } from "./lib/utils";

// Primitives
export { Button, buttonVariants, type ButtonProps } from "./primitives/button";
export { Badge, badgeVariants, type BadgeProps } from "./primitives/badge";
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "./primitives/card";
export { Input, type InputProps } from "./primitives/input";
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "./primitives/select";
export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./primitives/dialog";
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./primitives/tabs";
export { Separator } from "./primitives/separator";
export { Progress } from "./primitives/progress";
export { Skeleton } from "./primitives/skeleton";
export { Avatar, AvatarImage, AvatarFallback } from "./primitives/avatar";
export { Label } from "./primitives/label";
export { Checkbox } from "./primitives/checkbox";
export { Textarea, type TextareaProps } from "./primitives/textarea";
export { Switch } from "./primitives/switch";
export { Popover, PopoverTrigger, PopoverContent } from "./primitives/popover";
export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./primitives/tooltip";

// Patterns
export { EmptyState, type EmptyStateProps } from "./patterns/empty-state";
export { ErrorState, type ErrorStateProps } from "./patterns/error-state";
export {
  LoadingSpinner,
  type LoadingSpinnerProps,
} from "./patterns/loading-spinner";
export { LoadingState, type LoadingStateProps } from "./patterns/loading-state";
export { PageHeader, type PageHeaderProps } from "./patterns/page-header";
export { FormField, type FormFieldProps } from "./patterns/form-field";
export {
  DataTable,
  type DataTableProps,
  type Column,
} from "./patterns/data-table";
export {
  MetricDisplay,
  type MetricDisplayProps,
} from "./patterns/metric-display";
export {
  PriceDisplay,
  type PriceDisplayProps,
  formatCurrency,
} from "./patterns/price-display";
