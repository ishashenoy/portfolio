"use client";

import { useEffect } from "react";
import { markSlugAsRead } from "../lib/blogReadStorage";

export function MarkBlogPostRead({ slug }) {
  useEffect(() => {
    markSlugAsRead(slug);
  }, [slug]);
  return null;
}
