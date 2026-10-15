/**
 * Premium Support / Help Center Page
 */
import PageLayout, { pageItem } from "@/components/layout/PageLayout";
import StatsCard from "@/components/ui/stats-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TableSkeleton, EmptyState, ErrorState } from "@/components/admin/shared/DataStates";
import { motion } from "framer-motion";
import {
  Headphones,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Plus,
  User,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { useAdminSupport } from "@/lib/hooks/useAdminData";

interface Ticket {
  id: string;
  subject: string;
  customer: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in-progress" | "resolved" | "closed";
  createdAt: string;
  lastReply: string;
}

const priorityColors: Record<string, string> = {
  low: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  medium: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  high: "bg-orange-400/10 text-orange-400 border-orange-400/20",
  urgent: "bg-red-400/10 text-red-400 border-red-400/20",
};
const statusColors: Record<string, string> = {
  open: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  "in-progress": "bg-amber-400/10 text-amber-400 border-amber-400/20",
  resolved: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  closed: "bg-zinc-400/10 text-zinc-400 border-zinc-400/20",
};

const faqItems = [
  {
    q: "How do I process a refund?",
    a: "Go to the Orders or Returns page, select the specific item, and click 'Approve Return' or 'Refund'. The system automatically interacts with payment services.",
  },
  {
    q: "Can I customize email notifications?",
    a: "Yes! Navigate to Settings > Notifications to customize templates, triggers, and recipient preferences.",
  },
  {
    q: "How are shipping labels generated?",
    a: "Shipping labels can be generated from the Shipping page once an order is marked ready for dispatch with carrier tracking.",
  },
  {
    q: "What payment gateways are supported?",
    a: "ShopSwift supports Stripe, Apple Pay, Google Pay, and localized bank transfers out of the box.",
  },
];

const Support = () => {
  const [activeTab, setActiveTab] = useState("tickets");
  const [searchQuery, setSearchQuery] = useState("");
  const { tickets, stats, isLoading, error, mutate } = useAdminSupport();

  const openCount = stats?.open ?? tickets.filter((t: Ticket) => t.status === "open").length;
  const inProgressCount = stats?.inProgress ?? tickets.filter((t: Ticket) => t.status === "in-progress").length;
  const resolvedCount = stats?.resolved ?? tickets.filter((t: Ticket) => t.status === "resolved").length;

  const filteredTickets = (tickets as Ticket[]).filter(
    (t) =>
      t.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <PageLayout
      title="Support"
      breadcrumbs={[{ label: "Support" }]}
      headerActions={
        <Button
          size="sm"
          className="gap-2 text-xs gradient-purple text-white hover:opacity-90 rounded-xl h-8 border-0"
        >
          <Plus size={13} />
          New Ticket
        </Button>
      }
    >
      {/* KPI Stats */}
      <motion.section
        variants={pageItem}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatsCard
          title="Open Tickets"
          value={openCount}
          icon={AlertCircle}
          gradient="gradient-purple"
          glowClass="glow-purple"
        />
        <StatsCard
          title="In Progress"
          value={inProgressCount}
          icon={Clock}
          gradient="gradient-amber"
        />
        <StatsCard
          title="Resolved"
          value={resolvedCount}
          icon={CheckCircle}
          gradient="gradient-emerald"
          glowClass="glow-emerald"
        />
        <StatsCard
          title="Avg Response"
          value="1.8h"
          icon={MessageSquare}
          trend={{ value: -18, label: "faster" }}
          gradient="gradient-blue"
        />
      </motion.section>

      <motion.section variants={pageItem}>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="glass-effect rounded-xl p-1.5 inline-flex">
            <TabsList className="bg-transparent gap-1 h-auto p-0">
              <TabsTrigger
                value="tickets"
                className="data-[state=active]:gradient-purple data-[state=active]:text-white data-[state=active]:border-0 rounded-lg px-4 py-2 text-xs gap-2"
              >
                <Headphones size={13} />
                Tickets
              </TabsTrigger>
              <TabsTrigger
                value="faq"
                className="data-[state=active]:gradient-purple data-[state=active]:text-white data-[state=active]:border-0 rounded-lg px-4 py-2 text-xs gap-2"
              >
                <MessageSquare size={13} />
                FAQ
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tickets Tab */}
          <TabsContent value="tickets" className="space-y-4 mt-6">
            <div className="glass-effect rounded-xl p-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tickets by subject, customer, or ID..."
                  className="pl-10 bg-background border-border rounded-xl h-9"
                />
              </div>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                <TableSkeleton rows={5} />
              ) : error ? (
                <ErrorState message="Failed to load support tickets from database." onRetry={() => mutate()} />
              ) : filteredTickets.length === 0 ? (
                <EmptyState
                  title="No support tickets found"
                  description={searchQuery ? "Try refining your search terms." : "No support tickets found in database."}
                />
              ) : (
                filteredTickets.map((ticket, i) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <Card className="glass-effect glass-hover border-border transition-colors cursor-pointer">
                      <CardContent className="p-5">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono text-muted-foreground">
                                {ticket.id}
                              </span>
                              <Badge
                                variant="outline"
                                className={`text-[10px] ${priorityColors[ticket.priority] || priorityColors.medium}`}
                              >
                                {ticket.priority}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={`text-[10px] ${statusColors[ticket.status] || statusColors.open}`}
                              >
                                {ticket.status}
                              </Badge>
                            </div>
                            <h3 className="font-medium text-sm">
                              {ticket.subject}
                            </h3>
                            <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <User size={11} />
                                {ticket.customer}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar size={11} />
                                {ticket.createdAt}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={11} />
                                {ticket.lastReply}
                              </span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="gap-1 text-xs hover:bg-accent rounded-lg"
                          >
                            View <ArrowRight size={12} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-4 mt-6">
            {faqItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Card className="glass-effect border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-purple-400 shrink-0" />
                      {item.q}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground pl-6">
                      {item.a}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
      </motion.section>
    </PageLayout>
  );
};

export default Support;

import type { GetServerSidePropsContext } from "next";
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { requireAdmin } = await import("@/lib/ssrAuth");
  return requireAdmin(ctx);
}
