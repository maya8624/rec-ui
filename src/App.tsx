import { BrowserRouter, Outlet, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import AuthGuard from "./components/AuthGuard";
import { MainLayout } from "./components/layout/MainLayout";
import ListPage from "./pages/ListPage";
import DetailPage from "./pages/DetailPage";
import AssistantPage from "./pages/AssistantPage";
import DepositSuccessPage from "./pages/DepositSuccessPage";
import DepositCancelPage from "./pages/DepositCancelPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CopilotPage from "./pages/copilot/CopilotPage";
import AgentDashboard from "./pages/agent/AgentDashboard";
import { ErrorBoundary } from "./components/ErrorBoundary";


export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
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
            <Route path="/copilot" element={<ErrorBoundary><CopilotPage /></ErrorBoundary>} />
            <Route path="/agent" element={<ErrorBoundary><AgentDashboard /></ErrorBoundary>} />
            <Route path="/deposit/success" element={<DepositSuccessPage />} />
            <Route path="/deposit/cancel" element={<DepositCancelPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
