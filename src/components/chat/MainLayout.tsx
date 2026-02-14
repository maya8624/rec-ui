import { Outlet } from "react-router-dom";
import Header from "../Header";
import ChatbotButton from "./ChatbotButton";
import { ChatPanel } from "./ChatPanel";
import { useState } from "react";

export const MainLayout = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <Header />
      <main>
        <Outlet />
      </main>
      {!isChatOpen && (
        <ChatbotButton onClick={() => setIsChatOpen(true)} />
      )}
      <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};
