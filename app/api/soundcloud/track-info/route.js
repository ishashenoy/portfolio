const TRACK_URL = "https://soundcloud.com/ishas_14/sets/faves";

export async function GET() {
  try {
    const res = await fetch(
      `https://soundcloud.com/oembed?url=${encodeURIComponent(TRACK_URL)}&format=json`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    return Response.json({
      title: data.title,
      artist: data.author_name,
      artwork: data.thumbnail_url?.replace("-large", "-t500x500") ?? data.thumbnail_url,
    });
  } catch {
    return Response.json(null);
  }
}
