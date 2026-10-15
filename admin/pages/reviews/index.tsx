/**
 * Premium Reviews Page
 */
import PageLayout, { pageItem } from "@/components/layout/PageLayout";
import StatsCard from "@/components/ui/stats-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TableSkeleton, EmptyState, ErrorState } from "@/components/admin/shared/DataStates";
import { motion } from "framer-motion";
import {
  Star,
  MessageSquare,
  ThumbsUp,
  Search,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import { useAdminReviews } from "@/lib/hooks/useAdminData";

interface Review {
  id: string;
  customer: string;
  product: string;
  rating: number;
  comment: string;
  date: string;
  status: "published" | "pending" | "flagged";
  helpful: number;
}

const statusConfig: Record<string, { label: string; class: string }> = {
  published: {
    label: "Published",
    class: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  },
  pending: {
    label: "Pending",
    class: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  },
  flagged: {
    label: "Flagged",
    class: "bg-red-400/10 text-red-400 border-red-400/20",
  },
};

const Reviews = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { reviews, stats, isLoading, error, mutate } = useAdminReviews();

  const filtered = (reviews as Review[]).filter(
    (r) =>
      r.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.product?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const avgRating = stats?.avgRating ?? (reviews.length > 0
    ? Number((reviews.reduce((s: number, r: Review) => s + r.rating, 0) / reviews.length).toFixed(1))
    : 5.0);

  const fiveStarCount = reviews.filter((r: Review) => r.rating === 5).length;
  const pendingCount = stats?.pending ?? reviews.filter((r: Review) => r.status === "pending").length;
  const totalCount = stats?.total ?? reviews.length;

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          className={
            i < rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
          }
        />
      ))}
    </div>
  );

  return (
    <PageLayout title="Reviews" breadcrumbs={[{ label: "Reviews" }]}>
      {/* KPI Stats */}
      <motion.section
        variants={pageItem}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatsCard
          title="Average Rating"
          value={avgRating}
          icon={Star}
          gradient="gradient-gold"
          glowClass="glow-gold"
        />
        <StatsCard
          title="Total Reviews"
          value={totalCount}
          icon={MessageSquare}
          trend={{ value: 8.5, label: "verified" }}
          gradient="gradient-purple"
          glowClass="glow-purple"
        />
        <StatsCard
          title="5-Star Reviews"
          value={fiveStarCount}
          icon={ThumbsUp}
          gradient="gradient-emerald"
          glowClass="glow-emerald"
        />
        <StatsCard
          title="Pending Review"
          value={pendingCount}
          icon={CheckCircle}
          gradient="gradient-amber"
        />
      </motion.section>

      {/* Search */}
      <motion.section variants={pageItem}>
        <div className="glass-effect rounded-xl p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reviews by customer, product, or keyword..."
              className="pl-10 bg-background border-border rounded-xl h-9"
            />
          </div>
        </div>
      </motion.section>

      {/* Reviews List */}
      <motion.section variants={pageItem} className="space-y-4">
        {isLoading ? (
          <TableSkeleton rows={5} />
        ) : error ? (
          <ErrorState message="Failed to load customer reviews from database." onRetry={() => mutate()} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No reviews found"
            description={searchQuery ? "Try refining your search keyword." : "No reviews submitted in the database yet."}
          />
        ) : (
          filtered.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card className="glass-effect glass-hover border-border transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10 shrink-0 border border-border">
                      <AvatarFallback className="gradient-purple text-white text-xs font-bold">
                        {review.customer
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                        <div>
                          <span className="text-sm font-semibold">
                            {review.customer}
                          </span>
                          <span className="text-xs text-muted-foreground ml-2">
                            on{" "}
                            <span className="text-foreground">
                              {review.product}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${statusConfig[review.status]?.class || statusConfig.published.class}`}
                          >
                            {statusConfig[review.status]?.label || review.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {review.date}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        {renderStars(review.rating)}
                        <span className="text-xs text-muted-foreground font-medium">
                          {review.rating}.0
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground/90 leading-relaxed">
                        {review.comment}
                      </p>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/60">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <ThumbsUp size={11} /> {review.helpful} people found this helpful
                        </span>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs h-7 hover:bg-accent rounded-lg"
                          >
                            Moderate
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.section>
    </PageLayout>
  );
};

export default Reviews;

import type { GetServerSidePropsContext } from "next";
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { requireAdmin } = await import("@/lib/ssrAuth");
  return requireAdmin(ctx);
}
