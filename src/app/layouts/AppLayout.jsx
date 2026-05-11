import { Outlet } from "react-router-dom";

import MobileBottomNav from "../../shared/components/navigation/MobileBottomNav";

function AppLayout() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* PAGE CONTENT */}
      <main className="pb-24">
        <Outlet />
      </main>

      {/* MOBILE NAV */}
      <MobileBottomNav />
    </div>
  );
}

export default AppLayout;