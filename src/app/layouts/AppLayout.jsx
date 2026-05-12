import { Outlet, useLocation } from "react-router-dom";
import MobileBottomNav from "../../shared/components/navigation/MobileBottomNav";

function AppLayout() {
  const location = useLocation();

  const showBottomNav = location.pathname === "/";

  return (
    <div className="min-h-screen bg-black text-white">
      {/* PAGE CONTENT */}
      <main className="pb-24">
        <Outlet />
      </main>

      {/* MOBILE NAV (ONLY HOME) */}
      {showBottomNav && <MobileBottomNav />}
    </div>
  );
}

export default AppLayout;