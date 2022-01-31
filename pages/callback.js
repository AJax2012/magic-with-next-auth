import { signIn } from "next-auth/react";
import Script from "next/script";

export default function Callback() {
  return (
    <>
      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24"></svg>
      {/**
       * adds magic form callback - https://magic.link/docs/login-form
       * adds listener for script tag below.
       * see the login form section in Magic's documentation
       * https://magic.link/docs/login-form
       */}
      <Script
        async
        strategy="afterInteractive"
        src="https://auth.magic.link/pnp/callback"
        data-login-uri="/login"
        data-magic-publishable-api-key={
          process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY
        }
        onLoad={() => {
          window.addEventListener("@magic/ready", async (event) => {
            const { idToken } = event.detail;

            const response = await fetch("/api/auth/callback");
            const urlData = await response.json();

            await signIn("credentials", {
              didToken: idToken,
              callbackUrl: urlData?.callbackUrl ?? null,
            });
          });
        }}
      ></Script>
    </>
  );
}
