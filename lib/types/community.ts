// Community and Social Types

export interface Paper {
  id: string
  userId: string
  title: string
  abstract: string
  content: string
  arxivId?: string
  doi?: string
  tags: string[]
  category: string
  status: "draft" | "submitted" | "under-review" | "published" | "rejected"
  citationsCount: number
  viewsCount: number
  downloadsCount: number
  organismId?: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export interface PaperAuthor {
  id: string
  paperId: string
  userId: string
  authorOrder: number
  affiliation?: string
  createdAt: string
}

export interface Team {
  id: string
  name: string
  description?: string
  avatarUrl?: string
  ownerId: string
  isPublic: boolean
  memberCount: number
  createdAt: string
  updatedAt: string
}

export interface TeamMember {
  id: string
  teamId: string
  userId: string
  role: "owner" | "admin" | "member"
  joinedAt: string
}

export interface Discussion {
  id: string
  userId: string
  title: string
  content: string
  category: "general" | "technical" | "papers" | "organisms"
  tags: string[]
  isPinned: boolean
  isLocked: boolean
  viewsCount: number
  repliesCount: number
  paperId?: string
  organismId?: string
  jobId?: string
  createdAt: string
  updatedAt: string
}

export interface DiscussionReply {
  id: string
  discussionId: string
  userId: string
  content: string
  parentReplyId?: string
  createdAt: string
  updatedAt: string
}

export interface Like {
  id: string
  userId: string
  targetType: "paper" | "discussion" | "reply" | "organism" | "job"
  targetId: string
  createdAt: string
}

export interface Bookmark {
  id: string
  userId: string
  targetType: "paper" | "discussion" | "organism" | "job"
  targetId: string
  notes?: string
  createdAt: string
}

export interface UserProfile {
  id: string
  userId: string
  bio?: string
  avatarUrl?: string
  affiliation?: string
  website?: string
  researchInterests: string[]
  orcid?: string
  googleScholarUrl?: string
  twitterHandle?: string
  githubHandle?: string
  location?: string
  followersCount: number
  followingCount: number
  createdAt: string
  updatedAt: string
}

export interface UserFollow {
  id: string
  followerId: string
  followingId: string
  createdAt: string
}

export interface Activity {
  id: string
  userId: string
  activityType: "paper_published" | "organism_created" | "job_completed" | "discussion_created" | "team_created"
  targetType: string
  targetId: string
  metadata: Record<string, any>
  isPublic: boolean
  createdAt: string
}

export interface Notification {
  id: string
  userId: string
  fromUserId?: string
  type: "like" | "comment" | "follow" | "mention" | "paper_citation"
  title: string
  message?: string
  link?: string
  isRead: boolean
  createdAt: string
}
