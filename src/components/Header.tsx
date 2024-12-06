"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, X, PenLine, UserCircle2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleNavigation = (href) => {
    const [path, hash] = href.split("#");
    router.push(href);

    if (hash) {
      const event = new CustomEvent("sectionChange", { detail: hash });
      window.dispatchEvent(event);
    }
  };

  const menuItems = [
    {
      label: "IL SINDACATO",
      dropdown: true,
      items: [
        { label: "Chi siamo", href: "/chi-siamo#chi-siamo" },
        { label: "La struttura nazionale", href: "/chi-siamo#struttura" },
        { label: "Tutele e servizi", href: "/chi-siamo#tutele" },
        { label: "Comparti specifici", href: "/chi-siamo#comparti" },
      ],
    },
    {
      label: "TERRITORIO",
      dropdown: true,
      items: [
        { label: "Cerca una sede", href: "/territorio#cerca-sede" },
        { label: "Collabora con noi", href: "/territorio#collabora" },
      ],
    },
    { label: "NEWS", href: "/notizie#notizie" },
    { label: "CONTATTI", href: "/contatti" },
  ];

  return (
    <>
      <div className="bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-end items-center space-x-4">
          <Link
            href="/iscriviti"
            className="flex items-center gap-2 text-sm hover:text-blue-200 transition-colors"
          >
            <PenLine size={24} />
            <span className="hidden sm:inline">Iscriviti</span>
          </Link>
          <div className="w-px h-4 bg-blue-700" /> {/* Separatore verticale */}
          <Link
            href="/area-riservata"
            className="flex items-center gap-2 text-sm hover:text-blue-200 transition-colors"
          >
            <UserCircle2 size={24} />
            <span className="hidden sm:inline">Area Riservata</span>
          </Link>
        </div>
      </div>
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 flex justify-between items-center">
          <Link href="/">
            <Image
              src="/img/logo.jpg"
              alt="SNALV"
              width={200}
              height={53}
              priority
            />
          </Link>

          <nav className="hidden md:block">
            <ul className="flex items-center space-x-10">
              {menuItems.map((item) => (
                <li key={item.label} className="relative group ">
                  {item.dropdown ? (
                    <>
                      <button className="text-gray-700 font-bold py-2 group-hover:text-red-600 transition-colors flex items-center gap-1">
                        {item.label}
                        <ChevronDown />
                      </button>
                      <div className="absolute left-0 top-full hidden group-hover:block bg-white border shadow-lg rounded-md min-w-[250px] z-50">
                        <div className="py-2">
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.label}
                              href={subItem.href}
                              onClick={(e) => {
                                e.preventDefault();
                                handleNavigation(subItem.href);
                              }}
                              className="block px-4 py-2 text-gray-700 hover:text-white hover:bg-red-600 hover:font-bold transition-all duration-100"
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      // @ts-ignore
                      href={item.href}
                      className="text-gray-700 font-bold py-2 hover:text-red-600 transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:hidden">
            {isMenuOpen ? (
              <Button
                variant="ghost"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700"
              >
                <X size={24} />
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={() => setIsMenuOpen(true)}
                className="text-gray-700"
              >
                <Menu size={24} />
              </Button>
            )}
          </div>
        </div>

        {isMenuOpen && (
          <div className="bg-white border-b shadow-lg md:hidden">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
              {menuItems.map((item) => (
                <div key={item.label} className="space-y-2">
                  {item.dropdown ? (
                    <>
                      <button
                        className="w-full text-left text-gray-700 font-medium py-2 hover:text-red-600 transition-colors flex items-center justify-between"
                        onClick={() => {
                          // @ts-ignore
                          window.location.href = item.items[0].href;
                        }}
                      >
                        {item.label}
                        <ChevronDown />
                      </button>
                      <div className="space-y-2 pl-4">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            className="block text-gray-700 hover:text-red-600 transition-colors"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      // @ts-ignore
                      href={item.href}
                      className="block text-gray-700 font-medium py-2 hover:text-red-600 transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
