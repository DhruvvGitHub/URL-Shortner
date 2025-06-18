import Header from "@/components/Header";
import React from "react";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="min-h-screen w-full flex flex-col justify-between">
      <main className="w-full">
        <Header />
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-7xl mx-auto my-6">Made with ❤️ by Dhruv</div>
      {/* Footer  */}
    </div>
  );
};

export default AppLayout;
