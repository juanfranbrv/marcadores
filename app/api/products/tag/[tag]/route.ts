import { NextResponse } from "next/server"
import type { Product } from "@/types/product"

export async function GET(request: Request, { params }: { params: { tag: string } }) {
  try {
    const tag = params.tag

    // In a real application, you would query your database based on the tag
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

    // Filter products by tag
    const filteredProducts =
      tag.toLowerCase() === "all"
        ? allProducts
        : allProducts.filter((product) => product.tags.some((t) => t.toLowerCase() === tag.toLowerCase()))

    return NextResponse.json(filteredProducts)
  } catch (error) {
    console.error(`Error fetching products for tag ${params.tag}:`, error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
