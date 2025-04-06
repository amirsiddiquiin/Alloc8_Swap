
![Xnip2025-04-06_15-26-30](https://github.com/user-attachments/assets/c4c4b3dc-ad94-4a0e-a47d-dbaa70bccab3)

![image](https://github.com/user-attachments/assets/ea43d5ec-361c-455e-8ccf-86b0a052b4e4)


# Socket.tech Token Swap Widget

A cross-chain token swap widget built with Next.js, React, TailwindCSS, and Socket.tech integration. This project allows users to swap tokens across different blockchains (e.g., USDC on Polygon → ETH on Arbitrum) with a seamless user experience.

## 🚀 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TailwindCSS 4
- **Web3**: wagmi v2, viem, ethers, RainbowKit v2
- **API Integration**: Socket.tech REST API
- **Styling**: TailwindCSS
- **Theme**: Light/Dark mode support with next-themes

## ✨ Features

- Connect wallet via RainbowKit
- Select source and destination tokens and chains
- Set slippage tolerance (0.5%, 1%, 2%, or custom)
- View estimated output and minimum received amount
- Perform ERC-20 approvals when needed
- Execute cross-chain swaps
- View transaction status and details
- Dark/Light theme support
- Responsive design

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=YOUR_WALLET_CONNECT_PROJECT_ID
NEXT_PUBLIC_ALCHEMY_API_KEY=YOUR_ALCHEMY_API_KEY
```

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔄 Implementation Details

### API Integration

This project uses the Socket.tech REST API for cross-chain token swaps. The API is used to:

- Fetch token lists for each chain
- Get quotes for token swaps
- Build and execute transactions
- Handle token approvals

### Design Decisions

- **REST API vs SDK**: Chose to use the REST API directly for more control over the implementation and to reduce bundle size.
- **wagmi/viem vs ethers**: Used wagmi/viem for wallet connections and transactions for better TypeScript support and future compatibility.
- **Component Structure**: Modular components for better maintainability and reusability.

## 📱 Responsive Design

The UI is fully responsive and works well on mobile devices, tablets, and desktops.

## 🚀 Deployment

The project can be deployed on Vercel with the following command:

```bash
vercel
```

## 📝 License

This project is MIT licensed.
