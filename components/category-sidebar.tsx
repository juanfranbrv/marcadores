"use client"

import { useState } from "react"
import { Zap, Code, Palette, BarChart2, Briefcase, DollarSign, Brain, Share2, Compass, Hash } from "lucide-react"
import { cn } from "@/lib/utils"

const categories = [
  { id: "all", name: "All", icon: <Hash className="h-4 w-4" /> },
  { id: "productivity", name: "Productivity", icon: <Zap className="h-4 w-4" /> },
  { id: "development", name: "Development", icon: <Code className="h-4 w-4" /> },
  { id: "design", name: "Design", icon: <Palette className="h-4 w-4" /> },
  { id: "marketing", name: "Marketing", icon: <BarChart2 className="h-4 w-4" /> },
  { id: "business", name: "Business", icon: <Briefcase className="h-4 w-4" /> },
  { id: "finance", name: "Finance", icon: <DollarSign className="h-4 w-4" /> },
  { id: "ai", name: "AI", icon: <Brain className="h-4 w-4" /> },
  { id: "social-media", name: "Social Media", icon: <Share2 className="h-4 w-4" /> },
  { id: "lifestyle", name: "Lifestyle", icon: <Compass className="h-4 w-4" /> },
]

const tags = [
  "All",
  "3D",
  "AI Prompting",
  "Accounting",
  "Activity Tracking",
  "Advertising",
  "Affiliation",
  "Analytics",
  "Animation",
  "Art",
  "Audit",
  "Automation",
  "Avatar Generator",
  "Background",
]

export default function CategorySidebar() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [activeTag, setActiveTag] = useState("All")

  return (
    <aside className="w-64 border-r bg-gray-50 p-4 hidden md:block">
      <div className="space-y-6">
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">PRODUCT CATEGORIES</h3>
          <div className="space-y-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "flex items-center gap-2 w-full px-3 py-2 text-sm font-medium rounded-md",
                  activeCategory === category.id ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-200",
                )}
              >
                {category.icon}
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">#TAGS</h3>
          <div className="space-y-1">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={cn(
                  "flex items-center gap-1 w-full px-3 py-2 text-sm font-medium rounded-md",
                  activeTag === tag ? "bg-white border shadow-sm" : "text-gray-700 hover:bg-gray-200",
                )}
              >
                <span className="text-gray-400">#</span>
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
