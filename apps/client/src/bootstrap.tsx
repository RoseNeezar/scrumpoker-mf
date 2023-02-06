import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/globals.css";
import { trpc } from "./utils/trpc";
import superjson from "superjson";
import { BrowserRouter } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
const server_url = process.env.REACT_APP_SERVER_URL;
const getBaseUrl = () => {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

  return server_url; // dev SSR should use localhost
};

function Client({ mf }: { mf?: string }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: Infinity,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
          },
          mutations: {
            onError(error: any, variables, context) {
              toast.error(error.shape.message);
            },
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
        <BrowserRouter basename={mf ? `/${mf}` : "/"}>
          <App />
          <Toaster />
        </BrowserRouter>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

const Mount = (el: HTMLElement, mf?: string) => {
  ReactDOM.createRoot(el).render(
    <React.StrictMode>
      <Client mf={mf} />
    </React.StrictMode>
  );
};

const devRoot = document.getElementById("scrumpoker-root") as HTMLElement;

if (devRoot) {
  Mount(devRoot);
}

export { Mount };
