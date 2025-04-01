export interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  chainId: number;
  logoURI: string;
  isNative?: boolean;
}

export interface ChainInfo {
  id: number;
  name: string;
  logoURI: string;
}

export interface SwapQuote {
  route: any;
  fromAmount: string;
  toAmount: string;
  estimatedGas: string;
  routeType: string;
  minAmountOut: string;
  gasUsd: string;
  gasPrice: string;
}

export interface TokenBalance {
  token: Token;
  balance: string;
  formattedBalance: string;
}
