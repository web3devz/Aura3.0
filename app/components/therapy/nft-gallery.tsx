"use client";

import { useState } from "react";
import { SessionNFT } from "./session-nft";
import { Button } from "@/components/ui/button";
import { Grid3X3, List, AlertCircle, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface NFTGalleryProps {
  sessions: Array<{
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
  }>;
}

export function NFTGallery({ sessions }: NFTGalleryProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [error, setError] = useState<string | null>(null);

  const handleShare = async (sessionId: string) => {
    try {
      await navigator.share({
        title: "My Therapy Session NFT ✨",
        text: "Check out my therapy session achievement! 🌟",
        url: `${window.location.origin}/therapy/nft/${sessionId}`,
      });
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        setError("Failed to share NFT. Please try again.");
      }
    }
  };

  const handleDownload = async (imageUri: string) => {
    try {
      setError(null);
      const response = await fetch(
        imageUri.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")
      );

      if (!response.ok) {
        throw new Error("Failed to download image");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "therapy-session-nft.png";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading:", error);
      setError("Failed to download NFT. Please try again.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 blur-3xl -z-10" />
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Your Session NFTs ✨
            </h2>
            <p className="text-muted-foreground mt-1">
              Each NFT represents a milestone in your therapy journey 🌟
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="bg-white/50 backdrop-blur-sm hover:bg-white/75 dark:bg-gray-950/50 dark:hover:bg-gray-950/75"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="bg-white/50 backdrop-blur-sm hover:bg-white/75 dark:bg-gray-950/50 dark:hover:bg-gray-950/75"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          layout
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-6"
          }
        >
          {sessions.map((session, index) => (
            <motion.div
              key={session.sessionId}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <SessionNFT
                sessionId={session.sessionId}
                imageUri={session.imageUri}
                metadata={session.metadata}
                onShare={() => handleShare(session.sessionId)}
                onDownload={() => handleDownload(session.imageUri)}
              />
            </motion.div>
          ))}

          {sessions.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-16"
            >
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Trophy className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">No NFTs Yet 🎨</h3>
                <p className="text-muted-foreground">
                  Complete therapy sessions to earn special NFTs that mark your
                  progress 🌟
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => (window.location.href = "/therapy")}
                >
                  Start a New Session ✨
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
