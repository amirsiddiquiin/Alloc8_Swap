import { ChainInfo, SwapQuote, Token } from "@/types";

// Socket API key - in production this should be in an environment variable
const SOCKET_API_KEY = "645b2c8c-5825-4930-baf3-d9b997fcd88c"; // This is a demo API key, replace with your own
const SOCKET_API_URL = "https://api.socket.tech/v2";

// Common chains
export const CHAINS: Record<number, ChainInfo> = {
  1: {
    id: 1,
    name: "Ethereum",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
  },
  137: {
    id: 137,
    name: "Polygon",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png",
  },
  42161: {
    id: 42161,
    name: "Arbitrum",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png",
  },
  10: {
    id: 10,
    name: "Optimism",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/info/logo.png",
  },
  8453: {
    id: 8453,
    name: "Base",
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/info/logo.png",
  },
};

// Common tokens
export const COMMON_TOKENS: Record<number, Token[]> = {
  1: [
    {
      symbol: "ETH",
      name: "Ethereum",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      decimals: 18,
      chainId: 1,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
      isNative: true,
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      decimals: 6,
      chainId: 1,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    },
    {
      symbol: "USDT",
      name: "Tether USD",
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      decimals: 6,
      chainId: 1,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
    },
  ],
  137: [
    {
      symbol: "MATIC",
      name: "Matic",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      decimals: 18,
      chainId: 137,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png",
      isNative: true,
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      decimals: 6,
      chainId: 137,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    },
  ],
  42161: [
    {
      symbol: "ETH",
      name: "Ethereum",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      decimals: 18,
      chainId: 42161,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
      isNative: true,
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      decimals: 6,
      chainId: 42161,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    },
  ],
  10: [
    {
      symbol: "ETH",
      name: "Ethereum",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      decimals: 18,
      chainId: 10,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
      isNative: true,
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      address: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
      decimals: 6,
      chainId: 10,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    },
  ],
  8453: [
    {
      symbol: "ETH",
      name: "Ethereum",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      decimals: 18,
      chainId: 8453,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
      isNative: true,
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      decimals: 6,
      chainId: 8453,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    },
  ],
};

// Helper function to format amounts with decimals
export function formatUnits(amount: string, decimals: number): string {
  if (!amount) return "0";
  const amountBN = BigInt(amount);
  const divisor = BigInt(10) ** BigInt(decimals);
  const integerPart = amountBN / divisor;
  const fractionalPart = amountBN % divisor;
  
  let formattedFractional = fractionalPart.toString().padStart(decimals, "0");
  // Trim trailing zeros
  formattedFractional = formattedFractional.replace(/0+$/, "");
  
  if (formattedFractional === "") {
    return integerPart.toString();
  }
  
  return `${integerPart}.${formattedFractional}`;
}

// Helper function to parse amounts with decimals
export function parseUnits(amount: string, decimals: number): string {
  if (!amount || isNaN(Number(amount))) return "0";
  
  const [integerPart, fractionalPart = ""] = amount.split(".");
  const paddedFractionalPart = fractionalPart.padEnd(decimals, "0").slice(0, decimals);
  const bigIntValue = BigInt(integerPart) * BigInt(10) ** BigInt(decimals) + BigInt(paddedFractionalPart);
  
  return bigIntValue.toString();
}

// Socket API functions
export async function getTokens(chainId: number): Promise<Token[]> {
  try {
    const response = await fetch(`${SOCKET_API_URL}/token-lists/tokens?chainId=${chainId}`, {
      headers: {
        "API-KEY": SOCKET_API_KEY,
      },
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch tokens");
    }
    
    const data = await response.json();

    console.log("checking data", data)
    return data.result;
  } catch (error) {
    console.error("Error fetching tokens:", error);
    return COMMON_TOKENS[chainId] || [];
  }
}

export async function getQuote(
  fromChainId: number,
  fromTokenAddress: string,
  toChainId: number,
  toTokenAddress: string,
  fromAmount: string,
  userAddress: string,
  slippage: number
): Promise<SwapQuote | null> {
  try {
    const params = new URLSearchParams({
      fromChainId: fromChainId.toString(),
      fromTokenAddress,
      toChainId: toChainId.toString(),
      toTokenAddress,
      fromAmount,
      userAddress,
      slippage: slippage.toString(),
      sort: "output",
    });
    
    const response = await fetch(`${SOCKET_API_URL}/quote?${params.toString()}`, {
      headers: {
        "API-KEY": SOCKET_API_KEY,
      },
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch quote");
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || "Failed to get quote");
    }
    
    return {
      route: data.result.route,
      fromAmount: data.result.fromAmount,
      toAmount: data.result.toAmount,
      estimatedGas: data.result.estimatedGas,
      routeType: data.result.routeType,
      minAmountOut: data.result.minAmountOut,
      gasUsd: data.result.gasUsd,
      gasPrice: data.result.gasPrice,
    };
  } catch (error) {
    console.error("Error fetching quote:", error);
    return null;
  }
}

export async function buildTransaction(
  route: any,
  userAddress: string
): Promise<any> {
  try {
    const response = await fetch(`${SOCKET_API_URL}/build-tx`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-KEY": SOCKET_API_KEY,
      },
      body: JSON.stringify({
        route,
        userAddress,
      }),
    });
    
    if (!response.ok) {
      throw new Error("Failed to build transaction");
    }
    console.log("checking data", response.json)
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || "Failed to build transaction");
    }
    
    return data.result;
  } catch (error) {
    console.error("Error building transaction:", error);
    throw error;
  }
}

export async function checkAllowance(
  chainId: number,
  owner: string,
  allowanceTarget: string,
  tokenAddress: string,
  amount: string
): Promise<boolean> {
  try {
    const response = await fetch(`${SOCKET_API_URL}/approval/check-allowance?chainId=${chainId}&owner=${owner}&allowanceTarget=${allowanceTarget}&tokenAddress=${tokenAddress}&amount=${amount}`, {
      headers: {
        "API-KEY": SOCKET_API_KEY,
      },
    });
    
    if (!response.ok) {
      throw new Error("Failed to check allowance");
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || "Failed to check allowance");
    }
    
    return data.result.hasEnoughAllowance;
  } catch (error) {
    console.error("Error checking allowance:", error);
    return false;
  }
}

export async function buildApprovalTransaction(
  chainId: number,
  owner: string,
  allowanceTarget: string,
  tokenAddress: string,
  amount: string
): Promise<any> {
  try {
    const response = await fetch(`${SOCKET_API_URL}/approval/build-tx`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-KEY": SOCKET_API_KEY,
      },
      body: JSON.stringify({
        chainId,
        owner,
        allowanceTarget,
        tokenAddress,
        amount,
      }),
    });
    
    if (!response.ok) {
      throw new Error("Failed to build approval transaction");
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || "Failed to build approval transaction");
    }
    
    return data.result;
  } catch (error) {
    console.error("Error building approval transaction:", error);
    throw error;
  }
}
