import React, { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import Index from "./pages/Index";
import Residents from "./pages/Residents";
import Visitors from "./pages/Visitors";
import Guards from "./pages/Guards";
import Vendors from "./pages/Vendors";
import BookkeepingAccounts from "./pages/BookkeepingAccounts";
import BookkeepingByelaws from "./pages/BookkeepingByelaws";
import BookkeepingMinutes from "./pages/BookkeepingMinutes";
import BookkeepingPayments from "./pages/BookkeepingPayments";
import FinanceChat from "./pages/FinanceChat";
import WhatsAppIntegration from "./pages/WhatsAppIntegration";
import DomesticHelp from "./pages/DomesticHelp";
import UserManagement from "./pages/UserManagement";
import NotFound from "./pages/NotFound";
import TestPage from "./pages/TestPage";

const queryClient = new QueryClient();

const App = () => {
  console.log('App component rendering');
  return (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/test" element={<Suspense fallback={<div>Loading...</div>}>
              <TestPage />
            </Suspense>} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            
            <Route path="/residents" element={
              <ProtectedRoute 
                requiredPermissions={[
                  'one_time_entry_of_data', 
                  'manage_ownership', 
                  'manage_flat_living_status',
                  'approve_manage_tenants'
                ]}
              >
                <Residents />
              </ProtectedRoute>
            } />
            
            <Route path="/visitors" element={
              <ProtectedRoute 
                requiredPermissions={[
                  'approve_manage_short_stay_visitor', 
                  'approve_manage_long_stay_visitor',
                  'enter_manage_visitor'
                ]}
              >
                <Visitors />
              </ProtectedRoute>
            } />
            
            <Route path="/guards" element={
              <ProtectedRoute 
                requiredRoles={['Super Admin', 'Admin']}
              >
                <Guards />
              </ProtectedRoute>
            } />
            
            <Route path="/vendors" element={
              <ProtectedRoute 
                requiredRoles={['Super Admin', 'Admin']}
              >
                <Vendors />
              </ProtectedRoute>
            } />
            
            <Route path="/bookkeeping/accounts" element={
              <ProtectedRoute 
                requiredRoles={['Super Admin', 'Admin']}
              >
                <BookkeepingAccounts />
              </ProtectedRoute>
            } />
            
            <Route path="/bookkeeping/bye-laws" element={
              <ProtectedRoute 
                requiredRoles={['Super Admin', 'Admin']}
              >
                <BookkeepingByelaws />
              </ProtectedRoute>
            } />
            
            <Route path="/bookkeeping/gbm-minutes" element={
              <ProtectedRoute 
                requiredRoles={['Super Admin', 'Admin']}
              >
                <BookkeepingMinutes />
              </ProtectedRoute>
            } />
            
            <Route path="/bookkeeping/payments" element={
              <ProtectedRoute 
                requiredRoles={['Super Admin', 'Admin']}
              >
                <BookkeepingPayments />
              </ProtectedRoute>
            } />
            
            <Route path="/finance-chat" element={
              <ProtectedRoute 
                requiredRoles={['Super Admin', 'Admin']}
              >
                <FinanceChat />
              </ProtectedRoute>
            } />
            
            <Route path="/whatsapp-integration" element={
              <ProtectedRoute 
                requiredRoles={['Super Admin', 'Admin']}
              >
                <WhatsAppIntegration />
              </ProtectedRoute>
            } />
            
            <Route path="/domestic-help" element={
              <ProtectedRoute 
                requiredPermissions={[
                  'approve_manage_service_staff',
                  'enter_record_service_staff'
                ]}
              >
                <DomesticHelp />
              </ProtectedRoute>
            } />
            
            <Route path="/user-management" element={
              <ProtectedRoute 
                requiredRoles={['Super Admin']}
              >
                <UserManagement />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
  );
};

export default App;
