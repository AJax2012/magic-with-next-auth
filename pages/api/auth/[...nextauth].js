import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Magic } from "@magic-sdk/admin";

const magic = new Magic(process.env.MAGIC_SECRET_KEY);

/**
 * NextAuth setup
 * This setup currently requires req,res for NextAuth 4.x - hopefully will change soon
 * NextuAuth 3.x does not require req,res parameters.
 */
export default async function auth(req, res) {
  return await NextAuth(req, res, {
    session: {
      /**
       * creates JWT signed by NextAuth
       * For self-signed jwt, see:
       * https://next-auth.js.org/configuration/options#jwt
       */
      jwt: true,
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
}
