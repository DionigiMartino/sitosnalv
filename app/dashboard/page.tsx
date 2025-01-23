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
import Sedi from "@/src/components/Dashboard/Sedi";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeComponent, setActiveComponent] = useState("news");
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");

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

  const handleSubmit = () => {
    if (password === "SNALV_Gamma_12") {
      setLoggedIn(true);
    }
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "news":
        return <News />;
      case "press":
        // Quando creerai il componente dei comunicati stampa
        return <Comunicati />;
      case "locations":
        // Quando creerai il componente delle sedi
        return <Sedi />;
      default:
        return <News />;
    }
  };

  return (
    <div className={`flex h-screen bg-gray-100`}>
      {!loggedIn ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Area Riservata
              </h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Accedi
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <>
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

          <main className="flex-1 p-8 overflow-auto">{renderComponent()}</main>
        </>
      )}
    </div>
  );
};

export default DashboardLayout;
