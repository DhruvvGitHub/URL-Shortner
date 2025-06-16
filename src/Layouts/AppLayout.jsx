import Header from "@/components/Header";
import React from "react";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      <main className="min-h-screen container">
        <Header />
        <div className="px-8">
          <Outlet />
        </div>
      </main>

      <div>Made with ❤️ by Dhruv</div>
      {/* Footer  */}
    </div>
  );
};

export default AppLayout;
