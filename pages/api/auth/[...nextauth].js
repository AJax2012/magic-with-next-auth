import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Magic } from "@magic-sdk/admin";

const magic = new Magic(process.env.MAGIC_SECRET_KEY);

/**
 * NextAuth setup
 */
export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    /**
     * Idle session expires in 30 days
     */
    maxAge: 30 * 24 * 60 * 60,
    /**
     * extends the session every 24 hours when session not idle
     */
    updateAge: 24 * 60 * 60,
  },
  jwt: {
    /**
     * gets secret for encoding/decoding JWT
     */
    secret: process.env.JWT_KEY,
    /**
     * sets max age of JWT to 30 days (exp property)
     */
    maxAge: 60 * 60 * 24 * 30,
  },
  pages: {
    /**
     * default signIn page is /auth/login
     * we want to use magic for authentication, so override signIn
     * https://next-auth.js.org/configuration/pages
     */
    signIn: "/login",
  },
  providers: [
    /**
     * allows for manual configuration to get user/session
     * https://next-auth.js.org/configuration/providers/credentials-provider
     */
    CredentialsProvider({
      name: "Magic Link",
      credentials: {
        didToken: { label: "DID Token", type: "text" },
      },
      async authorize({ didToken }) {
        magic.token.validate(didToken);
        const metadata = await magic.users.getMetadataByToken(didToken);

        /**
         * returns NextAuth user:
         * https://next-auth.js.org/adapters/models
         */
        return {
          email: metadata.email,
          name: metadata.email,
          email_verified: true,
        };
      },
    }),
  ],
});
