import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import CreatePageClient from "@/app/(frontend)/(habit-tracker)/create/HabitCreate";

export default async function CreateSSR() {
  const session = await getServerSession();
  if (!session) redirect("/api/auth/login");

  return <CreatePageClient />;
}
