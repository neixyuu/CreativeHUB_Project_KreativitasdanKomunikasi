import { Link } from '@inertiajs/react'
import { ShoppingBag, DollarSign, Clock, CheckCircle, ArrowRight, TrendingUp, Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const stats = [
  {
    label: "Total Orders",
    value: "156",
    icon: ShoppingBag,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    trend: "+12%",
    trendUp: true
  },
  {
    label: "Total Earnings",
    value: "Rp 45,2M",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-100",
    trend: "+18%",
    trendUp: true
  },
  {
    label: "Pending Orders",
    value: "8",
    icon: Clock,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    trend: "-2",
    trendUp: false
  },
  {
    label: "Completed",
    value: "148",
    icon: CheckCircle,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    trend: "+5",
    trendUp: true
  }
]

const recentOrders = [
  {
    id: 1,
    title: "Logo Design for Coffee Shop",
    client: {
      name: "John Doe",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    price: 500000,
    status: "In Progress",
    deadline: "Apr 15, 2026"
  },
  {
    id: 2,
    title: "Brand Identity Package",
    client: {
      name: "Jane Smith",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
    },
    price: 1500000,
    status: "Review",
    deadline: "Apr 18, 2026"
  },
  {
    id: 3,
    title: "Social Media Kit",
    client: {
      name: "Mike Johnson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    price: 350000,
    status: "Pending",
    deadline: "Apr 20, 2026"
  }
]

const recentReviews = [
  {
    id: 1,
    client: "John Doe",
    rating: 5,
    comment: "Amazing work! Sarah delivered exactly what I envisioned. Highly recommended!",
    date: "2 days ago"
  },
  {
    id: 2,
    client: "Alice Chen",
    rating: 5,
    comment: "Professional and creative. Will definitely work with her again!",
    date: "5 days ago"
  }
]

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

export default function CreatorDashboardPage() {
  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">Creator Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Sarah! Here&apos;s your business overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`h-12 w-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-500'}`}>
                  <TrendingUp className={`h-3 w-3 ${!stat.trendUp && 'rotate-180'}`} />
                  {stat.trend}
                </div>
              </div>
              <p className="text-2xl lg:text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your latest commission requests</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/creator/orders">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={order.client.avatar} alt={order.client.name} />
                  <AvatarFallback>{order.client.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{order.title}</h4>
                  <p className="text-sm text-muted-foreground">{order.client.name}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === "Review" 
                        ? "bg-yellow-100 text-yellow-700" 
                        : order.status === "Pending"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {order.status}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Due: {order.deadline}
                    </span>
                  </div>
                </div>
                <p className="font-semibold text-primary text-sm">
                  {formatPrice(order.price)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Reviews</CardTitle>
              <CardDescription>What clients say about you</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/creator/reviews">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {recentReviews.map((review) => (
              <div key={review.id} className="pb-6 border-b border-border last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{review.client}</h4>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                <p className="text-xs text-muted-foreground">{review.date}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>This Month Performance</CardTitle>
          <CardDescription>Your performance summary for April 2026</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-primary/5">
              <p className="text-3xl font-bold text-primary">12</p>
              <p className="text-sm text-muted-foreground">Orders Completed</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/5">
              <p className="text-3xl font-bold text-secondary">Rp 8.5M</p>
              <p className="text-sm text-muted-foreground">Revenue Earned</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-yellow-500/10">
              <p className="text-3xl font-bold text-yellow-600">4.9</p>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
