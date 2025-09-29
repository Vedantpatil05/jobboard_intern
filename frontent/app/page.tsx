// app/page.tsx
import { redirect } from "next/navigation";

export default function IndexPage() {
  // 🚀 Always redirect root "/" to profile form
  redirect("/profile");
}
