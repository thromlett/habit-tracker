"use client";

import React, { ReactNode, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";

// define your fetchers
const fetchHabits = () => fetch("/api/habit").then((r) => r.json());
const fetchLogs = () => fetch("/api/habit/log").then((r) => r.json());

export function Providers({ children }: { children: ReactNode }) {
  // We use a lazy initializer so we only ever create one client per app load.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache(),
        mutationCache: new MutationCache(),
        defaultOptions: {
          queries: {
            staleTime: Infinity,
          },
        },
      })
  );

  // Prefetch habits & logs on first render
  React.useEffect(() => {
    queryClient.prefetchQuery({ queryKey: ["habits"], queryFn: fetchHabits });
    queryClient.prefetchQuery({ queryKey: ["logs"], queryFn: fetchLogs });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
