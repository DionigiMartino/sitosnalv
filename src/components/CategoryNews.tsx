import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const NewsComponent = ({ category }: any) => {
  const newsData: any = {
    sociosanitario: [
      {
        id: 1,
        date: "15 NOVEMBRE",
        image: "/img/sede.jpg",
        title: "Nuovo CCNL per il settore socio-sanitario: tutte le novità",
        description:
          "Lorem ipsum dolor sit amet, adipisicing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna",
      },
      {
        id: 2,
        date: "10 NOVEMBRE",
        image: "/img/sede.jpg",
        title: "Formazione professionale: nuovi corsi per operatori sanitari",
        description:
          "Lorem ipsum dolor sit amet, adipisicing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna",
      },
    ],
    fragili: [
      {
        id: 1,
        date: "12 NOVEMBRE",
        image: "/img/sede.jpg",
        title: "Nuove tutele per i lavoratori con patologie croniche",
        description:
          "Lorem ipsum dolor sit amet, adipisicing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna",
      },
      {
        id: 2,
        date: "8 NOVEMBRE",
        image: "/img/sede.jpg",
        title: "Smart working: estese le misure per i lavoratori fragili",
        description:
          "Lorem ipsum dolor sit amet, adipisicing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna",
      },
    ],
    entilocali: [
      {
        id: 1,
        date: "14 NOVEMBRE",
        image: "/img/sede.jpg",
        title: "Rinnovo contratto enti locali: le proposte del sindacato",
        description:
          "Lorem ipsum dolor sit amet, adipisicing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna",
      },
      {
        id: 2,
        date: "9 NOVEMBRE",
        image: "/img/sede.jpg",
        title: "Nuove assunzioni negli enti locali: il piano 2024",
        description:
          "Lorem ipsum dolor sit amet, adipisicing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna",
      },
    ],
    confsalsud: [
      {
        id: 1,
        date: "13 NOVEMBRE",
        image: "/img/sede.jpg",
        title: "Sviluppo del Mezzogiorno: le iniziative Confsal",
        description:
          "Lorem ipsum dolor sit amet, adipisicing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna",
      },
      {
        id: 2,
        date: "7 NOVEMBRE",
        image: "/img/sede.jpg",
        title: "PNRR e Sud Italia: le proposte del sindacato",
        description:
          "Lorem ipsum dolor sit amet, adipisicing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna",
      },
    ],
    territorio: [
      {
        id: 1,
        date: "13 NOVEMBRE",
        image: "/img/sede.jpg",
        title: "Sviluppo del Mezzogiorno: le iniziative Confsal",
        description:
          "Lorem ipsum dolor sit amet, adipisicing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna",
      },
      {
        id: 2,
        date: "7 NOVEMBRE",
        image: "/img/sede.jpg",
        title: "PNRR e Sud Italia: le proposte del sindacato",
        description:
          "Lorem ipsum dolor sit amet, adipisicing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna",
      },
    ],
  };

  return (
    <div>
      <div className="w-full flex  gap-8">
        {newsData[category]?.map((news: any) => (
          <div
            key={news.id}
            className="bg-white rounded-lg overflow-hidden shadow-sm w-2/4"
          >
            <div className="relative h-48">
              <Image
                src={news.image}
                alt={news.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 left-4 bg-white px-3 py-1 text-sm font-medium">
                {news.date}
              </div>
            </div>
            <div className="p-4">
              <p className="text-gray-800 mb-4 line-clamp-2">
                {news.description}
              </p>
              <Button
                variant="secondary"
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                LEARN MORE
              </Button>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination dots */}
      <div className="flex justify-center mt-6 gap-2">
        <div className="w-2 h-2 rounded-full bg-gray-500"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
      </div>
    </div>
  );
};

export default NewsComponent;
