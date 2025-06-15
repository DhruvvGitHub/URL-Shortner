import React from "react";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      <main className="min-h-screen container">
        {/* Header  */}
        <Outlet />
      </main>

      <div>Made with ❤️ by Dhruv</div>
      {/* Footer  */}
    </div>
  );
};

export default AppLayout;
