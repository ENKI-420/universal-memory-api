"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import Link from "next/link"

export default function PapersPage() {
  const [papers, setPapers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({
    category: "",
    status: "published",
    search: "",
  })

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const params = new URLSearchParams()
        if (filter.category) params.set("category", filter.category)
        if (filter.status) params.set("status", filter.status)

        const response = await apiClient(`/api/papers?${params}`)
        setPapers(response.papers)
      } catch (error) {
        console.error("[v0] Failed to fetch papers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPapers()
  }, [filter])

  const filteredPapers = papers.filter((paper) =>
    filter.search
      ? paper.title.toLowerCase().includes(filter.search.toLowerCase()) ||
        paper.abstract.toLowerCase().includes(filter.search.toLowerCase())
      : true,
  )

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Research Papers</h1>
          <p className="text-muted-foreground">Explore quantum research from the community</p>
        </div>
        <Link href="/papers/submit">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Submit Paper
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search papers..."
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              className="pl-10"
            />
          </div>
          <select
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
            className="p-2 border border-border rounded-lg bg-background"
          >
            <option value="">All Categories</option>
            <option value="quantum-computing">Quantum Computing</option>
            <option value="consciousness">Consciousness</option>
            <option value="lambda-phi">Lambda-Phi</option>
            <option value="organisms">Organisms</option>
          </select>
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="p-2 border border-border rounded-lg bg-background"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="under-review">Under Review</option>
          </select>
        </div>
      </Card>

      {/* Papers List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-6 bg-secondary rounded w-2/3 mb-4" />
              <div className="h-4 bg-secondary rounded w-full mb-2" />
              <div className="h-4 bg-secondary rounded w-full" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPapers.map((paper) => (
            <Link key={paper.id} href={`/papers/${paper.id}`}>
              <Card className="p-6 hover:border-cyan-500/50 transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{paper.category}</Badge>
                    {paper.tags.slice(0, 3).map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">{paper.viewsCount} views</div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{paper.title}</h3>
                <p className="text-muted-foreground line-clamp-2">{paper.abstract}</p>
                <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                  <span>{new Date(paper.createdAt).toLocaleDateString()}</span>
                  <span>{paper.citationsCount} citations</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
