/**
 * React Query hooks for fetching blog data from the API server.
 * The API server is reachable at /api (Replit path-based routing).
 */
import { useQuery } from "@tanstack/react-query";

export interface BlogPost {
  id: string;
  category: string;
  image: string;
  title: string;
  excerpt: string;
  date: string;
  dateISO: string;
  readTime: string;
  content: string;
  createdAt: string;
}

async function fetchPosts(): Promise<BlogPost[]> {
  const res = await fetch("/api/blog/posts");
  if (!res.ok) throw new Error("فشل في جلب المقالات");
  const data = (await res.json()) as { posts: BlogPost[] };
  return data.posts;
}

async function fetchPost(id: string): Promise<BlogPost> {
  const res = await fetch(`/api/blog/posts/${encodeURIComponent(id)}`);
  if (res.status === 404) throw new Error("المقال غير موجود");
  if (!res.ok) throw new Error("فشل في جلب المقال");
  const data = (await res.json()) as { post: BlogPost };
  return data.post;
}

export function useBlogPosts() {
  return useQuery<BlogPost[], Error>({
    queryKey: ["blog", "posts"],
    queryFn: fetchPosts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useBlogPost(id: string | undefined) {
  return useQuery<BlogPost, Error>({
    queryKey: ["blog", "posts", id],
    queryFn: () => fetchPost(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
