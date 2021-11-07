import "../styles/globals.css";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import React from "react";

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      {/* if auth = true, use auth function below. else, return component */}
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

/**
 * If component has Component.auth = true
 * Requires authentication for session
 * Redirects to login page if not authenticated
 * NextAuth also adds a "callbackUrl" query to URL
 * With the cookie, it will redirect back to page originally requested.
 */
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

  return <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24"></svg>;
}

export default MyApp;
