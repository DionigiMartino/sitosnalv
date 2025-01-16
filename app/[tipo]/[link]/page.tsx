// app/[tipo]/[link]/page.tsx
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import Image from "next/image";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ComunicatiPage from "@/src/components/Comunicati";
import NewsComponent from "@/src/components/CategoryNews";
import React from "react";
import Link from "next/link";

// Interfacce
interface Post {
  id: string;
  title: string;
  content: string;
  coverImage?: string;
  images?: string[];
  categories?: string[];
  createdAt: Date | null;
  type: "notizie" | "comunicati";
  linkNews: string;
}

interface PageParams {
  params: {
    tipo: string;
    link: string;
  };
}

// ContentRenderer come componente separato
// ContentRenderer come componente separato
const ContentRenderer: React.FC<{ content: string }> = ({ content }) => {
  if (!content) return null;

  const getYouTubeVideoId = (url: string) => {
    let videoId = "";
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/,
      /youtube\.com\/watch\?.*v=([^&\s]+)/,
    ];

    for (let pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        videoId = match[1];
        break;
      }
    }

    return videoId;
  };

  const processContent = (text: string) => {
    if (!text) return "";

    // Processa i video di YouTube
    let processedContent = text.replace(
      /{youtube:(https?:\/\/[^\s}]+)}/g,
      (match, url) => {
        const videoId = getYouTubeVideoId(url);
        if (videoId) {
          return `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;"><iframe style="position:absolute;top:0;left:0;width:100%;height:100%" src="https://www.youtube.com/embed/${videoId}" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
        }
        return match;
      }
    );

    // Processa i link
    processedContent = processedContent.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-red-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    // Processa bold
    processedContent = processedContent.replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>"
    );

    // Processa italic
    processedContent = processedContent.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // Processa underline
    processedContent = processedContent.replace(/__(.*?)__/g, "<u>$1</u>");

    // Processa gli accapo mantenendo gli spazi
    processedContent = processedContent.replace(/\n/g, "<br />");

    return processedContent;
  };

  return (
    <div
      className="prose prose-lg max-w-none"
      // Rimuoviamo whitespace-pre-wrap poiché gestiamo già gli accapo con i <br />
      dangerouslySetInnerHTML={{
        __html: processContent(content),
      }}
    />
  );
};

// Funzioni di utilità
const formatDate = (date: Date | null): string => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Funzione per recuperare il post
async function getPost(tipo: string, link: string): Promise<Post | null> {
  try {
    const collectionName = tipo === "notizia" ? "notizie" : "comunicati";
    const q = query(
      collection(db, collectionName),
      where("linkNews", "==", link)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return null;

    const doc = querySnapshot.docs[0];
    const data = doc.data();

    return {
      id: doc.id,
      title: data.title,
      content: data.content,
      coverImage: data.coverImage,
      images: data.images || [],
      categories: data.categories || [],
      createdAt: data.createdAt?.toDate() || null,
      type: collectionName as "notizie" | "comunicati",
      linkNews: data.linkNews,
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

// Metadata generator
export async function generateMetadata({
  params,
}: any): Promise<Metadata> {
  const post = await getPost(params.tipo, params.link);

  if (!post) {
    return {
      title: "Contenuto non trovato",
      description: "Il contenuto richiesto non è disponibile",
    };
  }

  return {
    title: post.title,
    description: post.content?.slice(0, 160) || "",
  };
}

// Main component
export default async function PostPage({ params }: any) {
  if (!params.link || !params.tipo) return notFound();

  const post = await getPost(params.tipo, params.link);

  if (!post) return notFound();

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contenuto Principale */}
          <article className="lg:col-span-8 space-y-8">
            {/* Cover Image */}
            {post.coverImage && (
              <div className="relative aspect-square w-[500px] rounded-lg overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Meta info e Titolo */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                  {post.type === "notizie" ? "Notizia" : "Comunicato Stampa"}
                </span>
                {post.categories?.map((cat, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
                  >
                    {cat}
                  </span>
                ))}
              </div>
              <time className="text-gray-500 text-sm block">
                {formatDate(post.createdAt)}
              </time>
              <h1 className="text-4xl font-bold text-[#1a365d]">
                {post.title}
              </h1>
            </div>

            {/* Contenuto */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <ContentRenderer content={post.content} />
            </div>

            {/* Galleria Immagini */}
            {post.images && post.images.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold mb-6 text-[#1a365d]">
                  Galleria Immagini
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {post.images.map((image, index) => (
                    <div
                      key={index}
                      className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                    >
                      <Image
                        src={image}
                        alt={`Immagine ${index + 1} - ${post.title}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tag e Categorie */}
            <div className="border-t pt-8">
              <div className="flex flex-wrap gap-2">
                {post.categories?.map((cat, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 px-4 py-2 rounded-full text-sm hover:bg-gray-200 cursor-pointer"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Box Correlati */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6 text-[#1a365d] pb-4 border-b">
                {post.type === "comunicati"
                  ? "Comunicati Correlati"
                  : "Notizie Correlate"}
              </h2>
              <div className="space-y-6">
                {post.type === "comunicati" ? (
                  <ComunicatiPage
                    categories={post.categories || []}
                    currentLink={post.linkNews}
                    variant="sidebar"
                  />
                ) : (
                  <NewsComponent
                    categories={post.categories || []}
                    currentLink={post.linkNews}
                    variant="sidebar"
                  />
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}