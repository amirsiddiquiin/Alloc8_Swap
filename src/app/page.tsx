"use client";

import { SwapWidget } from "@/components/swap-widget";
import { ThemeToggle } from "@/components/theme-toggle";
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-24 bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Alloc8 Nexus
        </h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <ConnectButton />
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-6xl flex flex-col items-center justify-center flex-1">
        <SwapWidget />
        
        <div className="mt-8 text-center max-w-md text-sm text-gray-500 dark:text-gray-400">
          <p>
            This cross-chain token swap widget is powered by Socket.tech, allowing you to swap tokens across different blockchains seamlessly.
          </p>
        </div>
      </div>
      
      {/* Footer */}
      <div className="w-full max-w-6xl mt-8 pt-4 border-t border-gray-200 dark:border-gray-800 text-center text-xs text-gray-500 dark:text-gray-400">
        <p>Built with Next.js, Wagmi, RainbowKit, and Socket.tech</p>
      </div>
    </main>
  );
}
