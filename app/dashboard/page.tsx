"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Newspaper,
  Building2,
  FileText,
  Menu,
  Globe,
  Settings,
  ChevronDown,
  Blocks,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import News from "@/src/components/Dashboard/News";
import Comunicati from "@/src/components/Dashboard/Comunicati";
import Sedi from "@/src/components/Dashboard/Sedi";
import Users from "@/src/components/Dashboard/Utenti";
import Webinar from "@/src/components/Dashboard/Webinar";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeComponent, setActiveComponent] = useState("news");
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [openSection, setOpenSection] = useState(["website", "platform"]);

  const menuItems = {
    website: {
      label: "Sito Web",
      icon: <Globe className="w-4 h-4" />,
      items: [
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
      ],
    },
    platform: {
      label: "Piattaforma",
      icon: <Settings className="w-4 h-4" />,
      items: [
        {
          icon: <LayoutDashboard className="w-4 h-4" />,
          label: "Utenti",
          id: "utenti",
        },
        {
          icon: <Blocks className="w-4 h-4" />,
          label: "Webinar",
          id: "webinar",
        },
      ],
    },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === "SNALV_Gamma_12") {
      setLoggedIn(true);
    }
  };

  const toggleSection = (section) => {
    setOpenSection((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "news":
        return <News />;
      case "press":
        return <Comunicati />;
      case "locations":
        return <Sedi />;
      case "utenti":
        return <Users />;
      case "webinar":
        return <Webinar />;
      default:
        return <News />;
    }
  };

  /* 
  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white p-8 rounded-xl shadow-lg space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-gray-900">
                Area Riservata
              </h2>
              <p className="text-gray-500">Accedi al pannello di controllo</p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Inserisci la password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Accedi
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }
  */

  return (
    <div className="flex h-screen bg-gray-50">
      <aside
        className={`
          ${isSidebarOpen ? "w-64" : "w-20"} 
          bg-white shadow-lg transition-all duration-300 p-4
          flex flex-col
        `}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={`font-bold text-xl ${!isSidebarOpen && "hidden"}`}>
            Dashboard
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

        <nav className="flex-1 space-y-4">
          {Object.entries(menuItems).map(([key, section]) => (
            <Collapsible
              key={key}
              open={openSection.includes(key)}
              onOpenChange={() => toggleSection(key)}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center gap-2">
                  {section.icon}
                  <span className={!isSidebarOpen ? "hidden" : ""}>
                    {section.label}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    openSection.includes(key) ? "transform rotate-180" : ""
                  } ${!isSidebarOpen ? "hidden" : ""}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1 space-y-1">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveComponent(item.id)}
                    className={`
                      w-full flex items-center gap-3 p-3 rounded-lg 
                      transition-colors text-sm
                      ${
                        activeComponent === item.id
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                  >
                    {item.icon}
                    <span className={!isSidebarOpen ? "hidden" : ""}>
                      {item.label}
                    </span>
                  </button>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-full mx-auto">{renderComponent()}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
