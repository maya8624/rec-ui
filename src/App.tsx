import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "./components/Header";
import ListPage from "./pages/ListPage";
import DetailPage from "./pages/DetailPage";
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
  // const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* <Header /> */}
        <Routes>
          <Route element={<MainLayout />}>
            {/* <Route path="/chat" element={<AssistantPage />} /> */}
            <Route path="/" element={<ListPage />} />
            <Route path="/property/:id" element={<DetailPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
