import axios from "axios";
import { getSession } from "next-auth/react";
import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";
import Script from "next/script";

export default function Login() {
  const { query } = useRouter();

  /**
   * stores callback url from query provided by NextAuth
   * this will be used to redirect user to previous page
   */
  useEffect(() => {
    if (query) {
      axios.post("/api/auth/callback", {
        callbackUrl: query.callbackUrl,
      });
    }
  }, [query]);

  return (
    <>
      {/* Magic login form - https://magic.link/docs/login-form */}
      <Script
        strategy="lazyOnload"
        src="https://auth.magic.link/pnp/login"
        data-magic-publishable-api-key={
          process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY
        }
        data-redirect-uri="/callback"
      ></Script>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const session = await getSession(req);

  if (session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
