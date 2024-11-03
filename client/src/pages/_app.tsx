import "@/styles/globals.css";
import { Poppins } from "next/font/google";

import type { AppProps } from "next/app";
import { cn } from "@/lib/utils";
import { AppBar } from "@/layout/app-bar/app-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <div className={cn(poppins.className, "h-full flex flex-col")}>
        <header>
          <AppBar />
        </header>
        <div className="flex-1 mt-16">
          <Component {...pageProps} />
        </div>
      </div>
    </QueryClientProvider>
  );
}
