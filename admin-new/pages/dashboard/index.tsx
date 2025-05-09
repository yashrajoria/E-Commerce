// import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  LineChart,
  Wallet,
  Package,
  Users,
  ShoppingCart,
  ArrowUpRight,
  Bell,
} from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="border-b border-white/10 bg-card/30 backdrop-blur-lg sticky top-0 z-10">
          <div className="h-16 px-6 flex items-center justify-end">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell size={18} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-[10px] flex items-center justify-center">
                  3
                </span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-white/10 hover:bg-white/10 hover:text-white"
              >
                <Users className="mr-2 h-4 w-4" />
                Account
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <div className="flex flex-col gap-8 max-w-7xl mx-auto">
            {/* Welcome Section */}
            <section>
              <h2 className="text-3xl font-bold mb-2">Welcome back, Admin</h2>
              <p className="text-muted-foreground mb-6">
                {/* Here's what's happening with your store today. */}
              </p>
            </section>

            {/* Stats Overview */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: "Total Revenue",
                  value: "$12,628",
                  icon: Wallet,
                  trend: "+12.5%",
                },
                {
                  title: "Orders",
                  value: "723",
                  icon: ShoppingCart,
                  trend: "+5.2%",
                },
                {
                  title: "Products",
                  value: "346",
                  icon: Package,
                  trend: "+3.1%",
                },
                {
                  title: "Active Users",
                  value: "2,317",
                  icon: Users,
                  trend: "+8.4%",
                },
              ].map((stat, index) => (
                <Card
                  key={index}
                  className="glass-effect overflow-hidden relative"
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </CardTitle>
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline justify-between">
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="flex items-center text-xs text-emerald-500">
                        <span>{stat.trend}</span>
                        <ArrowUpRight className="ml-1 h-3 w-3" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </section>

            {/* Charts Section */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-effect">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Revenue Overview</CardTitle>
                      <CardDescription>
                        Monthly revenue for the current year
                      </CardDescription>
                    </div>
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center border-t border-white/10 p-6">
                  <div className="w-full h-full bg-white/5 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Revenue chart visualization
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Recent Orders</CardTitle>
                      <CardDescription>
                        Last 24 hours sales activity
                      </CardDescription>
                    </div>
                    <LineChart className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center border-t border-white/10 p-6">
                  <div className="w-full h-full bg-white/5 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Orders chart visualization
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Recent Activity */}
            <section>
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest events from your store
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        type: "New Order",
                        description: "John Doe purchased Wireless Headphones",
                        time: "2 minutes ago",
                      },
                      {
                        type: "Refund Request",
                        description:
                          "Sarah Smith requested a refund for Smart Watch",
                        time: "45 minutes ago",
                      },
                      {
                        type: "Low Stock",
                        description:
                          "Gaming Mouse is running low on stock (3 remaining)",
                        time: "1 hour ago",
                      },
                      {
                        type: "New User",
                        description: "Michael Brown created an account",
                        time: "3 hours ago",
                      },
                    ].map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between border-b border-white/10 pb-4 last:border-0"
                      >
                        <div>
                          <h4 className="text-sm font-medium">
                            {activity.type}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {activity.description}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {activity.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center border-t border-white/10">
                  <Button variant="ghost" className="w-full text-sm">
                    View All Activity
                  </Button>
                </CardFooter>
              </Card>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
