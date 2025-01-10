// app/notizia/[linkNews]/page.tsx

import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import Image from "next/image";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import type { Metadata } from "next";

// Definiamo il tipo per i params
type Props = {
  params: {
    linkNews: string;
  };
};

// Modifica generateMetadata per gestire meglio il caso undefined
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!params.linkNews) {
    return {
      title: "Contenuto non trovato",
      description: "Il contenuto richiesto non è disponibile",
    };
  }

  const post: any = await getPost(params.linkNews);

  if (!post) {
    return {
      title: "Contenuto non trovato",
      description: "Il contenuto richiesto non è disponibile",
    };
  }

  return {
    title: post.title || "Notizia",
    description: post.content?.slice(0, 160) || "",
  };
}

async function searchInCollection(collectionName: string, linkNews: string) {
  if (!linkNews) return null;

  try {
    const q = query(
      collection(db, collectionName),
      where("linkNews", "==", linkNews.trim())
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || null,
      };
    }

    return null;
  } catch (error) {
    console.error("Error searching in collection:", error);
    return null;
  }
}

async function getPost(linkNews: string) {
  if (!linkNews) {
    return null;
  }

  try {
    // Cerca nelle notizie
    let post = await searchInCollection("comunicati", linkNews);
    let type = "comunicato";

    // Se non trovato nei comunicati, cerca nelle notizie
    if (!post) {
      post = await searchInCollection("notizie", linkNews);
      type = "notizia";
    }

    if (post) {
      return {
        ...post,
        type,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export default async function NewsPage({ params }: Props) {
  const { linkNews } = params;

  if (!linkNews) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-2xl">Link non valido</div>
        </div>
        <Footer />
      </>
    );
  }

  const post: any = await getPost(linkNews);

  if (!post) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-2xl">Contenuto non trovato</div>
        </div>
        <Footer />
      </>
    );
  }

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("it-IT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

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
              {post.type === "notizia" ? "Notizia" : "Comunicato Stampa"}
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

          <div className="whitespace-pre-wrap text-gray-700">
            {post.content}
          </div>

          {post.images && post.images.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6 text-[#1a365d]">
                Galleria Immagini
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {post.images.map((image: string, index: number) => (
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
      </main>
      <Footer />
    </>
  );
}
