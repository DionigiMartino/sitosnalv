// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.password) {
          throw new Error("Password richiesta");
        }

        // Log per debug in produzione
        console.log("Auth attempt:", {
          hasUsername: !!credentials.username,
          hasPassword: !!credentials.password,
          env: {
            hasSecret: !!process.env.NEXTAUTH_SECRET,
            hasUrl: !!process.env.NEXTAUTH_URL,
          },
        });

        if (credentials.password === process.env.NEXTAUTH_PASSWORD) {
          return {
            id: "1",
            name: credentials.username || "Admin",
            role: "admin",
          };
        }

        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 ore
  },
  pages: {
    signIn: "/login",
    error: "/login", // pagina di errore personalizzata
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // @ts-ignore
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.role = token.role;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };
