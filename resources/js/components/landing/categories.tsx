import { Link } from '@inertiajs/react'
import { Palette, PenTool, Video, Globe, Layout, Brush, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  {
    name: "Graphic Designer",
    description: "Logo, branding, marketing materials",
    icon: Palette,
    color: "from-blue-500 to-indigo-600",
    count: "2,450+"
  },
  {
    name: "Illustrator",
    description: "Digital art, character design, comics",
    icon: PenTool,
    color: "from-purple-500 to-pink-600",
    count: "1,820+"
  },
  {
    name: "Video Editor",
    description: "Video editing, motion graphics",
    icon: Video,
    color: "from-red-500 to-orange-600",
    count: "980+"
  },
  {
    name: "Web Designer",
    description: "Website design, landing pages",
    icon: Globe,
    color: "from-emerald-500 to-teal-600",
    count: "1,350+"
  },
  {
    name: "UI/UX Designer",
    description: "App design, user experience",
    icon: Layout,
    color: "from-cyan-500 to-blue-600",
    count: "1,120+"
  },
  {
    name: "Digital Artist",
    description: "Digital paintings, concept art",
    icon: Brush,
    color: "from-fuchsia-500 to-purple-600",
    count: "2,100+"
  }
]

export function Categories() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explore <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Categories</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Temukan kreator berdasarkan keahlian mereka. Setiap kategori memiliki talenta terbaik yang siap membantu proyekmu.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link href={`/explore?category=${category.name.toLowerCase().replace(/\s+/g, '-')}`} key={category.name}>
              <Card className="group cursor-pointer border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${category.color} shadow-lg`}>
                      <category.icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-primary">
                          {category.count} creators
                        </span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
