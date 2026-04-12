import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ListPage from "./pages/ListPage";
import DetailPage from "./pages/DetailPage";
import AssistantPage from "./pages/AssistantPage";
import { MainLayout } from "./components/chat/MainLayout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Full-screen standalone page — no Header, no chatbot button */}
          <Route path="/assistant" element={<AssistantPage />} />

          {/* Standard pages with Header + floating chatbot */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<ListPage />} />
            <Route path="/property/:id" element={<DetailPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
