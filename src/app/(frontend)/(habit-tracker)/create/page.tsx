import React from "react";
import { redirect } from "next/navigation"; // *new
import { getServerSession } from "next-auth/next"; // *new
import CreatePageClient from "@/components/pages/HabitCreate"; // *new

export default async function CreatePage() {
  const session = await getServerSession(); // *new
  if (!session) redirect("/api/auth/signin"); // *new

  return <CreatePageClient />;
}
