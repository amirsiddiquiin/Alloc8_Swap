import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrum, mainnet, polygon, optimism, base } from 'viem/chains';
import { http } from 'viem';

// Configure chains & providers
export const config = getDefaultConfig({
  appName: 'Socket Token Swap',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [mainnet, polygon, optimism, arbitrum, base],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
  },
  ssr: true,
});

export const wagmiConfig = config;
export const chains = config.chains;
