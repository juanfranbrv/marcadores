"use client"

import { useState, useEffect } from "react"
import { Zap, Code, Palette, BarChart2, Briefcase, DollarSign, Brain, Share2, Compass, Hash } from "lucide-react"
import { cn } from "@/lib/utils"

export default function CategorySidebar() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [activeTag, setActiveTag] = useState("All")
  const [categories, setCategories] = useState<any[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [accessToken, setAccessToken] = useState("")

  // Obtener el accessToken del localStorage si existe (compartido con ProductGrid)
  useEffect(() => {
    const token = localStorage.getItem("raindrop_access_token") || ""
    setAccessToken(token)
  }, [])

  useEffect(() => {
    if (!accessToken) return
    // Obtener colecciones (categorías)
    fetch("/api/raindrop/collections", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(res => res.json())
      .then(data => {
        setCategories([
          { id: "all", name: "All", icon: null },
          ...data.map((c: any) => ({ id: c._id, name: c.title, icon: null })),
        ])
      })
      .catch(() => setCategories([{ id: "all", name: "All", icon: null }]))
    // Obtener etiquetas
    fetch("/api/raindrop/tags", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(res => res.json())
      .then(data => setTags(["All", ...(data || [])]))
      .catch(() => setTags(["All"]))
  }, [accessToken])

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
                {category.icon ? category.icon : <span className="text-gray-400">#</span>}
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
