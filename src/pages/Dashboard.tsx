import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import FoodGrid from "../components/FoodGrid";
import OrderPanel from "../components/OrderPanel";
import ManageFood from "../components/food/ManageFood";
import Overview from "../components/Overview";
import CheckoutHistory from "../components/CheckoutHistory";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Menu");
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case "Overview":
        return <Overview />;
      case "Menu":
        return <FoodGrid sidebarExpanded={sidebarExpanded} />;
      case "History":
        return <CheckoutHistory />;
      case "Manage Food":
        return <ManageFood />;
      case "Testimonials":
        return <div className="text-lg font-semibold">Testimonials Content</div>;
      case "FAQ":
        return <div className="text-lg font-semibold">FAQ Content</div>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex overflow-hidden relative">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setIsExpanded={setSidebarExpanded}
      />

      <main
        className={`
          flex-1 p-4 md:p-6 overflow-y-auto h-screen hide-scrollbar transition-all duration-300
          ${sidebarExpanded && activeTab === "Menu" ? "lg:ml-64" : "lg:ml-20"}
          ${activeTab === "Menu" ? "lg:mr-[400px]" : "lg:mr-10"}
          w-full
        `}
      >
        {/* Header container */}
        <div
          className={`
            ${activeTab === "Menu" ? "" : "flex justify-center"}
            w-full
          `}
        >
          {activeTab === "Menu" && <Header />}
         
        </div>

        <div className="mt-4">{renderContent()}</div>
      </main>

      {/* Show OrderPanel only in Menu tab */}
      {activeTab === "Menu" && <OrderPanel />}
    </div>
  );
};

export default Dashboard;
