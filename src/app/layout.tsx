"use client";

import {
  KeplrExtensionProvider,
  LeapCosmosExtensionProvider, ShuttleProvider
} from "@delphi-labs/shuttle-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import {
  INJECTIVE_TESTNET
} from "@/config/networks";
import Header from "@/components/Header";

import "./globals.css";

const extensionProviders = [
  new LeapCosmosExtensionProvider({
    networks: [INJECTIVE_TESTNET],
  }),
  new KeplrExtensionProvider({
    networks: [
      INJECTIVE_TESTNET,
    ],
  }),
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <html lang="en">
      <body>
        <ShuttleProvider
          mobileProviders={[]}
          extensionProviders={extensionProviders}
          persistent
        >
          <QueryClientProvider client={queryClient}>
            <Header />
            {children}
          </QueryClientProvider>
        </ShuttleProvider>
      </body>
    </html>
  );
}
