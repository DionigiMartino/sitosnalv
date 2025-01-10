import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import Image from "next/image";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ComunicatiPage from "@/src/components/Comunicati";
import NewsComponent from "@/src/components/CategoryNews";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const post: any = await getPost(params.type, params.linkNews);

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

async function getPost(tipo: string, link: string) {
  console.log("Fetching post with:", { tipo, link });

  try {
    const collectionName = tipo === "notizia" ? "notizie" : "comunicati";
    console.log("Using collection:", collectionName);

    const q = query(
      collection(db, collectionName),
      where("linkNews", "==", link)
    );

    const querySnapshot = await getDocs(q);
    console.log("Query results:", querySnapshot.size);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      console.log("Found document:", data);

      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || null,
        type: collectionName,
      };
    }

    console.log("No document found");
    return null;
  } catch (error) {
    console.error("Error in getPost:", error);
    return null;
  }
}

export default async function PostPage({ params }: any) {
  console.log("Page params:", params);

  if (!params.link || !params.tipo) {
    console.log("Invalid params detected");
    return notFound();
  }

  const post: any = await getPost(params.tipo, params.link);
  console.log("Retrieved post:", post);

  if (!post) {
    console.log("Post not found");
    return notFound();
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
            <div className="relative aspect-video w-full min-h-[100vh] mb-8 rounded-lg overflow-hidden">
              <Image
                src={post.coverImage || "/img/logo.jpg"}
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

        {post.type === "comunicati" ? (
          <ComunicatiPage
            categories={post.categories}
            currentLink={post.linkNews}
          />
        ) : (
          <NewsComponent
            categories={post.categories}
            currentLink={post.linkNews}
          />
        )}
      </main>
      <Footer />
    </>
  );
}
