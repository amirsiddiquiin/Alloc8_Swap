import { type PublicClient } from "viem";
import { type WalletClient } from "viem";
import { Token } from "@/types";
import { parseUnits } from "@/lib/socket";
import {
  UNISWAP_ROUTER_ADDRESS,
  ERC20_ABI,
  UNISWAP_ROUTER_ABI,
  NATIVE_ETH_ADDRESS,
  DEFAULT_FEE_TIER,
} from "@/lib/constants";
import { createToken, getUniswapQuote } from "@/lib/uniswap";

/**
 * Checks if a token needs approval for the Uniswap router
 */
export async function checkTokenAllowance(
  publicClient: PublicClient,
  tokenAddress: string,
  ownerAddress: string,
  amount: string,
  decimals: number
): Promise<boolean> {
  // Skip allowance check for native ETH
  if (tokenAddress === NATIVE_ETH_ADDRESS) {
    return false;
  }

  try {
    // Specify that we expect a bigint return type from the contract call
    const allowance = (await publicClient.readContract({
      address: tokenAddress as `0x${string}`,
      abi: ERC20_ABI,
      functionName: "allowance",
      args: [
        ownerAddress as `0x${string}`,
        UNISWAP_ROUTER_ADDRESS as `0x${string}`,
      ],
    })) as bigint;

    const amountBigInt = BigInt(parseUnits(amount, decimals).toString());

    // Return true if approval is needed
    return allowance < amountBigInt;
  } catch (error) {
    console.error("Error checking allowance:", error);
    throw error;
  }
}

/**
 * Approves tokens for the Uniswap router
 */
export async function approveTokens(
  walletClient: WalletClient,
  publicClient: PublicClient,
  tokenAddress: string,
  amount: string,
  decimals: number
): Promise<`0x${string}`> {
  try {
    const amountBigInt = BigInt(parseUnits(amount, decimals).toString());

    if (!walletClient.account) {
      throw new Error("Wallet not connected");
    }

    // Send approval transaction
    const approvalHash = await walletClient.writeContract({
      address: tokenAddress as `0x${string}`,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [UNISWAP_ROUTER_ADDRESS as `0x${string}`, amountBigInt],
      account: walletClient.account,
      chain: null,
    });

    // Wait for approval to be mined
    await publicClient.waitForTransactionReceipt({ hash: approvalHash });

    return approvalHash;
  } catch (error) {
    console.error("Error approving tokens:", error);
    throw error;
  }
}

/**
 * Executes a token swap using Uniswap
 */
export async function executeSwap(
  walletClient: WalletClient,
  fromToken: Token,
  toToken: Token,
  fromAmount: string,
  minAmountOut: bigint,
  userAddress: string
): Promise<`0x${string}`> {
  try {
    // Calculate deadline (30 minutes from now)
    const deadline = Math.floor(Date.now() / 1000) + 30 * 60;

    // Prepare swap parameters
    const swapParams = {
      tokenIn: fromToken.address as `0x${string}`,
      tokenOut: toToken.address as `0x${string}`,
      fee: DEFAULT_FEE_TIER,
      recipient: userAddress as `0x${string}`,
      deadline: BigInt(deadline),
      amountIn: BigInt(parseUnits(fromAmount, fromToken.decimals).toString()),
      amountOutMinimum: minAmountOut,
      sqrtPriceLimitX96: BigInt(0), // No price limit
    };

    if (!walletClient.account) {
      throw new Error("Wallet not connected");
    }

    // Send the swap transaction
    const hash = await walletClient.writeContract({
      address: UNISWAP_ROUTER_ADDRESS as `0x${string}`,
      abi: UNISWAP_ROUTER_ABI,
      functionName: "exactInputSingle",
      args: [swapParams],
      value:
        fromToken.address === NATIVE_ETH_ADDRESS
          ? BigInt(parseUnits(fromAmount, fromToken.decimals).toString())
          : BigInt(0),
      account: walletClient.account,
      chain: null,
    });

    return hash;
  } catch (error) {
    console.error("Error executing swap:", error);
    throw error;
  }
}

/**
 * Gets a quote for a token swap and creates a mock quote structure
 */
export async function getSwapQuote(
  fromToken: Token,
  toToken: Token,
  amount: string,
  userAddress: string | undefined,
  slippage: number
) {
  if (!fromToken || !toToken || !amount || parseFloat(amount) === 0) {
    return null;
  }

  try {
    console.log("Getting Uniswap quote");
    const uniQuote = await getUniswapQuote({
      tokenIn: createToken(
        1,
        fromToken.address,
        fromToken.decimals,
        fromToken.symbol,
        fromToken.name
      ),
      tokenOut: createToken(
        1,
        toToken.address,
        toToken.decimals,
        toToken.symbol,
        toToken.name
      ),
      amountIn: amount,
    });
    console.log("Uniswap quote:", uniQuote);

    // Return null if no quote is available
    if (!uniQuote || !uniQuote.amountOutWei) {
      return null;
    }

    // Create a mock Socket quote structure using Uniswap data
    const mockQuote = {
      route: {
        fromAmount: parseUnits(amount, fromToken.decimals).toString(),
        toAmount: uniQuote.amountOutWei,
        approvalData: {
          allowanceTarget: UNISWAP_ROUTER_ADDRESS,
          allowanceValue: parseUnits(amount, fromToken.decimals).toString(),
          spender: UNISWAP_ROUTER_ADDRESS,
        },
      },
      fromAmount: parseUnits(amount, fromToken.decimals).toString(),
      toAmount: uniQuote.amountOutWei,
      minAmount:
        (BigInt(uniQuote.amountOutWei) * BigInt(1000 - slippage * 10)) /
        BigInt(1000),
      minAmountOut: (
        (BigInt(uniQuote.amountOutWei) * BigInt(1000 - slippage * 10)) /
        BigInt(1000)
      ).toString(),
      estimatedGas: uniQuote.estimatedGas || "250000",
      gasPrice: uniQuote.gasPrice || "50",
      fromToken,
      toToken,
      routeType: "Uniswap V3",
      gasUsd: "0.50",
    };

    return {
      quote: mockQuote,
      uniswapQuote: {
        amountOut: uniQuote.amountOut,
        amountOutWei: uniQuote.amountOutWei,
      },
    };
  } catch (error) {
    console.error("Error getting swap quote:", error);
    throw error;
  }
}
