"use client";

import {
  KeplrExtensionProvider,
  MetamaskExtensionProvider,
  LeapCosmosExtensionProvider, ShuttleProvider, LeapCosmosMobileProvider, KeplrMobileProvider
} from "@delphi-labs/shuttle-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import {
  INJECTIVE_TESTNET
} from "@/config/networks";
import Header from "@/components/Header";

import "./globals.css";

const WC_PROJECT_ID = "0568e3d4920173dc3fb3ff66387eb922";

const extensionProviders = [
  new LeapCosmosExtensionProvider({
    networks: [INJECTIVE_TESTNET],
  }),
  new KeplrExtensionProvider({
    networks: [
      INJECTIVE_TESTNET,
    ],
  }),
  new MetamaskExtensionProvider({
    networks: [
      INJECTIVE_TESTNET,
    ],
  }),
];

const mobileProviders = [
  new LeapCosmosMobileProvider({
    networks: [INJECTIVE_TESTNET],
  }),
  new KeplrMobileProvider({
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
          walletConnectProjectId={WC_PROJECT_ID}
          mobileProviders={mobileProviders}
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
