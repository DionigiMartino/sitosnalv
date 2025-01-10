"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Newspaper,
  Building2,
  FileText,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import News from "@/src/components/Dashboard/News";
import Comunicati from "@/src/components/Dashboard/Comunicati";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeComponent, setActiveComponent] = useState("news"); // Default to news

  const menuItems = [
    {
      icon: <Newspaper className="w-4 h-4" />,
      label: "Notizie",
      id: "news",
    },
    {
      icon: <FileText className="w-4 h-4" />,
      label: "Comunicati Stampa",
      id: "press",
    },
    {
      icon: <Building2 className="w-4 h-4" />,
      label: "Sedi",
      id: "locations",
    },
  ];

  const renderComponent = () => {
    switch (activeComponent) {
      case "news":
        return <News />;
      case "press":
        // Quando creerai il componente dei comunicati stampa
        return <Comunicati />;
      case "locations":
        // Quando creerai il componente delle sedi
        return <div>Sedi Component</div>;
      default:
        return <News />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`
        ${isSidebarOpen ? "w-64" : "w-20"} 
        bg-white border-r transition-all duration-300 p-4
      `}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={`font-bold text-xl ${!isSidebarOpen && "hidden"}`}>
            Pannello di Controllo
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        <Separator className="my-4" />

        <nav>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveComponent(item.id)}
              className={`
                w-full flex items-center gap-3 p-3 rounded-lg 
                transition-colors
                ${
                  activeComponent === item.id
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-50"
                }
              `}
            >
              {item.icon}
              <span className={!isSidebarOpen ? "hidden" : ""}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">{renderComponent()}</main>
    </div>
  );
};

export default DashboardLayout;
