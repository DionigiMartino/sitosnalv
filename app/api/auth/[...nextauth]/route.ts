import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/src/lib/firebase";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Username e password richiesti");
        }

        try {
          const usersRef = collection(db, "users");
          const q = query(
            usersRef,
            where("username", "==", credentials.username),
            where("password", "==", credentials.password)
          );

          const snapshot = await getDocs(q);

          if (snapshot.empty) {
            return null;
          }

          const userData = snapshot.docs[0].data();
          return {
            id: snapshot.docs[0].id,
            name: userData.username,
            role: userData.role || "user",
            email: userData.email,
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw new Error("Errore durante l'autenticazione");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // @ts-ignore
        token.role = user.role;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.id = token.id;
        // @ts-ignore
        session.user.role = token.role;
        session.user.email = token.email;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };
