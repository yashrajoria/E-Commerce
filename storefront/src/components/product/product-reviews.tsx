"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, ThumbsUp, ThumbsDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ProductReviewsProps {
  productId: string;
}

const reviews = [
  {
    id: "1",
    user: "Sarah Johnson",
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100",
    rating: 5,
    date: "2024-01-15",
    title: "Excellent quality!",
    content:
      "This product exceeded my expectations. The build quality is fantastic and it works perfectly. Highly recommended!",
    helpful: 12,
    verified: true,
  },
  {
    id: "2",
    user: "Mike Chen",
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100",
    rating: 4,
    date: "2024-01-10",
    title: "Good value for money",
    content:
      "Great product overall. Minor issues with packaging but the product itself is solid.",
    helpful: 8,
    verified: true,
  },
  {
    id: "3",
    user: "Emily Davis",
    avatar:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100",
    rating: 5,
    date: "2024-01-05",
    title: "Perfect!",
    content:
      "Exactly what I was looking for. Fast shipping and excellent customer service.",
    helpful: 15,
    verified: false,
  },
];

const ratingDistribution = [
  { stars: 5, count: 45, percentage: 60 },
  { stars: 4, count: 20, percentage: 27 },
  { stars: 3, count: 8, percentage: 11 },
  { stars: 2, count: 1, percentage: 1 },
  { stars: 1, count: 1, percentage: 1 },
];

export function ProductReviews({}: ProductReviewsProps) {
  const [sortBy, setSortBy] = useState("newest");
  // const [filterRating, setFilterRating] = useState(0);

  const averageRating = 4.6;
  const totalReviews = 75;

  return (
    <div className="space-y-8">
      {/* Review Summary */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">{averageRating}</div>
          <div className="flex items-center justify-center space-x-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.floor(averageRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-muted-foreground">
            Based on {totalReviews} reviews
          </p>
        </div>

        <div className="space-y-2">
          {ratingDistribution.map((rating) => (
            <div key={rating.stars} className="flex items-center space-x-3">
              <span className="text-sm w-8">{rating.stars}★</span>
              <Progress value={rating.percentage} className="flex-1" />
              <span className="text-sm text-muted-foreground w-8">
                {rating.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-md px-3 py-1 text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
        <Button>Write a Review</Button>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            className="border rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-start space-x-4">
              <Avatar>
                <AvatarImage src={review.avatar} />
                <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-medium">{review.user}</h4>
                  {review.verified && (
                    <Badge variant="secondary" className="text-xs">
                      Verified Purchase
                    </Badge>
                  )}
                </div>

                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>

                <h5 className="font-medium mb-2">{review.title}</h5>
                <p className="text-muted-foreground mb-4">{review.content}</p>

                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Helpful ({review.helpful})
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    Not Helpful
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline">Load More Reviews</Button>
      </div>
    </div>
  );
}
