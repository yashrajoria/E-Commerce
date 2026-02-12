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
import { motion } from "framer-motion";
import {
  Star,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Search,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";

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

const mockReviews: Review[] = [
  {
    id: "1",
    customer: "John Doe",
    product: "Wireless Headphones Pro",
    rating: 5,
    comment:
      "Absolutely amazing sound quality! Best headphones I've ever owned. The noise cancellation is top-notch.",
    date: "2024-03-20",
    status: "published",
    helpful: 24,
  },
  {
    id: "2",
    customer: "Jane Smith",
    product: "Smart Watch Ultra",
    rating: 4,
    comment:
      "Great features and battery life. The only downside is the screen could be a bit brighter outdoors.",
    date: "2024-03-19",
    status: "published",
    helpful: 12,
  },
  {
    id: "3",
    customer: "Bob Wilson",
    product: "Running Shoes Elite",
    rating: 2,
    comment:
      "The sizing runs small. Had to return for a larger size. Comfort is okay once you get the right fit.",
    date: "2024-03-18",
    status: "flagged",
    helpful: 5,
  },
  {
    id: "4",
    customer: "Alice Brown",
    product: "Yoga Mat Premium",
    rating: 5,
    comment:
      "Perfect thickness and grip. Doesn't slip at all during practice. Highly recommend!",
    date: "2024-03-17",
    status: "pending",
    helpful: 8,
  },
  {
    id: "5",
    customer: "Charlie Davis",
    product: "Bluetooth Speaker Mini",
    rating: 3,
    comment:
      "Decent sound for the price. Battery could be better. Good for casual listening.",
    date: "2024-03-16",
    status: "published",
    helpful: 3,
  },
];

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

  const avgRating = (
    mockReviews.reduce((s, r) => s + r.rating, 0) / mockReviews.length
  ).toFixed(1);
  const fiveStarCount = mockReviews.filter((r) => r.rating === 5).length;
  const pendingCount = mockReviews.filter((r) => r.status === "pending").length;

  const filtered = mockReviews.filter(
    (r) =>
      r.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          className={
            i < rating ? "fill-amber-400 text-amber-400" : "text-white/10"
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
          value={mockReviews.length}
          icon={MessageSquare}
          trend={{ value: 8.5, label: "this month" }}
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
              placeholder="Search reviews..."
              className="pl-10 bg-white/[0.04] border-white/[0.08] rounded-xl h-9"
            />
          </div>
        </div>
      </motion.section>

      {/* Reviews List */}
      <motion.section variants={pageItem} className="space-y-4">
        {filtered.map((review, i) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Card className="glass-effect border-white/[0.06] hover:bg-white/[0.02] transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10 shrink-0 border border-white/[0.06]">
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
                        {renderStars(review.rating)}
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${statusConfig[review.status].class}`}
                        >
                          {statusConfig[review.status].label}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      {review.comment}
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-xs text-muted-foreground">
                        {review.date}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <ThumbsUp size={11} />
                        {review.helpful} found helpful
                      </span>
                      <div className="flex items-center gap-1 ml-auto">
                        {review.status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 text-[10px] rounded-lg border-white/[0.08] gap-1"
                          >
                            <CheckCircle size={10} />
                            Approve
                          </Button>
                        )}
                        {review.status === "flagged" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 text-[10px] rounded-lg border-red-500/20 text-red-400 gap-1"
                          >
                            <ThumbsDown size={10} />
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.section>
    </PageLayout>
  );
};

export default Reviews;
