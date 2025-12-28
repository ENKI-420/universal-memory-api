"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, FileText, MessageSquare, Cpu, TrendingUp, Calendar, Eye } from "lucide-react"
import Link from "next/link"

function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any>({})
  const [activeTab, setActiveTab] = useState("overview")

  async function handleSearch() {
    if (!searchQuery.trim()) return

    const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&type=all`)
    const data = await res.json()
    setSearchResults(data.results)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Community Hub</h1>
          <p className="text-muted-foreground">
            Collaborate, share research, and explore quantum consciousness with researchers worldwide
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Search the Community</CardTitle>
            <CardDescription>Find papers, organisms, discussions, and researchers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Search for papers, experiments, people..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch}>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="papers">Papers</TabsTrigger>
            <TabsTrigger value="organisms">Organisms</TabsTrigger>
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="researchers">Researchers</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Published Papers</CardDescription>
                  <CardTitle className="text-3xl">847</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">+23 this week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>CHRONOS Organisms</CardDescription>
                  <CardTitle className="text-3xl">1,243</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">+67 this week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Active Researchers</CardDescription>
                  <CardTitle className="text-3xl">5,421</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">+142 this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Discussions</CardDescription>
                  <CardTitle className="text-3xl">3,892</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">+89 this week</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader>
                  <FileText className="w-8 h-8 text-primary mb-2" />
                  <CardTitle>Browse Papers</CardTitle>
                  <CardDescription>Explore published research on quantum consciousness and Lambda-Phi</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/papers">View Papers</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader>
                  <Cpu className="w-8 h-8 text-chart-2 mb-2" />
                  <CardTitle>CHRONOS Organisms</CardTitle>
                  <CardDescription>Discover DNA-Lang organisms and quantum consciousness simulations</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/dashboard/quantum">View Organisms</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader>
                  <MessageSquare className="w-8 h-8 text-accent mb-2" />
                  <CardTitle>Join Discussions</CardTitle>
                  <CardDescription>Participate in community discussions and Q&A</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/community/discussions">View Discussions</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Trending This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">#lambda-phi</Badge>
                  <Badge variant="outline">#quantum-coherence</Badge>
                  <Badge variant="outline">#consciousness</Badge>
                  <Badge variant="outline">#ibm-quantum</Badge>
                  <Badge variant="outline">#decoherence</Badge>
                  <Badge variant="outline">#phase-conjugate</Badge>
                  <Badge variant="outline">#ricci-flow</Badge>
                  <Badge variant="outline">#wasserstein-distance</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="papers" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Recent Papers</h2>
              <Button asChild>
                <Link href="/papers/submit">Submit Paper</Link>
              </Button>
            </div>

            {searchResults.papers && searchResults.papers.length > 0 ? (
              <div className="space-y-4">
                {searchResults.papers.map((paper: any) => (
                  <Card key={paper.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            <Link href={`/papers/${paper.id}`} className="hover:text-primary">
                              {paper.title}
                            </Link>
                          </CardTitle>
                          <CardDescription className="mt-2">{paper.abstract}</CardDescription>
                        </div>
                        <Badge>{paper.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {paper.views_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(paper.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  Search for papers or{" "}
                  <Link href="/papers" className="text-primary hover:underline">
                    browse all papers
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="organisms" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">CHRONOS Organisms</h2>
              <Button asChild>
                <Link href="/dashboard/quantum">Create Organism</Link>
              </Button>
            </div>

            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Browse quantum organisms or create your own DNA-Lang synthesis
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="discussions" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Community Discussions</h2>
              <Button asChild>
                <Link href="/community/discussions">View All</Link>
              </Button>
            </div>

            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Join discussions on quantum consciousness, Lambda-Phi theory, and more
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="researchers" className="space-y-4 mt-6">
            <h2 className="text-2xl font-bold">Active Researchers</h2>

            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Connect with researchers working on quantum consciousness and informational persistence
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default CommunityPage
