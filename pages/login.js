import axios from "axios";
import { getSession } from "next-auth/react";
import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";

export default function Login() {
  const { query } = useRouter();

  useEffect(() => {
    if (query) {
      setCallbackUrl();
    }
  }, [query]);

  const setCallbackUrl = async () => {
    await axios.post("/api/auth/callback", {
      callbackUrl: query.callbackUrl,
    });
  };

  return (
    <>
      <script
        src="https://auth.magic.link/pnp/login"
        data-magic-publishable-api-key={
          process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY
        }
        data-redirect-uri="/callback"
      ></script>
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
