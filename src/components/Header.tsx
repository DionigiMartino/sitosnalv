"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const Header = () => {
  const menuItems = [
    {
      label: "IL SINDACATO",
      dropdown: true,
      items: [
        { label: "Chi siamo", href: "/chi-siamo" },
        { label: "La struttura nazionale", href: "/chi-siamo#struttura" },
        { label: "Tutele e servizi", href: "//chi-siamo#tutele" },
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
      <div className="bg-[#1a365d] py-3">
        <div className="max-w-7xl mx-auto px-4 flex justify-end space-x-6">
          <Button variant="ghost" className="text-white hover:bg-white/10">
            ISCRIVITI
          </Button>
          <Button variant="ghost" className="text-white hover:bg-white/10">
            AREA RISERVATA
          </Button>
        </div>
      </div>

      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <Link href="/">
              <Image
                src="/img/logo.jpg"
                alt="SNALV"
                width={300}
                height={80}
                priority
              />
            </Link>

            <nav>
              <ul className="flex items-center space-x-10">
                {menuItems.map((item) => (
                  <li key={item.label} className="relative group">
                    {item.dropdown ? (
                      <>
                        <button className="text-gray-700 font-medium py-2 group-hover:text-red-600 transition-colors flex items-center gap-1">
                          {item.label}
                          <ChevronDown />
                        </button>
                        <div className="absolute left-0 top-full hidden group-hover:block bg-white border shadow-lg rounded-md min-w-[200px] z-50">
                          <div className="py-2">
                            {item.items.map((subItem) => (
                              <Link
                                key={subItem.label}
                                href={subItem.href}
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-red-600"
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
                        className="text-gray-700 font-medium py-2 hover:text-red-600 transition-colors"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
