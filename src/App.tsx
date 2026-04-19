import { useEffect } from "react";
import { BrowserRouter, Outlet, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "./store/authStore";
import AuthGuard from "./components/AuthGuard";
import { MainLayout } from "./components/chat/MainLayout";
import ListPage from "./pages/ListPage";
import DetailPage from "./pages/DetailPage";
import AssistantPage from "./pages/AssistantPage";
import DepositSuccessPage from "./pages/DepositSuccessPage";
import DepositCancelPage from "./pages/DepositCancelPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function AuthInitializer() {
  const initialize = useAuthStore((s) => s.initialize);
  useEffect(() => { initialize(); }, [initialize]);
  return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthInitializer />
        <Routes>
          {/* Public auth pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Public pages — Header + floating chatbot */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<ListPage />} />
            <Route path="/property/:id" element={<DetailPage />} />
          </Route>

          {/* Protected pages */}
          <Route element={<AuthGuard><Outlet /></AuthGuard>}>
            <Route path="/assistant" element={<AssistantPage />} />
            <Route path="/deposit/success" element={<DepositSuccessPage />} />
            <Route path="/deposit/cancel" element={<DepositCancelPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
