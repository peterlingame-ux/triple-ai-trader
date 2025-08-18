import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./hooks/useLanguage";
import { AutoTraderProvider } from "./hooks/useWalletData";
import { OptimizedErrorBoundary } from "./components/OptimizedErrorBoundary";
import { errorRecoverySystem } from "./utils/errorRecovery";
import { useEffect } from "react";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Management from "./pages/Management";
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
          <AutoTraderProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/management" element={<Management />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </AutoTraderProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </OptimizedErrorBoundary>
  );
};

export default App;