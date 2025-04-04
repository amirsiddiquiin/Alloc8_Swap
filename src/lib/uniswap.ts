import { ChainId, SUPPORTED_CHAINS, Token } from "@uniswap/sdk-core";
import { computePoolAddress, FeeAmount } from "@uniswap/v3-sdk";
import {
  PublicClient,
  createPublicClient,
  http,
  formatUnits,
  parseUnits,
  getContract,
} from "viem";
import { mainnet } from "viem/chains";
import { QuoterABI } from "./abis/Quoter";
import { PoolABI } from "./abis/Pool";

// Mainnet addresses
const POOL_FACTORY_ADDRESS =
  "0x1F98431c8aD98523631AE4a59f267346ea31F984" as const;
const QUOTER_CONTRACT_ADDRESS =
  "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6" as const;
const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" as const;
const ETH_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

interface PoolConstants {
  token0: string;
  token1: string;
  fee: number;
}

async function getPoolConstants(
  tokenA: Token,
  tokenB: Token,
  fee: number,
  publicClient: PublicClient
): Promise<PoolConstants> {
  try {
    // Ensure addresses are valid
    if (!tokenA.address || !tokenB.address) {
      throw new Error("Invalid token addresses");
    }

    const WETH_TOKEN = new Token(
      ChainId.MAINNET,
      "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      18,
      "WETH",
      "Wrapped Ether"
    );

    const USDC_TOKEN = new Token(
      ChainId.MAINNET,
      "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      6,
      "USDC",
      "USD//C"
    );

    // Sort tokens to match Uniswap's token ordering
    const [token0, token1] =
      tokenA.address.toLowerCase() < tokenB.address.toLowerCase()
        ? [tokenA, tokenB]
        : [tokenB, tokenA];

    // Use the actual tokens passed to the function
    const poolAddress = computePoolAddress({
      factoryAddress: POOL_FACTORY_ADDRESS,
      tokenA: token0,
      tokenB: token1,
      fee: fee as FeeAmount,
    });

    const poolContract = getContract({
      address: poolAddress as `0x${string}`,
      abi: PoolABI,
      client: publicClient,
    });

    const [actualToken0, actualToken1, poolFee] = await Promise.all([
      poolContract.read.token0(),
      poolContract.read.token1(),
      poolContract.read.fee(),
    ]);

    return {
      token0: actualToken0,
      token1: actualToken1,
      fee: Number(poolFee),
    };
  } catch (error) {
    console.error("Error in getPoolConstants:", error);
    throw error;
  }
}

export async function getUniswapQuote({
  tokenIn,
  tokenOut,
  amountIn,
  fee = 3000, // Default to 0.3%
  publicClient,
}: {
  tokenIn: Token;
  tokenOut: Token;
  amountIn: string;
  fee?: number;
  publicClient?: PublicClient;
}) {
  console.log("Getting Uniswap quote", {
    tokenIn,
    tokenOut,
    amountIn,
    fee,
    publicClient,
  });
  try {
    // Create a mainnet client if not provided
    const client =
      publicClient ??
      createPublicClient({
        chain: mainnet,
        transport: http(),
      });

    // Convert ETH to WETH addresses for Uniswap compatibility
    const actualTokenIn = new Token(
      tokenIn.chainId,
      tokenIn.address === ETH_ADDRESS ? WETH_ADDRESS : tokenIn.address,
      tokenIn.decimals,
      tokenIn.symbol,
      tokenIn.name
    );

    const actualTokenOut = new Token(
      tokenOut.chainId,
      tokenOut.address === ETH_ADDRESS ? WETH_ADDRESS : tokenOut.address,
      tokenOut.decimals,
      tokenOut.symbol,
      tokenOut.name
    );

    // Get pool constants to ensure correct token ordering and fee
    const poolConstants = await getPoolConstants(
      actualTokenIn,
      actualTokenOut,
      fee,
      client
    );

    // Get the quote using simulate to avoid state changes
    const { result } = await client.simulateContract({
      address: QUOTER_CONTRACT_ADDRESS,
      abi: QuoterABI,
      functionName: "quoteExactInputSingle",
      args: [
        poolConstants.token0 as `0x${string}`,
        poolConstants.token1 as `0x${string}`,
        Number(poolConstants.fee),
        parseUnits(amountIn, tokenIn.decimals),
        0n, // sqrtPriceLimitX96 (0 for no price limit)
      ],
    });

    if (typeof result === "undefined") {
      throw new Error("Failed to get quote from Uniswap");
    }

    // Format the output amount
    const amountOut = formatUnits(result, tokenOut.decimals);

    return {
      amountOut,
      amountOutWei: result.toString(),
    };
  } catch (error) {
    console.error("Error getting Uniswap quote:", error);
    throw error;
  }
}

// Helper function to create Token instances
export function createToken(
  chainId: number,
  address: string,
  decimals: number,
  symbol: string,
  name: string
): Token {
  // Ensure the address is a valid hex string
  const formattedAddress = address.toLowerCase();
  if (!formattedAddress.startsWith("0x") || formattedAddress.length !== 42) {
    throw new Error(`Invalid address format: ${address}`);
  }
  return new Token(chainId, formattedAddress, decimals, symbol, name);
}
