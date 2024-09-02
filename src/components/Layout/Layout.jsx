import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import { useFollowerContext } from "../../Utils/Context/Context";

const MainLayout = ({ children }) => {
  const { profileData } = useFollowerContext();
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-grow">
        {profileData?.role !== "AGENT" && <Sidebar />}
        <div className="flex-grow p-4 bg-gray-50 relative">{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
