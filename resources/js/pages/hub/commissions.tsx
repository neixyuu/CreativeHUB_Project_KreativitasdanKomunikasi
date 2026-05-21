
import { useState } from "react"
import { Link } from '@inertiajs/react'
import { Plus, Search, Clock, CheckCircle, AlertCircle, Eye, MessageSquare } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const commissions = [
  {
    id: 1,
    title: "Logo Design for Coffee Shop",
    creator: {
      name: "Sarah Wijaya",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
      specialty: "Graphic Designer"
    },
    status: "in-progress",
    price: 500000,
    deadline: "Apr 15, 2026",
    progress: 60,
    createdAt: "Apr 1, 2026"
  },
  {
    id: 2,
    title: "Character Illustration",
    creator: {
      name: "Andi Pratama",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      specialty: "Illustrator"
    },
    status: "review",
    price: 800000,
    deadline: "Apr 18, 2026",
    progress: 90,
    createdAt: "Mar 28, 2026"
  },
  {
    id: 3,
    title: "Mobile App UI Design",
    creator: {
      name: "Maya Putri",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      specialty: "UI/UX Designer"
    },
    status: "in-progress",
    price: 1500000,
    deadline: "Apr 25, 2026",
    progress: 30,
    createdAt: "Apr 5, 2026"
  },
  {
    id: 4,
    title: "Brand Identity Package",
    creator: {
      name: "Lisa Anggraini",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      specialty: "Graphic Designer"
    },
    status: "completed",
    price: 2500000,
    deadline: "Mar 20, 2026",
    progress: 100,
    createdAt: "Feb 25, 2026"
  },
  {
    id: 5,
    title: "YouTube Intro Animation",
    creator: {
      name: "Rizky Hakim",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      specialty: "Video Editor"
    },
    status: "completed",
    price: 350000,
    deadline: "Mar 10, 2026",
    progress: 100,
    createdAt: "Feb 28, 2026"
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

function getStatusBadge(status: string) {
  switch (status) {
    case "in-progress":
      return {
        label: "In Progress",
        className: "bg-blue-100 text-blue-700",
        icon: Clock
      }
    case "review":
      return {
        label: "Under Review",
        className: "bg-yellow-100 text-yellow-700",
        icon: AlertCircle
      }
    case "completed":
      return {
        label: "Completed",
        className: "bg-green-100 text-green-700",
        icon: CheckCircle
      }
    default:
      return {
        label: "Pending",
        className: "bg-gray-100 text-gray-700",
        icon: Clock
      }
  }
}

export default function CommissionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredCommissions = commissions.filter(commission => {
    const matchesSearch = commission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          commission.creator.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === "all" || commission.status === activeTab
    return matchesSearch && matchesTab
  })

  const activeCount = commissions.filter(c => c.status === "in-progress" || c.status === "review").length
  const completedCount = commissions.filter(c => c.status === "completed").length

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">My Commissions</h1>
          <p className="text-muted-foreground">Track and manage your commission projects</p>
        </div>
        <Button asChild className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90">
          <Link href="/commission/create">
            <Plus className="h-4 w-4" />
            New Commission
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{commissions.length}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{activeCount}</p>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{completedCount}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search commissions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="review">Review</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredCommissions.length > 0 ? (
            filteredCommissions.map((commission) => {
              const statusBadge = getStatusBadge(commission.status)
              return (
                <Card key={commission.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Creator Info */}
                      <div className="flex items-center gap-4 flex-1">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={commission.creator.avatar} alt={commission.creator.name} />
                          <AvatarFallback>{commission.creator.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{commission.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {commission.creator.name} • {commission.creator.specialty}
                          </p>
                        </div>
                      </div>

                      {/* Status & Progress */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-8">
                        <div className="text-sm">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge.className}`}>
                            <statusBadge.icon className="h-3 w-3" />
                            {statusBadge.label}
                          </span>
                        </div>

                        {commission.status !== "completed" && (
                          <div className="w-full sm:w-32">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">{commission.progress}%</span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                                style={{ width: `${commission.progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <div className="text-right">
                          <p className="font-semibold text-primary">{formatPrice(commission.price)}</p>
                          <p className="text-xs text-muted-foreground">Due: {commission.deadline}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/commissions/${commission.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/messages`}>
                              <MessageSquare className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No commissions found</h3>
              <p className="text-muted-foreground mb-4">
                {activeTab === "all" 
                  ? "Start your first commission to see it here"
                  : `No ${activeTab.replace("-", " ")} commissions`
                }
              </p>
              <Button asChild className="bg-gradient-to-r from-primary to-secondary">
                <Link href="/commission/create">Create Commission</Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
