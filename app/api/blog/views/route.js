import { NextResponse } from "next/server";
import {
  getAllBlogViewCounts,
  getBlogViewCount,
  incrementBlogView,
} from "@/app/lib/blogViewsStore";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  try {
    if (slug) {
      const count = await getBlogViewCount(slug);
      return NextResponse.json({ count });
    }
    const counts = await getAllBlogViewCounts();
    return NextResponse.json({ counts });
  } catch (e) {
    console.error("blog views GET:", e);
    return NextResponse.json({ error: "failed to read views" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const slug = typeof body?.slug === "string" ? body.slug : "";
    if (!slug) {
      return NextResponse.json({ error: "missing slug" }, { status: 400 });
    }
    const count = await incrementBlogView(slug);
    return NextResponse.json({ count });
  } catch (e) {
    console.error("blog views POST:", e);
    return NextResponse.json({ error: "failed to record view" }, { status: 500 });
  }
}
