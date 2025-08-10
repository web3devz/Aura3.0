"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/contexts/auth-context";
import { NFTGallery } from "@/app/components/therapy/nft-gallery";
import { getUserSessions } from "@/lib/contracts/therapy-actions";
import { ethers } from "ethers";
import {
  Loader2,
  AlertCircle,
  Clock,
  Smile,
  Share2,
  Trophy,
  Badge,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Badge as UIBadge } from "@/components/ui/badge";

interface Token {
  id: string;
  sessionId: string;
  imageUri: string;
  metadata: {
    name: string;
    description: string;
    attributes: {
      trait_type: string;
      value: string | number;
    }[];
  };
}

interface SessionData {
  sessionId: string;
  imageUri: string;
  metadata: {
    name: string;
    description: string;
    attributes: {
      trait_type: string;
      value: string | number;
    }[];
  };
}

const NFTCard = ({ token, onShare }: { token: Token; onShare: () => void }) => {
  const duration =
    token.metadata.attributes.find((attr) => attr.trait_type === "Duration")
      ?.value || 0;
  const moodScore =
    token.metadata.attributes.find((attr) => attr.trait_type === "Mood Score")
      ?.value || 8;
  const achievements =
    token.metadata.attributes.find((attr) => attr.trait_type === "Achievements")
      ?.value || 0;

  const getSessionEmoji = (duration: number) => {
    if (duration <= 5) return "🌱";
    if (duration <= 15) return "🌿";
    if (duration <= 30) return "🌳";
    return "🌺";
  };

  const getSessionType = (duration: number) => {
    if (duration <= 5) return "Quick Check-in";
    if (duration <= 15) return "Growth Session";
    if (duration <= 30) return "Deep Reflection";
    return "Transformative Journey";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative"
    >
      <div className="relative min-h-[400px] overflow-hidden rounded-2xl bg-gradient-to-br from-white via-white to-primary/5 dark:from-gray-900 dark:via-gray-900 dark:to-primary/20 p-6 shadow-xl ring-1 ring-primary/10 transition-all duration-300 hover:shadow-2xl hover:ring-primary/20">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-yellow-500/5" />
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl" />

        <div className="relative h-full flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-primary" />
                <p className="text-base font-medium">
                  Session #{token.sessionId}
                </p>
              </div>
              <div className="text-sm font-medium text-primary bg-primary/5 px-3 py-1.5 rounded-full">
                {getSessionType(Number(duration))}
              </div>
            </div>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent mt-3" />
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col items-center justify-start space-y-6">
            <div className="text-7xl animate-float py-6">
              {getSessionEmoji(Number(duration))}
            </div>
            <div className="w-full space-y-3">
              <h3 className="text-xl font-semibold text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {token.metadata.name}
              </h3>
              <p className="text-sm text-muted-foreground text-center px-4 min-h-[3em]">
                {token.metadata.description}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mt-auto space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center justify-center gap-1.5 bg-primary/5 rounded-lg py-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-base font-medium">{duration} min</span>
                </div>
                <span className="text-sm text-muted-foreground">Duration</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1.5 bg-primary/5 rounded-lg py-4">
                <div className="flex items-center gap-2">
                  <Smile className="w-5 h-5 text-primary" />
                  <span className="text-base font-medium">{moodScore}/10</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  Mood Score
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-1.5 bg-primary/5 rounded-lg py-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                <span className="text-base font-medium">
                  {achievements} Milestones Achieved
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                Growth Progress
              </span>
            </div>

            {/* Share Button */}
            <Button
              variant="outline"
              className="w-full bg-white/50 backdrop-blur-sm hover:bg-white/75 dark:bg-gray-950/50 dark:hover:bg-gray-950/75"
              onClick={onShare}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Achievement
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Add this CSS animation
const styles = `
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-float {
  animation: float 3s ease-in-out infinite;
}
`;

export default function NFTsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [sessions, setSessions] = useState<Token[]>([]);
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleShare = async (title: string, text: string) => {
    try {
      await navigator.share({
        title,
        text,
        url: window.location.href,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  useEffect(() => {
    const loadNFTs = async () => {
      if (!isAuthenticated || !user?.walletAddress) return;

      try {
        setError(null);
        setIsLoadingNFTs(true);

        // Check for Web3 provider
        if (!window.ethereum) {
          throw new Error("Please install a Web3 wallet to view your NFTs");
        }

        // Get current chain ID
        let provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        const currentChainId = Number(network.chainId);
        const targetChainId = 57054;
        const targetChainIdHex = `0x${targetChainId.toString(16)}`;

        // Check if we're on Sonic Blaze Testnet (57054)
        if (currentChainId !== targetChainId) {
          try {
            // First try to switch to the network if it exists
            try {
              await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: targetChainIdHex }],
              });
            } catch (switchError: any) {
              // This error code indicates that the chain has not been added to MetaMask
              if (switchError.code === 4902) {
                await window.ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: targetChainIdHex,
                      chainName: "Sonic Blaze Testnet",
                      nativeCurrency: {
                        name: "Sonic",
                        symbol: "S",
                        decimals: 18,
                      },
                      rpcUrls: ["https://rpc.blaze.soniclabs.com"],
                      blockExplorerUrls: ["https://testnet.sonicscan.org"],
                    },
                  ],
                });

                // Verify the chain ID after adding the network
                const updatedNetwork = await provider.getNetwork();
                const updatedChainId = Number(updatedNetwork.chainId);
                if (updatedChainId !== targetChainId) {
                  throw new Error(
                    "Network verification failed. Please verify the network details and try again."
                  );
                }
              } else {
                throw new Error(
                  `Failed to switch to Sonic Blaze Testnet: ${switchError.message}`
                );
              }
            }
          } catch (error) {
            console.error("Network switching error:", error);
            throw new Error(
              error instanceof Error
                ? error.message
                : "Failed to switch to Sonic Blaze Testnet. Please verify the network details and try again."
            );
          }

          // Get updated provider after network switch
          provider = new ethers.BrowserProvider(window.ethereum);
        }

        console.log("Loading NFTs for wallet:", user.walletAddress);

        // Get user's NFTs
        const userSessions = await getUserSessions(
          provider,
          user.walletAddress
        );

        // Map the sessions to our Token interface
        const mappedSessions = userSessions.map((session) => ({
          id: session.sessionId,
          sessionId: session.sessionId,
          imageUri: session.imageUri,
          metadata: session.metadata,
        }));

        setSessions(mappedSessions);
      } catch (error) {
        console.error("Error loading NFTs:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load NFTs. Please try again."
        );
      } finally {
        setIsLoadingNFTs(false);
      }
    };

    loadNFTs();
  }, [isAuthenticated, user?.walletAddress]);

  if (isLoading || isLoadingNFTs) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center mt-16">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <div className="text-center">
            <p className="font-medium">Loading your NFTs...</p>
            <p className="text-sm text-muted-foreground">
              This may take a moment
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center mt-16">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">
            Please sign in to continue
          </h2>
          <p className="text-muted-foreground mb-6">
            You need to be authenticated and connect your wallet to view your
            NFTs.
          </p>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Make sure to connect your Web3 wallet after signing in.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center mt-16">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4 text-red-500">
            Error Loading NFTs
          </h2>
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={() => window.location.reload()} className="w-full">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="flex h-[calc(100vh-4rem)] mt-20">
          {/* Left sidebar */}
          <div className="w-[280px] border-r shrink-0">
            <div className="p-4 space-y-4">
              <h2 className="font-semibold">NFT Collection</h2>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/dashboard")}
              >
                <Trophy className="w-4 h-4 mr-2" />
                Return to Dashboard
              </Button>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="space-y-8">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                  Your Growth Journey ✨
                </h1>
                <p className="text-muted-foreground">
                  Each NFT represents a meaningful therapy session and milestone
                  in your personal growth journey.
                </p>
              </div>

              {sessions.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {sessions.map((session) => (
                    <NFTCard
                      key={session.sessionId}
                      token={session}
                      onShare={() =>
                        handleShare(
                          "My Therapy Journey ✨",
                          "I've reached a new milestone in my mental wellness journey! 🌱"
                        )
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <Trophy className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No NFTs Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Complete a therapy session to earn your first achievement
                    NFT.
                  </p>
                  <Button onClick={() => router.push("/therapy")}>
                    Start New Session
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
