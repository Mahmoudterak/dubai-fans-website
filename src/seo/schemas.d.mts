/** Type declarations for schemas.mjs — the shared JSON-LD source of truth. */
export declare const SEO_BASE: string;
export declare const SEO_SITE: string;

export declare const contactPageSchema: Record<string, unknown>;
export declare const softwareApplicationSchema: Record<string, unknown>;
export declare const aiBusinessOsFaqSchema: Record<string, unknown>;
export declare const toolsFaqSchema: Record<string, unknown>;
export declare const serviceSchemas: Record<string, Record<string, unknown>>;

export declare function buildBlogPostingSchema(post: {
  id: string | number;
  title: string;
  excerpt: string;
  image?: string | null;
  dateISO: string;
  category: string;
}): Record<string, unknown>;

export declare function extractFaqPairs(
  content: string,
): { question: string; answer: string }[];

export declare function buildBlogBreadcrumbSchema(post: {
  id: string | number;
  title: string;
}): Record<string, unknown>;

export declare function buildBlogPostSchemas(post: {
  id: string | number;
  title: string;
  excerpt: string;
  image?: string | null;
  dateISO: string;
  category: string;
  content?: string;
}): Record<string, unknown>[];
