"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ChainInfo, Token } from "@/types";
import { CHAINS, COMMON_TOKENS, getTokens } from "@/lib/socket";
import Image from "next/image";
import { ChevronDownIcon, LoadingIcon } from "./icons";

interface TokenSelectorProps {
  selectedToken: Token | null;
  selectedChain: ChainInfo;
  onSelectToken: (token: Token) => void;
  onSelectChain: (chain: ChainInfo) => void;
}

export function TokenSelector({
  selectedToken,
  selectedChain,
  onSelectToken,
  onSelectChain,
}: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"tokens" | "chains">("tokens");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load tokens when chain changes or dialog opens
  useEffect(() => {
    if (isOpen && activeTab === "tokens") {
      loadTokens();
    }
  }, [isOpen, selectedChain.id, activeTab]);

  // Filter tokens based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTokens(tokens);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = tokens.filter(
      (token) =>
        token.symbol.toLowerCase().includes(query) ||
        token.name.toLowerCase().includes(query) ||
        token.address.toLowerCase() === query
    );

    setFilteredTokens(filtered);
  }, [tokens, searchQuery]);

  async function loadTokens() {
    setIsLoading(true);
    try {
      // First show common tokens immediately
      const commonTokens = COMMON_TOKENS[selectedChain.id] || [];
      setTokens(commonTokens);
      setFilteredTokens(commonTokens);
      
      // Then fetch all tokens
      const fetchedTokens = await getTokens(selectedChain.id);
      if (fetchedTokens.length > 0) {
        setTokens(fetchedTokens);
        setFilteredTokens(fetchedTokens);
      }
    } catch (error) {
      console.error("Failed to load tokens:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSelectToken(token: Token) {
    onSelectToken(token);
    setIsOpen(false);
    setSearchQuery("");
  }

  function handleSelectChain(chain: ChainInfo) {
    onSelectChain(chain);
    setActiveTab("tokens");
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg px-3 py-2 transition-colors"
      >
        {selectedToken ? (
          <>
            <div className="flex items-center gap-2">
              <div className="relative w-6 h-6">
                <Image
                  src={selectedToken.logoURI}
                  alt={selectedToken.symbol}
                  fill
                  className="rounded-full object-contain"
                />
              </div>
              <span>{selectedToken.symbol}</span>
            </div>
          </>
        ) : (
          <span>Select Token</span>
        )}
        <ChevronDownIcon className="w-4 h-4" />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {activeTab === "tokens" ? "Select a token" : "Select a chain"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex border-b mb-4">
            <button
              className={`px-4 py-2 ${
                activeTab === "tokens"
                  ? "border-b-2 border-blue-500 font-medium"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("tokens")}
            >
              Tokens
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === "chains"
                  ? "border-b-2 border-blue-500 font-medium"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("chains")}
            >
              Networks
            </button>
          </div>

          {activeTab === "tokens" && (
            <>
              <Input
                placeholder="Search by name or paste address"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="mb-4"
              />

              <div className="flex items-center gap-2 mb-4">
                <div className="relative w-5 h-5">
                  <Image
                    src={selectedChain.logoURI}
                    alt={selectedChain.name}
                    fill
                    className="rounded-full object-contain"
                  />
                </div>
                <span className="text-sm">{selectedChain.name}</span>
              </div>

              <div className="max-h-[300px] overflow-y-auto">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingIcon className="w-8 h-8 text-blue-500" />
                  </div>
                ) : filteredTokens.length > 0 ? (
                  <div className="space-y-2">
                    {filteredTokens.map((token) => (
                      <button
                        key={token.address}
                        className="w-full flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        onClick={() => handleSelectToken(token)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative w-8 h-8">
                            <Image
                              src={token.logoURI}
                              alt={token.symbol}
                              fill
                              className="rounded-full object-contain"
                            />
                          </div>
                          <div className="text-left">
                            <div className="font-medium">{token.symbol}</div>
                            <div className="text-xs text-gray-500">
                              {token.name}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No tokens found
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === "chains" && (
            <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
              {Object.values(CHAINS).map((chain) => (
                <button
                  key={chain.id}
                  className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
                    selectedChain.id === chain.id
                      ? "bg-blue-100 dark:bg-blue-900"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => handleSelectChain(chain)}
                >
                  <div className="relative w-6 h-6">
                    <Image
                      src={chain.logoURI}
                      alt={chain.name}
                      fill
                      className="rounded-full object-contain"
                    />
                  </div>
                  <span>{chain.name}</span>
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
