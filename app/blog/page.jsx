import { redirect } from "next/navigation";

export default function BlogIndex() {
  redirect("/v2#blog");
}
