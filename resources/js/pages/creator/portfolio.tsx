
import { useState } from "react"
import { Plus, Edit2, Trash2, Image, X, Upload } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const categories = ["Logo Design", "Branding", "Illustration", "Social Media", "Web Design", "UI/UX"]

interface PortfolioItem {
  id: number
  title: string
  description: string
  category: string
  image: string
}

const initialPortfolio: PortfolioItem[] = [
  {
    id: 1,
    title: "Modern Coffee Shop Logo",
    description: "A minimalist logo design for a premium coffee shop brand",
    category: "Logo Design",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    title: "Tech Startup Branding",
    description: "Complete brand identity for an innovative tech startup",
    category: "Branding",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    title: "Fashion Brand Social Media",
    description: "Instagram feed design and story templates for a fashion brand",
    category: "Social Media",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop"
  },
  {
    id: 4,
    title: "E-commerce Website Design",
    description: "Modern and responsive website design for an online store",
    category: "Web Design",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"
  },
  {
    id: 5,
    title: "Mobile Banking App",
    description: "Clean and intuitive UI design for a mobile banking application",
    category: "UI/UX",
    image: "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=400&h=300&fit=crop"
  },
  {
    id: 6,
    title: "Character Illustration",
    description: "Cute mascot character design for a gaming company",
    category: "Illustration",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop"
  }
]

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(initialPortfolio)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null)
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    category: "",
    image: ""
  })

  const handleAddItem = () => {
    if (!newItem.title || !newItem.category) return
    
    const item: PortfolioItem = {
      id: Date.now(),
      title: newItem.title,
      description: newItem.description,
      category: newItem.category,
      image: newItem.image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop"
    }
    
    setPortfolio([...portfolio, item])
    setNewItem({ title: "", description: "", category: "", image: "" })
    setIsAddDialogOpen(false)
  }

  const handleEditItem = () => {
    if (!editingItem) return
    
    setPortfolio(portfolio.map(item => 
      item.id === editingItem.id ? editingItem : item
    ))
    setEditingItem(null)
  }

  const handleDeleteItem = (id: number) => {
    setPortfolio(portfolio.filter(item => item.id !== id))
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">Portfolio</h1>
          <p className="text-muted-foreground">Showcase your best work to attract clients</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90">
              <Plus className="h-4 w-4" />
              Add Work
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Work</DialogTitle>
              <DialogDescription>
                Add a new project to your portfolio
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Project title"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newItem.category}
                  onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Image</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop or click to upload
                  </p>
                  <Button variant="outline" size="sm">
                    Choose File
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddItem} className="bg-gradient-to-r from-primary to-secondary">
                Add Work
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{portfolio.length}</p>
            <p className="text-sm text-muted-foreground">Total Works</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-secondary">
              {new Set(portfolio.map(p => p.category)).size}
            </p>
            <p className="text-sm text-muted-foreground">Categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">1.2K</p>
            <p className="text-sm text-muted-foreground">Total Views</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-secondary">89</p>
            <p className="text-sm text-muted-foreground">Likes</p>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolio.map((item) => (
          <Card key={item.id} className="group overflow-hidden">
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      size="icon" 
                      variant="secondary"
                      onClick={() => setEditingItem(item)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Edit Work</DialogTitle>
                      <DialogDescription>
                        Update your portfolio item
                      </DialogDescription>
                    </DialogHeader>
                    {editingItem && (
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-title">Title</Label>
                          <Input
                            id="edit-title"
                            value={editingItem.title}
                            onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-category">Category</Label>
                          <Select
                            value={editingItem.category}
                            onValueChange={(value) => setEditingItem({ ...editingItem, category: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map(category => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-description">Description</Label>
                          <Textarea
                            id="edit-description"
                            value={editingItem.description}
                            onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                            rows={3}
                          />
                        </div>
                      </div>
                    )}
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setEditingItem(null)}>Cancel</Button>
                      <Button onClick={handleEditItem} className="bg-gradient-to-r from-primary to-secondary">
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="icon" variant="destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this work?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete &quot;{item.title}&quot; from your portfolio.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDeleteItem(item.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <CardContent className="p-4">
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                {item.category}
              </span>
              <h3 className="font-semibold mt-2 truncate">{item.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
            </CardContent>
          </Card>
        ))}

        {/* Add New Card */}
        <Card 
          className="group cursor-pointer border-dashed hover:border-primary/50 transition-colors"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <div className="aspect-[4/3] flex flex-col items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
            <div className="h-16 w-16 rounded-full border-2 border-dashed border-current flex items-center justify-center mb-4">
              <Plus className="h-8 w-8" />
            </div>
            <p className="font-medium">Add New Work</p>
            <p className="text-sm">Click to upload</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
