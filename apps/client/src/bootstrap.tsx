import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/globals.css";
import { trpc } from "./utils/trpc";
import superjson from "superjson";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const getBaseUrl = () => {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

  return `http://localhost:3001`; // dev SSR should use localhost
};

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
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      transformer: superjson,
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
          <Toaster />
        </BrowserRouter>
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
