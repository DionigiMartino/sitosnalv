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
        <article className="prose lg:prose-xl mx-auto">
          {post.coverImage && (
            <div className="relative aspect-video w-full mb-8 rounded-lg overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
            <div>{formatDate(post.createdAt)}</div>
            <div>·</div>
            <div>
              {post.type === "notizie" ? "Notizia" : "Comunicato Stampa"}
            </div>
            {post.categories && post.categories.length > 0 && (
              <>
                <div>·</div>
                <div>{post.categories.join(", ")}</div>
              </>
            )}
          </div>

          <h1 className="text-4xl font-bold mb-8 text-[#1a365d]">
            {post.title}
          </h1>

          <ContentRenderer content={post.content} />

          {post.images && post.images.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6 text-[#1a365d]">
                Galleria Immagini
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {post.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-video rounded-lg overflow-hidden"
                  >
                    <Image
                      src={image}
                      alt={`Immagine ${index + 1} - ${post.title}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>

        <div className="mt-16 pt-8 border-t border-gray-200">
          <h2 className="text-3xl font-bold mb-8 text-[#1a365d] text-center">
            {post.type === "comunicati"
              ? "Comunicati Correlati"
              : "Notizie Correlate"}
          </h2>

          {post.type === "comunicati" ? (
            <ComunicatiPage
              categories={post.categories || []}
              currentLink={post.linkNews}
            />
          ) : (
            <NewsComponent
              categories={post.categories || []}
              currentLink={post.linkNews}
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
