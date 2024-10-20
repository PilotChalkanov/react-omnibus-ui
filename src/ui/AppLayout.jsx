import { Outlet } from "react-router-dom";

import Nav from "./Nav";
import Sidebar from "./Sidebar";
import Alert from "../features/alert/Alert";

function AppLayout() {
  return (
    <div className="h-screen grid grid-rows-[auto_1fr] bg-white">
      <Nav />
      {/* Main content area with sidebar and main content outlet */}
      <div className="grid grid-cols-[auto_1fr]">
        <Sidebar />
        <div className="px-8 py-6">
          <Alert />
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
