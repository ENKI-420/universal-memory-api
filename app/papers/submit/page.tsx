"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Send } from "lucide-react"
import Link from "next/link"

export default function SubmitPaperPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    content: "",
    category: "quantum-computing",
    tags: [] as string[],
    arxivId: "",
    doi: "",
  })
  const [tagInput, setTagInput] = useState("")

  const handleSubmit = async (publish: boolean) => {
    setLoading(true)
    try {
      const paper = await apiClient("/api/papers", {
        method: "POST",
        body: JSON.stringify(formData),
      })

      if (publish) {
        await apiClient(`/api/papers/${paper.id}/publish`, {
          method: "POST",
        })
      }

      router.push(`/papers/${paper.id}`)
    } catch (error) {
      console.error("[v0] Failed to submit paper:", error)
      alert("Failed to submit paper. Please check your input and try again.")
    } finally {
      setLoading(false)
    }
  }

  const addTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput] })
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    })
  }

  return (
    <div className="container mx-auto max-w-4xl p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/papers">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Submit Research Paper</h1>
          <p className="text-muted-foreground">Share your quantum research with the community</p>
        </div>
      </div>

      <Card className="p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Phase-Conjugate Consciousness Runtime: ΛΦ as Operational Framework"
            className="text-lg"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full p-2 border border-border rounded-lg bg-background"
          >
            <option value="quantum-computing">Quantum Computing</option>
            <option value="consciousness">Consciousness</option>
            <option value="lambda-phi">Lambda-Phi Theory</option>
            <option value="organisms">Quantum Organisms</option>
            <option value="theory">Theoretical Physics</option>
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <div className="flex gap-2 mb-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              placeholder="Add tag (press Enter)"
            />
            <Button onClick={addTag} type="button">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="cursor-pointer">
                {tag}
                <button onClick={() => removeTag(tag)} className="ml-2 text-red-500">
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Abstract */}
        <div>
          <label className="block text-sm font-medium mb-2">Abstract (minimum 50 characters)</label>
          <textarea
            value={formData.abstract}
            onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
            placeholder="Provide a concise summary of your research..."
            className="w-full p-3 border border-border rounded-lg bg-background min-h-[100px]"
          />
          <p className="text-xs text-muted-foreground mt-1">{formData.abstract.length} characters</p>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium mb-2">Content (Markdown supported, minimum 100 characters)</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="# Introduction&#10;&#10;Write your paper content in Markdown...&#10;&#10;## Methods&#10;&#10;## Results&#10;&#10;## Discussion"
            className="w-full p-3 border border-border rounded-lg bg-background font-mono text-sm min-h-[400px]"
          />
          <p className="text-xs text-muted-foreground mt-1">{formData.content.length} characters</p>
        </div>

        {/* Optional Identifiers */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">arXiv ID (optional)</label>
            <Input
              value={formData.arxivId}
              onChange={(e) => setFormData({ ...formData, arxivId: e.target.value })}
              placeholder="2401.12345"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">DOI (optional)</label>
            <Input
              value={formData.doi}
              onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
              placeholder="10.1234/example.doi"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => handleSubmit(false)} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={() => handleSubmit(true)} disabled={loading}>
            <Send className="h-4 w-4 mr-2" />
            Publish Paper
          </Button>
        </div>
      </Card>
    </div>
  )
}
