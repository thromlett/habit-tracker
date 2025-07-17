import React from "react";
import CreateSSR from "./CreateSSR";
import LoadIcon from "@/components/LoadIcon";

export default async function CreatePage() {
  return (
    <React.Suspense fallback={<LoadIcon />}>
      <CreateSSR />;
    </React.Suspense>
  );
}
