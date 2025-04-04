"use client";

import { useState, useEffect, useCallback } from "react";
import {
  useAccount,
  useBalance,
  useWalletClient,
  usePublicClient,
} from "wagmi";
import { useConfig, useChainId } from "wagmi";
import "@/styles/swap-widget.css";
import {
  parseUnits,
  formatUnits,
  CHAINS,
  COMMON_TOKENS,
  getQuote,
  buildTransaction,
  checkAllowance,
  buildApprovalTransaction,
} from "@/lib/socket";
import { ChainInfo, SwapQuote, Token, TokenBalance } from "@/types";
import { TokenSelector } from "./token-selector";
import { formatCurrency, debounce } from "@/lib/utils";
import { ArrowDownIcon, LoadingIcon, SwapIcon } from "./icons";
import { Input } from "./ui/input";
import { getUniswapQuote, createToken } from "@/lib/uniswap";

export function SwapWidget() {
  // Wallet and chain state
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const config = useConfig();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  // Token and chain selection state
  const [fromChain, setFromChain] = useState<ChainInfo>(CHAINS[1]); // Default to Ethereum
  const [toChain, setToChain] = useState<ChainInfo>(CHAINS[137]); // Default to Polygon
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);

  // Amount and quote state
  const [fromAmount, setFromAmount] = useState("");
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [uniswapQuote, setUniswapQuote] = useState<{
    amountOut: string;
    amountOutWei: string;
  } | null>(null);
  const [slippage, setSlippage] = useState(0.5); // Default 0.5%

  // Transaction state
  const [isGettingQuote, setIsGettingQuote] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [txStatus, setTxStatus] = useState<
    "pending" | "success" | "error" | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  // Token balances
  const { data: fromTokenBalance } = useBalance({
    address,
    token:
      fromToken?.address === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
        ? undefined
        : (fromToken?.address as `0x${string}`),
    chainId: fromChain?.id,
    query: {
      enabled: isConnected && !!fromToken && !!fromChain,
      refetchInterval: 10000, // Refetch every 10 seconds
      refetchOnWindowFocus: true,
      staleTime: 5000, // Consider data stale after 5 seconds
    },
  });

  // Debug balance fetching
  useEffect(() => {
    console.log("Balance fetching params:", {
      address,
      tokenAddress: fromToken?.address,
      isNative:
        fromToken?.address === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      chainId: fromChain?.id,
      isConnected,
      fromTokenBalance,
    });
  }, [address, fromToken, fromChain, isConnected, fromTokenBalance]);

  // Initialize with default tokens
  useEffect(() => {
    if (COMMON_TOKENS[fromChain.id]?.length > 0) {
      setFromToken(COMMON_TOKENS[fromChain.id][0]);
    }

    if (COMMON_TOKENS[toChain.id]?.length > 0) {
      setToToken(COMMON_TOKENS[toChain.id][0]);
    }
  }, []);

  // Reset tokens when chains change
  useEffect(() => {
    if (COMMON_TOKENS[fromChain.id]?.length > 0) {
      setFromToken(COMMON_TOKENS[fromChain.id][0]);
    } else {
      setFromToken(null);
    }
  }, [fromChain.id]);

  useEffect(() => {
    if (COMMON_TOKENS[toChain.id]?.length > 0) {
      setToToken(COMMON_TOKENS[toChain.id][0]);
    } else {
      setToToken(null);
    }
  }, [toChain.id]);

  // Debounced quote fetching
  const getQuoteDebounced = useCallback(
    debounce(async (amount: string) => {
      if (!fromToken || !toToken || !amount || parseFloat(amount) === 0) {
        setQuote(null);
        setUniswapQuote(null);
        return;
      }

      setIsGettingQuote(true);
      setError(null);

      try {
        // // Get Socket.tech quote
        // const socketQuote = await getQuote(
        //   fromChain.id,
        //   fromToken.address,
        //   toChain.id,
        //   toToken.address,
        //   parseUnits(amount, fromToken.decimals),
        //   address,
        //   slippage
        // );
        // setQuote(socketQuote);

        // Get Uniswap quote if on same chain (Ethereum mainnet)
        console.log("Getting quote");

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
          setUniswapQuote(uniQuote);
          
          // Create a mock Socket quote structure using Uniswap data
          // This ensures the swap button is enabled
          const mockQuote = {
            route: {
              fromAmount: parseUnits(amount, fromToken.decimals).toString(),
              toAmount: uniQuote.amountOutWei,
              approvalData: {
                allowanceTarget: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45", // Uniswap V3 Router
                allowanceValue: parseUnits(amount, fromToken.decimals).toString(),
                spender: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
              },
            },
            fromAmount: parseUnits(amount, fromToken.decimals).toString(),
            toAmount: uniQuote.amountOutWei,
            minAmount: BigInt(uniQuote.amountOutWei) * BigInt(1000 - slippage * 10) / BigInt(1000),
            fromToken,
            toToken,
          };
          
          setQuote(mockQuote);
        } catch (uniError) {
          console.error("Uniswap quote error:", uniError);
          setUniswapQuote(null);
        }
        // } else {
        //   setUniswapQuote(null);
        // }
      } catch (error) {
        console.error("Quote error:", error);
        setError("Failed to get quote. Please try again.");
        setQuote(null);
        setUniswapQuote(null);
      } finally {
        setIsGettingQuote(false);
      }
    }, 500),
    [fromChain.id, toChain.id, fromToken, toToken, address, slippage]
  );

  // Fetch quote when inputs change
  useEffect(() => {
    getQuoteDebounced(fromAmount);
  }, [
    fromToken,
    toToken,
    fromAmount,
    address,
    fromChain.id,
    toChain.id,
    slippage,
    getQuoteDebounced,
  ]);

  // Handle token swap
  const handleSwap = async () => {
    if (!isConnected) {
      setError("Please connect your wallet");
      return;
    }

    if (!fromToken || !toToken || !uniswapQuote || !address || !walletClient || !publicClient) {
      setError("Missing required information");
      return;
    }

    setIsSwapping(true);
    setError(null);
    setTxHash("");
    setTxStatus(null);

    try {
      // Check if we need to switch networks
      if (chainId !== fromChain.id) {
        setError("Please switch to the correct network manually");
        return;
      }

      // Uniswap V3 Router address
      const UNISWAP_ROUTER_ADDRESS = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";
      
      // Check if approval is needed for ERC20 tokens
      if (!fromToken.isNative) {
        try {
          // Check allowance using publicClient
          const erc20ABI = [
            {
              "constant": true,
              "inputs": [
                { "name": "_owner", "type": "address" },
                { "name": "_spender", "type": "address" }
              ],
              "name": "allowance",
              "outputs": [{ "name": "", "type": "uint256" }],
              "payable": false,
              "stateMutability": "view",
              "type": "function"
            },
            {
              "constant": false,
              "inputs": [
                { "name": "_spender", "type": "address" },
                { "name": "_value", "type": "uint256" }
              ],
              "name": "approve",
              "outputs": [{ "name": "", "type": "bool" }],
              "payable": false,
              "stateMutability": "nonpayable",
              "type": "function"
            }
          ];
          
          const allowance = await publicClient.readContract({
            address: fromToken.address as `0x${string}`,
            abi: erc20ABI,
            functionName: 'allowance',
            args: [address, UNISWAP_ROUTER_ADDRESS as `0x${string}`]
          });
          
          const amountBigInt = BigInt(parseUnits(fromAmount, fromToken.decimals).toString());
          
          if (BigInt(allowance.toString()) < amountBigInt) {
            setIsApproving(true);
            
            // Send approval transaction
            const approvalHash = await walletClient.writeContract({
              address: fromToken.address as `0x${string}`,
              abi: erc20ABI,
              functionName: 'approve',
              args: [UNISWAP_ROUTER_ADDRESS as `0x${string}`, amountBigInt]
            });
            
            // Wait for approval to be mined
            setTxHash(approvalHash);
            setTxStatus("pending");
            
            // Wait for the transaction to be confirmed
            await publicClient.waitForTransactionReceipt({ hash: approvalHash });
            
            setIsApproving(false);
          }
        } catch (approvalError) {
          console.error("Approval error:", approvalError);
          setError("Failed to approve token. Please try again.");
          setIsApproving(false);
          setIsSwapping(false);
          return;
        }
      }
      
      // Uniswap V3 SwapRouter ABI (simplified for exactInputSingle)
      const swapRouterABI = [
        {
          "inputs": [{
            "components": [
              { "internalType": "address", "name": "tokenIn", "type": "address" },
              { "internalType": "address", "name": "tokenOut", "type": "address" },
              { "internalType": "uint24", "name": "fee", "type": "uint24" },
              { "internalType": "address", "name": "recipient", "type": "address" },
              { "internalType": "uint256", "name": "deadline", "type": "uint256" },
              { "internalType": "uint256", "name": "amountIn", "type": "uint256" },
              { "internalType": "uint256", "name": "amountOutMinimum", "type": "uint256" },
              { "internalType": "uint160", "name": "sqrtPriceLimitX96", "type": "uint160" }
            ],
            "internalType": "struct ISwapRouter.ExactInputSingleParams",
            "name": "params",
            "type": "tuple"
          }],
          "name": "exactInputSingle",
          "outputs": [{ "internalType": "uint256", "name": "amountOut", "type": "uint256" }],
          "stateMutability": "payable",
          "type": "function"
        }
      ];
      
      // Calculate minimum amount out based on slippage
      const amountOutMinimum = BigInt(uniswapQuote.amountOutWei) * BigInt(1000 - slippage * 10) / BigInt(1000);
      
      // Calculate deadline (30 minutes from now)
      const deadline = Math.floor(Date.now() / 1000) + 30 * 60;
      
      // Prepare swap parameters
      const swapParams = {
        tokenIn: fromToken.address as `0x${string}`,
        tokenOut: toToken.address as `0x${string}`,
        fee: 3000, // 0.3% fee tier
        recipient: address,
        deadline: BigInt(deadline),
        amountIn: BigInt(parseUnits(fromAmount, fromToken.decimals).toString()),
        amountOutMinimum: amountOutMinimum,
        sqrtPriceLimitX96: BigInt(0) // No price limit
      };
      
      // Send the swap transaction
      const hash = await walletClient.writeContract({
        address: UNISWAP_ROUTER_ADDRESS as `0x${string}`,
        abi: swapRouterABI,
        functionName: 'exactInputSingle',
        args: [swapParams],
        value: fromToken.isNative ? BigInt(parseUnits(fromAmount, fromToken.decimals).toString()) : BigInt(0),
      });
      
      setTxHash(hash);
      setTxStatus("pending");
      
      // Wait for the transaction to be confirmed
      await publicClient.waitForTransactionReceipt({ hash });
      
      setTxStatus("success");
      setFromAmount("");
      setQuote(null);
      setUniswapQuote(null);
    } catch (err: any) {
      console.error("Swap error:", err);
      setTxStatus("error");
      setError(err.message || "Failed to complete swap");
    } finally {
      setIsSwapping(false);
      setIsApproving(false);
    }
  };

  // Handle token swap direction reversal
  const handleReverseTokens = () => {
    const tempChain = fromChain;
    const tempToken = fromToken;

    setFromChain(toChain);
    setFromToken(toToken);

    setToChain(tempChain);
    setToToken(tempToken);

    setFromAmount("");
    setQuote(null);
  };

  // Format estimated output
  const formattedOutput = uniswapQuote
    ? Number(uniswapQuote.amountOut) / 10
    : "0";

  // Format min amount out (after slippage)
  const formattedMinAmountOut = quote
    ? formatUnits(quote.minAmountOut, toToken?.decimals || 18)
    : "0";

  // Check if user has sufficient balance
  const hasSufficientBalance = fromTokenBalance
    ? BigInt(parseUnits(fromAmount || "0", fromToken?.decimals || 18)) <=
      BigInt(fromTokenBalance.value.toString())
    : true;

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800 backdrop-blur-sm">
      <div className="p-8 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-blue-900/5 dark:to-purple-900/5 -z-10 pointer-events-none"></div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-1.5 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            Swap Tokens
          </h2>
          <div className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium">
            Best Rates
          </div>
        </div>

        {/* From token section */}
        <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-gray-800 dark:to-gray-800 p-5 rounded-xl mb-3 shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-200">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              From
            </span>
            {isConnected ? (
              fromTokenBalance ? (
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
                  Balance: {parseFloat(fromTokenBalance.formatted).toFixed(4)}{" "}
                  {fromTokenBalance.symbol}
                </span>
              ) : (
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                  Loading balance...
                </span>
              )
            ) : (
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Connect wallet to view balance
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              placeholder="0.0"
              className="bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-2xl font-semibold focus-visible:ring-0 h-auto dark:text-white"
              rightElement={
                fromTokenBalance && (
                  <button
                    onClick={() =>
                      fromTokenBalance &&
                      setFromAmount(fromTokenBalance.formatted)
                    }
                    className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    MAX
                  </button>
                )
              }
            />

            <TokenSelector
              selectedToken={fromToken}
              selectedChain={fromChain}
              onSelectToken={setFromToken}
              onSelectChain={setFromChain}
            />
          </div>

          {!hasSufficientBalance && fromAmount && (
            <div className="mt-1 text-red-500 text-sm">
              Insufficient balance
            </div>
          )}
        </div>

        {/* Swap direction button */}
        <div className="flex justify-center -my-3 relative z-10">
          <button
            onClick={handleReverseTokens}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full p-3 hover:from-blue-600 hover:to-purple-600 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            aria-label="Reverse swap direction"
          >
            <SwapIcon className="w-5 h-5" />
          </button>
        </div>

        {/* To token section */}
        <div className="bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-gray-800 dark:to-gray-800 p-5 rounded-xl mb-4 shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-200">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              To (Estimated)
            </span>
            {quote && (
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <ArrowDownIcon className="w-3 h-3" />
                Best rate found
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 text-2xl font-semibold overflow-hidden text-ellipsis dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2">
              {isGettingQuote ? (
                <div className="flex items-center gap-2">
                  <LoadingIcon className="w-5 h-5 text-blue-500 animate-spin" />
                  <span className="text-gray-400 text-base">
                    Fetching quote...
                  </span>
                </div>
              ) : (
                formatCurrency(formattedOutput)
              )}
            </div>

            <TokenSelector
              selectedToken={toToken}
              selectedChain={toChain}
              onSelectToken={setToToken}
              onSelectChain={setToChain}
            />
          </div>
        </div>

        {/* Slippage settings */}
        <div className="mb-5 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between mb-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-blue-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Slippage Tolerance
            </span>
          </div>

          <div className="flex gap-2">
            {[0.5, 1, 2].map((value) => (
              <button
                key={value}
                onClick={() => setSlippage(value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  slippage === value
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:border-blue-500 dark:hover:bg-gray-600"
                }`}
              >
                {value}%
              </button>
            ))}

            <div className="relative flex-1">
              <Input
                type="number"
                value={
                  slippage === 0.5 || slippage === 1 || slippage === 2
                    ? ""
                    : slippage
                }
                onChange={(e) => setSlippage(parseFloat(e.target.value) || 0.5)}
                placeholder="Custom"
                className="h-10 text-sm font-medium border border-gray-200 dark:border-gray-700 rounded-lg"
                rightElement={
                  <span className="text-gray-500 text-sm font-medium">%</span>
                }
              />
            </div>
          </div>
        </div>

        {/* Swap details */}
        {quote && (
          <div className="p-4 mb-5 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20 text-sm">
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-blue-100/50 dark:border-blue-800/30">
              <span className="text-blue-700 dark:text-blue-300 font-medium">
                Swap Details
              </span>
              <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-800/40 text-blue-700 dark:text-blue-300 rounded-full">
                {quote.routeType}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-blue-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Minimum received
                </span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {formatCurrency(formattedMinAmountOut)} {toToken?.symbol}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-blue-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a1 1 0 011-1h5.586a.997.997 0 01.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Network fee
                </span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  ~${quote.gasUsd ? formatCurrency(quote.gasUsd) : "0.00"}
                </span>
              </div>
            </div>
          </div>
        )}

        {uniswapQuote && fromChain.id === 1 && toChain.id === 1 && (
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Uniswap V3 Quote
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {formatCurrency(parseFloat(uniswapQuote.amountOut))}{" "}
              {toToken?.symbol}
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-5 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm flex items-start gap-3 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-medium mb-1">Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Transaction status */}
        {txHash && (
          <div
            className={`mb-5 p-4 rounded-xl text-sm shadow-sm flex items-start gap-3 ${
              txStatus === "success"
                ? "bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 text-green-600 dark:text-green-400"
                : txStatus === "error"
                ? "bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400"
                : "bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 text-blue-600 dark:text-blue-400"
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {txStatus === "success" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-green-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : txStatus === "error" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="animate-spin h-5 w-5 text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
            </div>

            <div className="flex-1">
              <div className="font-medium mb-1">
                {txStatus === "success"
                  ? "Transaction successful"
                  : txStatus === "error"
                  ? "Transaction failed"
                  : isApproving
                  ? "Approving tokens..."
                  : "Transaction pending..."}
              </div>
              <div className="text-xs break-all">
                <span className="font-medium">Transaction hash: </span>
                <a
                  href={`https://${
                    fromChain.id === 1 ? "" : `${fromChain.name.toLowerCase()}.`
                  }etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {txHash.substring(0, 10)}...
                  {txHash.substring(txHash.length - 8)}
                </a>
                <span
                  className="ml-2 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => navigator.clipboard.writeText(txHash)}
                >
                  Copy
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Swap button */}
        <button
          onClick={handleSwap}
          disabled={
            !isConnected ||
            !fromToken ||
            !toToken ||
            !quote ||
            isSwapping ||
            isApproving ||
            !hasSufficientBalance ||
            parseFloat(fromAmount) <= 0
          }
          className={`w-full py-4 px-6 rounded-xl font-semibold text-base shadow-lg transform transition-all duration-200 ${
            !isConnected ||
            !fromToken ||
            !toToken ||
            !quote ||
            isSwapping ||
            isApproving ||
            !hasSufficientBalance ||
            parseFloat(fromAmount || "0") <= 0
              ? "bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 hover:shadow-xl hover:scale-[1.02] dark:from-blue-600 dark:to-purple-600 dark:hover:from-blue-500 dark:hover:to-purple-500"
          } flex items-center justify-center gap-2`}
        >
          {!isConnected ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v-1l1-1 1-1 .257-.257A6 6 0 0118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Connect Wallet
            </span>
          ) : isSwapping ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Swapping...
            </span>
          ) : isApproving ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Approving...
            </span>
          ) : !fromToken || !toToken ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Select Tokens
            </span>
          ) : !quote ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clipRule="evenodd"
                />
              </svg>
              Swap
            </span>
          ) : !hasSufficientBalance ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Insufficient Balance
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
              Swap Now
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
