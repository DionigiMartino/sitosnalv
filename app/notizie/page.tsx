"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { Button } from "@/components/ui/button";
import { FiSearch } from "react-icons/fi";
import HeroSection from "@/src/components/Hero";
import Image from "next/image";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";

const ComunicatiPage = () => {
  const [activeSection, setActiveSection] = useState("comunicati");
  const [activeFilter, setActiveFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const menuItems = [
    { id: "comunicati", label: "Comunicati stampa" },
    { id: "notizie", label: "Notizie" },
  ];

  const filters = [
    { id: "Fragili", label: "Fragili" },
    { id: "Socio Sanitario", label: "Socio Sanitario" },
    { id: "Enti Locali", label: "Enti Locali" },
    { id: "Dipartimento SUD", label: "Dipartimento SUD" },
    { id: "Servizi", label: "Servizi" },
    { id: "In Evidenza", label: "In Evidenza" },
    { id: "Territorio", label: "Territorio" },
  ];

  // Modifica la funzione processContent per gestire i video di YouTube
  const processContent = (text) => {
    if (!text) return "";

    // Per l'anteprima, sostituisci il video con un testo
    let processedContent = text.replace(
      /{youtube:(https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+|https?:\/\/youtu\.be\/[\w-]+)}/g,
      '<div class="text-gray-500 italic">[Contiene video YouTube]</div>'
    );

    // Processa il resto del contenuto come prima...
    processedContent = processedContent.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-red-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    processedContent = processedContent.replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>"
    );
    processedContent = processedContent.replace(/\*(.*?)\*/g, "<em>$1</em>");
    processedContent = processedContent.replace(/__(.*?)__/g, "<u>$1</u>");
    processedContent = processedContent.replace(/\n/g, "<br />");

    return processedContent;
  };

  useEffect(() => {
    fetchPosts();
  }, [activeSection, searchTerm]); // Rifetch quando cambia la sezione

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

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      // Se c'è un termine di ricerca, fetchiamo da entrambe le collezioni
      if (searchTerm) {
        const comunicatiQuery = query(
          collection(db, "comunicati"),
          orderBy("createdAt", "desc")
        );
        const notizieQuery = query(
          collection(db, "notizie"),
          orderBy("createdAt", "desc")
        );

        const [comunicatiSnapshot, notizieSnapshot] = await Promise.all([
          getDocs(comunicatiQuery),
          getDocs(notizieQuery),
        ]);

        const comunicatiData = comunicatiSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          tipo: "comunicato",
        }));

        const notizieData = notizieSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          tipo: "notizia",
        }));

        setPosts([...comunicatiData, ...notizieData]);
      } else {
        // Se non c'è termine di ricerca, manteniamo il comportamento originale
        const collectionName =
          activeSection === "comunicati" ? "comunicati" : "notizie";
        const tipo = activeSection === "comunicati" ? "comunicato" : "notizia";

        const postsQuery = query(
          collection(db, collectionName),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(postsQuery);
        const postsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          tipo,
        }));

        setPosts(postsData);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date)
      .toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      .toUpperCase();
  };

  const updateURL = (section, filter) => {
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

  const handleSectionChange = (section) => {
    setActiveSection(section);
    // @ts-ignore
    const url = new URL(window.location);
    url.hash = section;
    window.history.pushState({}, "", url.toString());
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    updateURL(activeSection, filter);
  };

  const filterPosts = () => {
    const now = new Date(); // Data e ora attuale

    // Prima filtriamo per data e ora
    let filtered = posts.filter((post) => {
      if (!post.createdAt) return true; // Se non c'è data, lo mostriamo

      const postDateTime = new Date(post.createdAt);

      // Confrontiamo timestamp completi (data + ora)
      return postDateTime.getTime() <= now.getTime();
    });

    // Poi applichiamo gli altri filtri
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.content?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeFilter) {
      filtered = filtered.filter((item) =>
        item.categories?.includes(activeFilter)
      );
    }

    return filtered;
  };

  const PostsSection = () => {
    const filteredPosts = filterPosts();

    if (isLoading) {
      return <div className="text-center py-8">Caricamento...</div>;
    }

    if (filteredPosts.length === 0) {
      return (
        <div className="text-center py-8">
          {activeSection === "comunicati"
            ? "Nessun comunicato"
            : "Nessuna notizia"}{" "}
        </div>
      );
    }

    return (
      <div>
        <h1 className="text-[#1a365d] text-4xl font-bold mb-8">
          {activeSection === "comunicati" ? "COMUNICATI STAMPA" : "NOTIZIE"}
        </h1>
        <div className="grid gap-8">
          {filteredPosts.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg overflow-hidden shadow-md"
            >
              <div className="grid grid-cols-3">
                <div className="relative ">
                  <Image
                    src={item.coverImage || "/img/logo.jpg"}
                    alt={item.title}
                    fill
                    className={`${
                      item.coverImage ? "object-cover" : "object-contain"
                    }`}
                  />
                  <div className="absolute bottom-0 left-4 bg-blue-600 text-white font-bold px-3 py-3 text-sm">
                    {formatDate(item.createdAt)}
                  </div>
                  {item.categories?.includes("In Evidenza") && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 text-sm">
                      In evidenza
                    </div>
                  )}
                </div>
                <div className="col-span-2 p-6">
                  <h2 className="text-xl font-bold mb-2 text-blue-600">
                    {item.title}
                  </h2>
                  <h3 className="text-sm font-medium mb-6 text-gray-400">
                    {item.categories.join(", ")}
                  </h3>
                  <div
                    className="text-gray-600 mb-6 line-clamp-3 prose max-w-none whitespace-pre-wrap"
                    style={{ whiteSpace: "pre-wrap" }}
                    dangerouslySetInnerHTML={{
                      __html: processContent(item.content),
                    }}
                  />
                  <Link
                    href={
                      item.linkNews ? `/${item.tipo}/${item.linkNews}` : "#"
                    }
                    onClick={(e) => {
                      if (!item.linkNews) {
                        e.preventDefault();
                        alert("Link non disponibile");
                      }
                    }}
                  >
                    <Button
                      className="bg-red-400 hover:bg-red-600"
                      disabled={!item.linkNews}
                    >
                      LEGGI DI PIÙ
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
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
                    className={`w-full hover:font-bold justify-start text-left uppercase ${
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
              <Input
                type="text"
                placeholder="CERCA"
                className="w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
          <div className="col-span-3">
            <ScrollArea className="h-[calc(100vh-200px)] overflow-auto">
              <div className="w-full pr-4">
                {" "}
                {/* Add padding-right to prevent content from being hidden by scrollbar */}
                <PostsSection />
              </div>
              <div className="absolute right-0 top-0 h-full w-2 bg-gray-200 rounded">
                <div className="relative h-full">
                  <div
                    className="absolute right-0 top-0 w-2 rounded bg-gray-400 hover:bg-gray-500 transition-colors"
                    style={{ height: "30%" }}
                  />
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ComunicatiPage;
