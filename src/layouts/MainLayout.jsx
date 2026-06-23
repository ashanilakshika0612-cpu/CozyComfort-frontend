
import { Outlet } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import AppSidebar from "../components/AppSidebar";

const MainLayout = () => {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1 px-3 py-3">
          <Outlet /> {/* Page content මෙතනට load වෙනවා */}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
