"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import NewsComponent from "@/src/components/CategoryNews";
import { Button } from "@/components/ui/button";
import { FiSearch } from "react-icons/fi";
import HeroSection from "@/src/components/Hero";
import Image from "next/image";

const ComunicatiPage = () => {
  const [activeSection, setActiveSection] = useState("comunicati");
  const [activeFilter, setActiveFilter] = useState("");

  const menuItems = [
    { id: "comunicati", label: "Comunicati stampa" },
    { id: "notizie", label: "Notizie" },
  ];

  const filters = [
    { id: "territorio", label: "Territorio" },
    { id: "sociosanitario", label: "Sociosanitario" },
    { id: "fragili", label: "Fragili" },
    { id: "entilocali", label: "Enti Locali" },
    { id: "servizi", label: "Servizi" },
    { id: "evidenza", label: "In evidenza" },
  ];

  const comunicatiData = [
    {
      id: 1,
      title: "Nuovo contratto settore socio-sanitario",
      date: "10 NOVEMBRE",
      description:
        "Lorem ipsum dolor sit amet, adipisicing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna",
      image: "/img/sede.jpg",
      category: "sociosanitario",
      featured: true,
    },
    {
      id: 2,
      title: "Tutele per i lavoratori fragili",
      date: "8 NOVEMBRE",
      description:
        "Lorem ipsum dolor sit amet, adipisicing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna",
      image: "/img/sede.jpg",
      category: "fragili",
    },
    {
      id: 3,
      title: "Nuova sede territoriale a Milano",
      date: "7 NOVEMBRE",
      description:
        "Lorem ipsum dolor sit amet, adipisicing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna",
      image: "/img/sede.jpg",
      category: "territorio",
    },
  ];

  const notizieData = [
    {
      id: 1,
      title: "Rinnovo contratto enti locali",
      date: "10 NOVEMBRE",
      description:
        "Lorem ipsum dolor sit amet, adipisicing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna",
      image: "/img/sede.jpg",
      category: "entilocali",
      featured: true,
    },
    {
      id: 2,
      title: "Nuovi servizi per gli iscritti",
      date: "9 NOVEMBRE",
      description:
        "Lorem ipsum dolor sit amet, adipisicing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna",
      image: "/img/sede.jpg",
      category: "servizi",
    },
  ];

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(window.location.search);

    if (hash) {
      setActiveSection(hash);
    }

    const filter = params.get("filter");
    if (filter) {
      setActiveFilter(filter);
    }
  }, []);

  const updateURL = (section: any, filter: any) => {
    // @ts-ignore

    const url = new URL(window.location);
    url.hash = section;

    if (filter) {
      url.searchParams.set("filter", filter);
    } else {
      url.searchParams.delete("filter");
    }

    window.history.pushState({}, "", url);
  };

  const handleSectionChange = (section: any) => {
    setActiveSection(section);
    // @ts-ignore
    const url = new URL(window.location);
    url.hash = section;
    window.history.pushState({}, "", url.toString());
  };

  const handleFilterChange = (filter: any) => {
    setActiveFilter(filter);
    updateURL(activeSection, filter);
  };

  // Separate sections
  const ComunicatiSection = () => {
    const filteredComunicati = activeFilter
      ? activeFilter === "evidenza"
        ? comunicatiData.filter((com) => com.featured)
        : comunicatiData.filter((com) => com.category === activeFilter)
      : comunicatiData;

    return (
      <div>
        <h1 className="text-[#1a365d] text-4xl font-bold mb-8">
          COMUNICATI STAMPA
        </h1>
        <div className="grid gap-8">
          {filteredComunicati.map((comunicato) => (
            <div
              key={comunicato.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm"
            >
              <div className="grid grid-cols-3">
                <div className="relative h-64">
                  <Image
                    src={comunicato.image}
                    alt={comunicato.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 left-4 bg-blue-600 text-white font-bold px-3 py-3 text-sm">
                    {comunicato.date}
                  </div>
                  {comunicato.featured && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 text-sm">
                      In evidenza
                    </div>
                  )}
                </div>
                <div className="col-span-2 p-6">
                  <h2 className="text-xl font-bold mb-4">{comunicato.title}</h2>
                  <p className="text-gray-600 mb-6">{comunicato.description}</p>
                  <Button className="bg-red-400 hover:bg-red-600">
                    LEARN MORE
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const NotizieSection = () => {
    const filteredNotizie = activeFilter
      ? activeFilter === "evidenza"
        ? notizieData.filter((news) => news.featured)
        : notizieData.filter((news) => news.category === activeFilter)
      : notizieData;

    return (
      <div>
        <h1 className="text-[#1a365d] text-4xl font-bold mb-8">NOTIZIE</h1>
        <div className="grid gap-8">
          {filteredNotizie.map((notizia) => (
            <div
              key={notizia.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm"
            >
              <div className="grid grid-cols-3">
                <div className="relative h-64">
                  <Image
                    src={notizia.image}
                    alt={notizia.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 left-4 bg-blue-600 text-white font-bold px-3 py-3 text-sm">
                    {notizia.date}
                  </div>
                  {notizia.featured && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 text-sm">
                      In evidenza
                    </div>
                  )}
                </div>
                <div className="col-span-2 p-6">
                  <h2 className="text-xl font-bold mb-4">{notizia.title}</h2>
                  <p className="text-gray-600 mb-6">{notizia.description}</p>
                  <Button className="bg-red-400 hover:bg-red-600">
                    LEARN MORE
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case "comunicati":
        return <ComunicatiSection />;
      case "notizie":
        return <NotizieSection />;
      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <HeroSection section={activeSection} />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="lg:grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-8">
            {/* Menu Sections */}
            <div className="bg-gray-100 p-4 rounded-lg">
              {menuItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`py-4 ${
                    index === 0
                      ? "border-b-2 border-red-500"
                      : "border-b-2 border-red-500"
                  }`}
                >
                  <Button
                    variant="ghost"
                    className={`w-full hover:font-bold justify-start text-left ${
                      activeSection === item.id
                        ? "text-red-500 font-bold"
                        : "text-gray-700"
                    }`}
                    onClick={() => handleSectionChange(item.id)}
                  >
                    {item.label}
                  </Button>
                </div>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Input type="text" placeholder="CERCA" className="w-full pl-10" />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Filters */}
            <div>
              <Button
                variant="ghost"
                className="w-full text-left mb-4 justify-start"
              >
                + Filtri
              </Button>
              {activeFilter && (
                <Button
                  variant="ghost"
                  className="text-red-500 hover:text-red-600"
                  onClick={() => handleFilterChange("")}
                >
                  Reset filtri
                </Button>
              )}
              <div className="flex flex-col gap-3">
                {filters.map((filter) => (
                  <Button
                    key={filter.id}
                    variant="ghost"
                    className={`bg-gray-100 hover:bg-gray-200 rounded-lg px-4 text-md py-3 text-left justify-start ${
                      activeFilter === filter.id ? "bg-gray-200" : ""
                    }`}
                    onClick={() => handleFilterChange(filter.id)}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-3">{renderContent()}</div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ComunicatiPage;
