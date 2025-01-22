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
import SocialShare from "@/src/components/SocialShare";

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

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

// ContentRenderer component
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

    // Process YouTube videos
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

    // Process links
    processedContent = processedContent.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-red-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    // Process bold text
    processedContent = processedContent.replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>"
    );

    // Process italic text
    processedContent = processedContent.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // Process underline text
    processedContent = processedContent.replace(/__(.*?)__/g, "<u>$1</u>");

    // Process line breaks
    processedContent = processedContent.replace(/\n/g, "<br />");

    return processedContent;
  };

  return (
    <div
      className="prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{
        __html: processContent(content),
      }}
    />
  );
};

// Utility functions
const formatDate = (date: Date | null): string => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Get post function
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

// Metadata generator with complete social media support
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

  // Clean description by removing HTML tags
  const cleanDescription = post.content
    ?.replace(/<[^>]*>/g, "")
    .slice(0, 160)
    .trim();

  // Base URL (configure based on your domain)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tuodominio.it";
  const postUrl = `${siteUrl}/${params.tipo}/${params.link}`;

  return {
    title: post.title,
    description: cleanDescription,

    // Standard meta tags
    keywords: post.categories?.join(", "),
    authors: [{ name: "SNALV Confsal" }],

    // Open Graph (Facebook, LinkedIn, WhatsApp, etc.)
    openGraph: {
      title: post.title,
      description: cleanDescription,
      url: postUrl,
      siteName: "SNALV Confsal",
      images: [
        {
          url: post.coverImage || "",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: "it_IT",
      type: "article",
      publishedTime: post.createdAt?.toISOString(),
      authors: ["SNALV Confsal"],
      tags: post.categories,
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: cleanDescription,
      images: [post.coverImage || ""],
      creator: "@snalv_confsal",
      site: "@snalv_confsal",
    },

    // Additional meta tags for broader compatibility
    other: {
      "og:image:secure_url": post.coverImage,
      "og:image:alt": post.title,
      "article:published_time": post.createdAt?.toISOString(),
      "article:author": "SNALV Confsal",
      "article:section": post.categories?.[0] || "",
      "article:tag": post.categories?.join(","),
      // WhatsApp specific
      "theme-color": "#ffffff",
      // Robots
      robots: "index, follow",
      googlebot: "index, follow",
    },

    // Canonical URL
    alternates: {
      canonical: postUrl,
    },
  };
}

// Main PostPage component
export default async function PostPage({ params }: any) {
  if (!params.link || !params.tipo) return notFound();

  const post = await getPost(params.tipo, params.link);

  if (!post) return notFound();

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <article className="lg:col-span-8 space-y-8">
            {/* Cover Image */}
            {post.coverImage && (
              <div className="relative w-full aspect-video md:aspect-[4/3] lg:aspect-[16/9] rounded-lg overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </div>
            )}

            {/* Meta info and Title */}
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

            <SocialShare
              title={post.title}
              url={`/${post.type === "comunicati" ? "comunicato" : post.type}/${post.linkNews}`}
              image={post.coverImage}
            />

            {/* Content */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <ContentRenderer content={post.content} />
            </div>

            {/* Image Gallery */}
            {post.images && post.images.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4 md:p-8">
                <h2 className="text-2xl font-bold mb-6 text-[#1a365d]">
                  Galleria Immagini
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {post.images.map((image, index) => (
                    <div
                      key={index}
                      className="group relative aspect-video md:aspect-square rounded-lg overflow-hidden cursor-pointer"
                    >
                      <Image
                        src={image}
                        alt={`Immagine ${index + 1} - ${post.title}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags and Categories */}
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
            {/* Related Posts Box */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6 text-[#1a365d] pb-4 border-b">
                Notizie & Comunicati Correlati
              </h2>
              <div className="space-y-6">
                <NewsComponent
                  categories={post.categories || []}
                  currentLink={post.linkNews}
                  variant="sidebar"
                />
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
