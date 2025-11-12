"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Heart, Bookmark, Share2 } from "lucide-react"
import Link from "next/link"

export default function PaperDetailPage() {
  const params = useParams()
  const [paper, setPaper] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        const response = await apiClient(`/api/papers/${params.id}`)
        setPaper(response)
      } catch (error) {
        console.error("[v0] Failed to fetch paper:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPaper()
  }, [params.id])

  const handleLike = async () => {
    try {
      await apiClient(`/api/social/like`, {
        method: "POST",
        body: JSON.stringify({
          targetType: "paper",
          targetId: params.id,
        }),
      })
      setLiked(!liked)
    } catch (error) {
      console.error("[v0] Failed to like paper:", error)
    }
  }

  const handleBookmark = async () => {
    try {
      await apiClient(`/api/social/bookmark`, {
        method: "POST",
        body: JSON.stringify({
          targetType: "paper",
          targetId: params.id,
        }),
      })
      setBookmarked(!bookmarked)
    } catch (error) {
      console.error("[v0] Failed to bookmark paper:", error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-secondary rounded w-2/3" />
          <div className="h-32 bg-secondary rounded" />
        </div>
      </div>
    )
  }

  if (!paper) {
    return (
      <div className="container mx-auto max-w-4xl p-8">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Paper not found</p>
        </Card>
      </div>
    )
  }

  const statusColor = paper.status === "published" ? "green" : paper.status === "under-review" ? "yellow" : "gray"

  return (
    <div className="container mx-auto max-w-4xl p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link href="/papers">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={liked ? "default" : "outline"} size="icon" onClick={handleLike}>
            <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
          </Button>
          <Button variant={bookmarked ? "default" : "outline"} size="icon" onClick={handleBookmark}>
            <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Paper Metadata */}
      <Card className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className={`bg-${statusColor}-500`}>{paper.status}</Badge>
              <Badge variant="outline">{paper.category}</Badge>
            </div>
            <h1 className="text-3xl font-bold">{paper.title}</h1>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {paper.tags.map((tag: string) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="text-sm text-muted-foreground space-y-1">
          <p>Views: {paper.viewsCount}</p>
          <p>Citations: {paper.citationsCount}</p>
          {paper.publishedAt && <p>Published: {new Date(paper.publishedAt).toLocaleDateString()}</p>}
          {paper.arxivId && <p>arXiv: {paper.arxivId}</p>}
          {paper.doi && <p>DOI: {paper.doi}</p>}
        </div>
      </Card>

      {/* Abstract */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Abstract</h2>
        <p className="text-muted-foreground leading-relaxed">{paper.abstract}</p>
      </Card>

      {/* Content */}
      <Card className="p-6">
        <div className="prose prose-invert max-w-none">
          <pre className="whitespace-pre-wrap font-sans">{paper.content}</pre>
        </div>
      </Card>
    </div>
  )
}
