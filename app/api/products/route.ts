import { NextResponse } from "next/server"
import type { Product } from "@/types/product"

// This is a placeholder for your actual database connection
// You would replace this with your database logic
export async function GET() {
  try {
    // Example products - in a real app, you would fetch these from your database
    const products: Product[] = [
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
      // Add more products as needed
    ]

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
