import { Search, Plus, Award, ChevronDown, Menu, Trash2 } from "lucide-react"
import Link from "next/link"
import ProductGrid from "@/components/product-grid"
import CategorySidebar from "@/components/category-sidebar"

export default function ProductFinder() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b sticky top-0 bg-white z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-indigo-600 text-white p-1 rounded">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <span className="font-bold text-xl">10015</span>
            </Link>
          </div>

          <div className="relative max-w-md w-full mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search Products"
                className="w-full py-2 pl-10 pr-4 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-md hover:bg-gray-100">
              <Plus className="h-4 w-4" />
              <span>Submit</span>
            </button>
            <button className="flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-md hover:bg-gray-100">
              <Award className="h-4 w-4" />
              <span>Get Featured</span>
            </button>
            <button className="flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-md hover:bg-gray-100">
              <span>Extensions</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            <button className="flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-md hover:bg-gray-100">
              <Menu className="h-4 w-4" />
              <span>Menu</span>
            </button>
            <button className="text-amber-500 hover:text-amber-600">
              <Trash2 className="h-5 w-5" />
            </button>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-indigo-700">
              <span>Sign in</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <CategorySidebar />

        {/* Product Finder Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-indigo-100 text-indigo-600 p-2 rounded">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold">
                Product Finder <span className="text-gray-500 text-lg">Beta*</span>
              </h1>
            </div>

            <ProductGrid />
          </div>
        </main>
      </div>
    </div>
  )
}
