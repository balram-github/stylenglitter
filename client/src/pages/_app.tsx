import "@/styles/globals.css";
import { Poppins } from "next/font/google";
import {
  initialiseTracking,
  trackEvent,
} from "@/services/tracking/tracking.service";

import type { AppProps } from "next/app";
import { cn } from "@/lib/utils";
import { AppBar } from "@/layout/app-bar/app-bar";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "@/lib/query";
import { useRouter } from "next/router";
import { useEffect } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

initialiseTracking();

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      //Send track event when new pages are loaded
      trackEvent("Page view", {
        url,
      });
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className={cn(poppins.className, "h-full flex flex-col")}>
        <header>
          <AppBar />
        </header>
        <div className="flex-1 mt-16">
          <Component {...pageProps} />
        </div>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}
