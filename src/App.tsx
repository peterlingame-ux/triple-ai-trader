import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./hooks/useLanguage";
import { WalletProvider } from "./hooks/useWalletData";
import { OptimizedErrorBoundary } from "./components/OptimizedErrorBoundary";
import { errorRecoverySystem } from "./utils/errorRecovery";
import { useEffect } from "react";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Initialize the error recovery system
  useEffect(() => {
    errorRecoverySystem.initialize();
  }, []);

  return (
    <OptimizedErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <WalletProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </WalletProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </OptimizedErrorBoundary>
  );
};

export default App;