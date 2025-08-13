import React from "react";
import CreateSSR from "./CreateSSR";
import LoadIcon from "@/components/LoadIcon";
import BottomBar from "@/components/BottomBar";

export default async function CreatePage() {
  return (
    <React.Suspense fallback={<LoadIcon />}>
      <CreateSSR />
      <BottomBar />
    </React.Suspense>
  );
}
