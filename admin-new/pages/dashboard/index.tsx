// import { useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import OrdersChart from "@/components/dashboard/charts/OrdersChart";
import RevenueChart from "@/components/dashboard/charts/RevenueChart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Bell,
  Clock,
  Eye,
  Package,
  Search,
  ShoppingCart,
  Users,
  Wallet,
} from "lucide-react";
import { GetServerSideProps } from "next";
// import { formatCurrency } from "@/lib/utils";

// Animation configuration
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const Dashboard = ({ name }: { name: string }) => {
  const stats = [
    {
      title: "Total Revenue",
      value: "$42,835",
      trend: "+12.5%",
      icon: Wallet,
      color: "gradient-teal",
    },
    {
      title: "Orders",
      value: "1,462",
      trend: "+5.2%",
      icon: ShoppingCart,
      color: "gradient-blue",
    },
    {
      title: "Products",
      value: "346",
      trend: "+3.1%",
      icon: Package,
      color: "gradient-purple",
    },
    // {
    //   title: "Active Users",
    //   value: "2,317",
    //   trend: "+8.4%",
    //   icon: Users,
    //   color: "gradient-amber",
    // },
  ];

  const activities = [
    {
      type: "New Order",
      description: "John Doe purchased Wireless Headphones",
      time: "2 minutes ago",
      icon: ShoppingCart,
    },
    {
      type: "Refund Request",
      description: "Sarah Smith requested a refund for Smart Watch",
      time: "45 minutes ago",
      icon: Wallet,
    },
    {
      type: "Low Stock",
      description: "Gaming Mouse is running low on stock (3 remaining)",
      time: "1 hour ago",
      icon: Package,
    },
    {
      type: "New User",
      description: "Michael Brown created an account",
      time: "3 hours ago",
      icon: Users,
    },
  ];

  return (
    <div className="flex min-h-screen">
      <Head>
        <title>Dashboard</title>
      </Head>
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="border-b border-white/10 bg-card/30 backdrop-blur-lg sticky top-0 z-10">
          <div className="h-16 px-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <div className="flex items-center gap-4">
              <Search />
              <Input className="rounded-md px-4 py-2 bg-background border border-border text-sm w-72 shadow-sm" />
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell size={18} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-[10px] flex items-center justify-center">
                  3
                </span>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <div className="flex flex-col gap-8 max-w-7xl mx-auto">
            {/* Welcome Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-between items-center flex-wrap gap-4"
            >
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  Welcome back, <span className="text-gradient">{name}</span>
                </h2>
                <p className="text-muted-foreground">
                  Here&apos;s what&apos;s happening with your store today
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="gap-2">
                  <Eye size={14} /> Live View
                </Button>
                <Button
                  size="sm"
                  className="gap-2 gradient-teal text-primary-foreground"
                >
                  <Activity size={14} /> Analytics
                </Button>
              </div>
            </motion.section>

            {/* Stats Overview */}
            <motion.section
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {stats.map((stat, index) => (
                <motion.div key={index} variants={item}>
                  <Card
                    className={`${stat.color} card-hover overflow-hidden relative`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-sm font-medium text-white">
                          {stat.title}
                        </CardTitle>
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                          <stat.icon className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline justify-between">
                        <div className="text-2xl font-bold text-white">
                          {stat.value}
                        </div>
                        <div className="flex items-center text-xs text-white">
                          <span>{stat.trend}</span>
                          <ArrowUpRight className="ml-1 h-3 w-3" />
                        </div>
                      </div>
                    </CardContent>
                    {/* Decorative elements */}
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/10"></div>
                    <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-white/10"></div>
                  </Card>
                </motion.div>
              ))}
            </motion.section>

            {/* Charts Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="dashboard-grid-2 gap-6"
            >
              <RevenueChart />
              <OrdersChart />
            </motion.section>

            {/* Recent Activity */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="glass-effect">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Clock size={18} className="text-primary" />
                        Recent Activity
                      </CardTitle>
                      <CardDescription>
                        Latest events from your store
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <BarChart3 size={14} className="mr-2" />
                      Reports
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {activities.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                        className="flex items-start justify-between border-b border-white/10 pb-4 last:border-0"
                      >
                        <div className="flex gap-3">
                          <div className="mt-0.5 p-2 rounded-full bg-card border border-white/10">
                            <activity.icon size={14} className="text-primary" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">
                              {activity.type}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {activity.description}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {activity.time}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center border-t border-white/10">
                  <Button
                    variant="ghost"
                    className="w-full text-sm text-primary"
                  >
                    View All Activity
                  </Button>
                </CardFooter>
              </Card>
            </motion.section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

import jwt from "jsonwebtoken";
import Head from "next/head";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookie = req.cookies["token"];
  const token = cookie ? cookie : null;
  let name: string | null = null;
  const decoded = token
    ? jwt.verify(token, process.env.JWT_SECRET as string)
    : null;
  if (decoded && typeof decoded === "object" && "name" in decoded) {
    name = (decoded as { name?: string }).name ?? null;
  }
  if (!decoded) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      name,
    },
  };
};
