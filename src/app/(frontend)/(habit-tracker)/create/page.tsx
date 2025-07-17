import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import CreatePageClient from "@/components/pages/HabitCreate";

export default async function CreatePage() {
  const session = await getServerSession();
  if (!session) redirect("/api/auth/login");

  return <CreatePageClient />;
}
