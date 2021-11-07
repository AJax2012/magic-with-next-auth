import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Magic } from "@magic-sdk/admin";

const magic = new Magic(process.env.MAGIC_SECRET_KEY);

export default async function auth(req, res) {
  return await NextAuth(req, res, {
    session: {
      jwt: true,
    },
    pages: {
      signIn: "/login",
    },
    providers: [
      CredentialsProvider({
        name: "Magic Link",
        credentials: {
          didToken: { label: "DID Token", type: "text" },
        },
        async authorize({ didToken }) {
          magic.token.validate(didToken);
          const metadata = await magic.users.getMetadataByToken(didToken);

          return {
            email: metadata.email,
            name: metadata.email,
          };
        },
      }),
    ],
  });
}