
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Residents from "./pages/Residents";
import Visitors from "./pages/Visitors";
import Guards from "./pages/Guards";
import Vendors from "./pages/Vendors";
import BookkeepingAccounts from "./pages/BookkeepingAccounts";
import BookkeepingByelaws from "./pages/BookkeepingByelaws";
import BookkeepingMinutes from "./pages/BookkeepingMinutes";
import FinanceChat from "./pages/FinanceChat";
import WhatsAppIntegration from "./pages/WhatsAppIntegration";
import DomesticHelp from "./pages/DomesticHelp";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/residents" element={<Residents />} />
          <Route path="/visitors" element={<Visitors />} />
          <Route path="/guards" element={<Guards />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/bookkeeping/accounts" element={<BookkeepingAccounts />} />
          <Route path="/bookkeeping/bye-laws" element={<BookkeepingByelaws />} />
          <Route path="/bookkeeping/gbm-minutes" element={<BookkeepingMinutes />} />
          <Route path="/finance-chat" element={<FinanceChat />} />
          <Route path="/whatsapp-integration" element={<WhatsAppIntegration />} />
          <Route path="/domestic-help" element={<DomesticHelp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
