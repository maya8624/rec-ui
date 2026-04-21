import { Outlet } from "react-router-dom";
import Header from "../Header";

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-800 transition-colors">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};
