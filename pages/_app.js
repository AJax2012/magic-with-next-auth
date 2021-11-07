import "../styles/globals.css";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import React from "react";

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      {Component.auth ? (
        <Auth>
          <Component {...pageProps} />
        </Auth>
      ) : (
        <Component {...pageProps} />
      )}
    </SessionProvider>
  );
}

function Auth({ children }) {
  const { data: session, status } = useSession();
  const isUser = !!session?.user;

  React.useEffect(() => {
    if (status === "loading") {
      return;
    }
    if (!isUser) {
      signIn();
    }
  }, [isUser, status]);

  if (isUser) {
    return children;
  }

  return (
    <svg className="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24"></svg>
  );
}

export default MyApp;
