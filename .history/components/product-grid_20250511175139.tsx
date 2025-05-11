"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ExternalLink } from "lucide-react"
import type { Product } from "@/types/product"

// Nuevo: función para transformar un raindrop en Product
function raindropToProduct(raindrop: any): Product {
  return {
    id: String(raindrop._id),
    title: raindrop.title || raindrop.link,
    description: raindrop.excerpt || "",
    image: raindrop.cover || "/placeholder.svg",
    tags: raindrop.tags || [],
    isPaid: false, // No hay info de pago en Raindrop
    url: raindrop.link,
  }
}

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [accessToken, setAccessToken] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (!accessToken) return
    const loadProducts = async () => {
      setLoading(true)
      setError("")
      try {
        const res = await fetch("/api/raindrop/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        if (!res.ok) throw new Error("No se pudieron obtener los marcadores")
        const data = await res.json()
        // data.items es el array de marcadores en la respuesta de Raindrop
        setProducts((data.items || []).map(raindropToProduct))
      } catch (err: any) {
        setError(err.message || "Error desconocido")
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [accessToken])

  if (!accessToken) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white border rounded shadow">
        <h2 className="text-lg font-bold mb-2">Introduce tu Access Token de Raindrop.io</h2>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded mb-2"
          placeholder="Access Token"
          value={accessToken}
          onChange={e => setAccessToken(e.target.value)}
        />
        <p className="text-xs text-gray-500 mb-2">Puedes obtenerlo tras autenticarte con OAuth2 o desde la web de Raindrop.io.</p>
      </div>
    )
  }

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

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>
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
