import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/globals.css";
import { trpc } from "./utils/trpc";

function Client() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: Infinity,
            cacheTime: 0,
          },
        },
      })
  );
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:3001/trpc",
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

const Mount = (el: HTMLElement) => {
  ReactDOM.createRoot(el).render(
    <React.StrictMode>
      <Client />
    </React.StrictMode>
  );
};

const devRoot = document.getElementById("scrumpoker-root") as HTMLElement;

if (devRoot) {
  Mount(devRoot);
}

export { Mount };
