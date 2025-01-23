import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials?.password === "SNALV_Gamma_12") {
          return { id: "1", name: "Admin" };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: "57jseAh9H2EKVtcwMIMTvCwjoVhbMOp1WblP3tysTfJUHLWbwA",
});

export { handler as GET, handler as POST };
