"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ExternalLink } from "lucide-react"
import type { Product } from "@/types/product"

// This would be replaced with actual data fetching from your database
const fetchProducts = async (): Promise<Product[]> => {
  // Simulate API call
  return [
    {
      id: "1",
      title: "CleanSnap",
      description:
        "CleanSnap is a free AI tool that quickly transforms screenshots into watermark-free, professional images for presentations and documentation.",
      image: "/placeholder.svg?height=300&width=400",
      tags: ["Screenshot", "Image Generator"],
      isPaid: false,
      url: "https://example.com/cleansnap",
    },
    {
      id: "2",
      title: "AI Directories",
      description:
        "We can help you launch your AI product to 100+ directories. Increase your domain authority and secure valuable backlinks.",
      image: "/placeholder.svg?height=300&width=400",
      tags: ["SEO"],
      isPaid: true,
      url: "https://example.com/ai-directories",
    },
    {
      id: "3",
      title: "RingTheBell",
      description:
        "Discover RingTheBell, the ultimate free and simple kanban board solution to manage all your tasks and boost productivity.",
      image: "/placeholder.svg?height=300&width=400",
      tags: ["Project Management", "Task Management", "Kanban Board"],
      isPaid: false,
      url: "https://example.com/ringthebell",
    },
    {
      id: "4",
      title: "Card Scanner",
      description:
        "Card Scanner is your one-stop solution for all your OCR needs. Whether it's extracting text from printed documents or digitizing business cards.",
      image: "/placeholder.svg?height=300&width=400",
      tags: ["PDF", "Text Generator", "OCR", "Automation", "Excel"],
      isPaid: false,
      url: "https://example.com/card-scanner",
    },
    {
      id: "5",
      title: "ReviewLab",
      description:
        "Submit your projects and get helpful feedback. Enhance your websites, mock-ups, and prototypes, and earn credits by reviewing others.",
      image: "/placeholder.svg?height=300&width=400",
      tags: ["Feedback", "Web Development", "UX Design", "Conversion"],
      isPaid: false,
      url: "https://example.com/reviewlab",
    },
    {
      id: "6",
      title: "Spin the Wheel",
      description:
        "Spin the wheel of fortune to make your decisions easily. Add your entries, customize the wheel, and spin it to quickly make random selections.",
      image: "/placeholder.svg?height=300&width=400",
      tags: ["Gaming", "Fun"],
      isPaid: false,
      url: "https://example.com/spin-the-wheel",
    },
  ]
}

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts()
        setProducts(data)
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border p-4 h-80">
            <div className="bg-gray-200 h-40 rounded-md mb-4"></div>
            <div className="bg-gray-200 h-6 rounded-md w-3/4 mb-2"></div>
            <div className="bg-gray-200 h-4 rounded-md mb-2"></div>
            <div className="bg-gray-200 h-4 rounded-md w-5/6 mb-4"></div>
            <div className="flex gap-2">
              <div className="bg-gray-200 h-6 rounded-md w-20"></div>
              <div className="bg-gray-200 h-6 rounded-md w-20"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-lg border overflow-hidden">
          <div className="relative h-48 overflow-hidden">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              fill
              className="object-cover"
              priority={product.id === "1"}
            />
          </div>

          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{product.description}</p>

            <div className="flex flex-wrap gap-1 mb-4">
              {product.tags.map((tag) => (
                <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-600">
                  #{tag.replace(/\s+/g, "")}
                </span>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                {product.isPaid ? (
                  <span className="text-sm font-medium">Paid</span>
                ) : (
                  <span className="text-sm font-medium">Free</span>
                )}
              </div>

              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 flex items-center gap-1 text-sm"
              >
                Visit <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
