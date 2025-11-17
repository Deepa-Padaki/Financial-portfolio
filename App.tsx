import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import Stock from "./pages/Stock";
import Trade from "./pages/Trade";
import TradeSearch from "./pages/TradeSearch";
import Orders from "./pages/Orders";
import Watchlist from "./pages/Watchlist";
import Alerts from "./pages/Alerts";
import News from "./pages/News";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Help from "./pages/Help";
import Accounts from "./pages/Accounts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
              <Route path="/stock/:symbol" element={<ProtectedRoute><Stock /></ProtectedRoute>} />
              <Route path="/trade" element={<ProtectedRoute><TradeSearch /></ProtectedRoute>} />
              <Route path="/trade/:symbol" element={<ProtectedRoute><Trade /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
              <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
              <Route path="/news" element={<ProtectedRoute><News /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />
              <Route path="/accounts" element={<ProtectedRoute><Accounts /></ProtectedRoute>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
