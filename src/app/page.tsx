import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session){
    redirect("/api/auth/signin");
  }

  return ( 
    <a href="/test-runner">She h on my ref til I page.tsx now im package.json</a>
  )
}