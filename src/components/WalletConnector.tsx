import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Wallet, Copy, ExternalLink, CheckCircle, AlertCircle, Coins, TrendingUp } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";

interface WalletInfo {
  address: string;
  balance: string;
  network: string;
  connected: boolean;
}

export const WalletConnector = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if wallet was previously connected
    const savedWallet = localStorage.getItem('connectedWallet');
    if (savedWallet) {
      setWallet(JSON.parse(savedWallet));
    }
  }, []);

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask to connect your wallet.",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        const address = accounts[0];
        
        // Get balance
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest'],
        });

        // Convert Wei to ETH
        const ethBalance = (parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4);

        const walletInfo: WalletInfo = {
          address,
          balance: `${ethBalance} ETH`,
          network: "Ethereum",
          connected: true,
        };

        setWallet(walletInfo);
        localStorage.setItem('connectedWallet', JSON.stringify(walletInfo));
        
        toast({
          title: "Wallet Connected",
          description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
        });
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to your wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWallet(null);
    localStorage.removeItem('connectedWallet');
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  const copyAddress = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard.",
      });
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className={`flex items-center gap-2 px-4 py-2 ${
            wallet?.connected 
              ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20' 
              : 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20'
          }`}
        >
          <Wallet className="w-4 h-4" />
          {wallet?.connected ? formatAddress(wallet.address) : "Connect Wallet"}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            {wallet?.connected ? "Wallet Connected" : "Connect Your Wallet"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {wallet?.connected ? (
            <div className="space-y-4">
              {/* Wallet Info Card */}
              <Card className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Wallet Connected</p>
                    <p className="text-green-400 text-sm">{wallet.network}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Address:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm font-mono">
                        {formatAddress(wallet.address)}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={copyAddress}
                        className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Balance:</span>
                    <span className="text-white font-medium">{wallet.balance}</span>
                  </div>
                </div>
              </Card>

              {/* Portfolio Summary */}
              <Card className="p-4 bg-slate-800/50 border-slate-700">
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Portfolio Summary
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-slate-400 text-xs">Total Value</p>
                    <p className="text-white font-bold">$2,847.65</p>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-400 text-xs">24h Change</p>
                    <p className="text-green-400 font-bold">+3.24%</p>
                  </div>
                </div>
              </Card>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => window.open(`https://etherscan.io/address/${wallet.address}`, '_blank')}
                  className="flex-1 text-sm"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View on Explorer
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={disconnectWallet}
                  className="flex-1 text-sm"
                >
                  Disconnect
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Wallet className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-white font-medium mb-2">Connect Your Wallet</h3>
                <p className="text-slate-400 text-sm">
                  Connect your wallet to start trading and managing your portfolio
                </p>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={connectMetaMask}
                  disabled={isConnecting}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {isConnecting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Wallet className="w-4 h-4 mr-2" />
                      Connect MetaMask
                    </>
                  )}
                </Button>
                
                <div className="text-center">
                  <p className="text-slate-500 text-xs">
                    By connecting your wallet, you agree to our Terms of Service
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};