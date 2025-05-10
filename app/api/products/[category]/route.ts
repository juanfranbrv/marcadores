import { NextResponse } from "next/server"
import type { Product } from "@/types/product"

export async function GET(request: Request, { params }: { params: { category: string } }) {
  try {
    const category = params.category

    // In a real application, you would query your database based on the category
    // This is just a placeholder implementation
    const allProducts: Product[] = [
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
      // Add more products
    ]

    // Filter products by category (this is just an example)
    let filteredProducts = allProducts

    if (category !== "all") {
      // This is a simplified example - in a real app, you'd have proper category mapping
      filteredProducts = allProducts.filter((product) => {
        // Simple matching logic - would be more sophisticated in a real app
        if (category === "ai" && product.tags.some((tag) => tag.toLowerCase().includes("ai"))) {
          return true
        }
        // Add more category filtering logic as needed
        return false
      })
    }

    return NextResponse.json(filteredProducts)
  } catch (error) {
    console.error(`Error fetching products for category ${params.category}:`, error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
