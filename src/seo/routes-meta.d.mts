export interface RouteMeta {
  path: string;
  title: string;
  description: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
}

export declare const DEFAULT_OG_IMAGE: string;
export declare const ROUTES_META: RouteMeta[];
export declare function getRouteMeta(path: string): RouteMeta;
