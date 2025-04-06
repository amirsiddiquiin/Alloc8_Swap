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
    {
      symbol: "WBTC",
      name: "Wrapped Bitcoin",
      address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
      decimals: 8,
      chainId: 1,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png",
    },
    {
      symbol: "DAI",
      name: "Dai Stablecoin",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      decimals: 18,
      chainId: 1,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
    },
    {
      symbol: "LINK",
      name: "ChainLink Token",
      address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
      decimals: 18,
      chainId: 1,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png",
    },
    {
      symbol: "UNI",
      name: "Uniswap",
      address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
      decimals: 18,
      chainId: 1,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png",
    },
    {
      symbol: "AAVE",
      name: "Aave Token",
      address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
      decimals: 18,
      chainId: 1,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9/logo.png",
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
    {
      symbol: "USDT",
      name: "Tether USD",
      address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      decimals: 6,
      chainId: 137,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
    },
    {
      symbol: "WBTC",
      name: "Wrapped Bitcoin",
      address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
      decimals: 8,
      chainId: 137,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png",
    },
    {
      symbol: "DAI",
      name: "Dai Stablecoin",
      address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
      decimals: 18,
      chainId: 137,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
    },
    {
      symbol: "AAVE",
      name: "Aave Token",
      address: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
      decimals: 18,
      chainId: 137,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9/logo.png",
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
    {
      symbol: "USDT",
      name: "Tether USD",
      address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
      decimals: 6,
      chainId: 42161,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
    },
    {
      symbol: "WBTC",
      name: "Wrapped Bitcoin",
      address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
      decimals: 8,
      chainId: 42161,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png",
    },
    {
      symbol: "DAI",
      name: "Dai Stablecoin",
      address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      decimals: 18,
      chainId: 42161,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
    },
    {
      symbol: "ARB",
      name: "Arbitrum",
      address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
      decimals: 18,
      chainId: 42161,
      logoURI: "https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg",
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
    {
      symbol: "USDT",
      name: "Tether USD",
      address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
      decimals: 6,
      chainId: 10,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
    },
    {
      symbol: "DAI",
      name: "Dai Stablecoin",
      address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      decimals: 18,
      chainId: 10,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
    },
    {
      symbol: "OP",
      name: "Optimism",
      address: "0x4200000000000000000000000000000000000042",
      decimals: 18,
      chainId: 10,
      logoURI: "https://assets.coingecko.com/coins/images/25244/small/Optimism.png",
    },
    {
      symbol: "WBTC",
      name: "Wrapped Bitcoin",
      address: "0x68f180fcCe6836688e9084f035309E29Bf0A2095",
      decimals: 8,
      chainId: 10,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png",
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
    {
      symbol: "DAI",
      name: "Dai Stablecoin",
      address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
      decimals: 18,
      chainId: 8453,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
    },
    {
      symbol: "USDT",
      name: "Tether USD",
      address: "0xA219439258ca9da29E9Cc4cE5596924745e12B93",
      decimals: 6,
      chainId: 8453,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
    },
    {
      symbol: "WBTC",
      name: "Wrapped Bitcoin",
      address: "0x3aAB2285ddcDdaD8edf438C1bAB47e1a9D05a9b4",
      decimals: 8,
      chainId: 8453,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png",
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
    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(`${SOCKET_API_URL}/token-lists/tokens?chainId=${chainId}`, {
      headers: {
        "API-KEY": SOCKET_API_KEY,
      },
      signal: controller.signal
    }).finally(() => clearTimeout(timeoutId));
    
    if (!response.ok) {
      console.warn(`API returned status ${response.status} when fetching tokens for chain ${chainId}`);
      return COMMON_TOKENS[chainId] || [];
    }
    
    const data = await response.json();

    // Validate the response structure
    if (!data.success || !Array.isArray(data.result)) {
      console.warn("Invalid token data format received", data);
      return COMMON_TOKENS[chainId] || [];
    }
    
    console.log(`Successfully fetched ${data.result.length} tokens for chain ${chainId}`);
    return data.result;
  } catch (error) {
    console.error("Error fetching tokens:", error);
    // Always fall back to common tokens if there's any error
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
