import { useEffect } from "react";
import { signIn } from "next-auth/react";
import axios from "axios";

export default function Callback() {
  /**
   * adds listener for script tag below.
   * see the login form section in Magic's documentation
   * https://magic.link/docs/login-form
   */
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("@magic/ready", (event) => {
        const { idToken } = event.detail;
        finishLogin(idToken);
      });
    }
  }, []);

  const finishLogin = async (didToken) => {
    // gets callback from saved cookie
    const { data } = await axios.get("/api/auth/callback");

    await signIn("credentials", {
      didToken,
      callbackUrl: data?.callbackUrl ?? null,
    });
  };

  return (
    <>
      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24"></svg>
      {/* adds magic form callback - https://magic.link/docs/login-form */}
      <script
        src="https://auth.magic.link/pnp/callback"
        data-magic-publishable-api-key={
          process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY
        }
      ></script>
    </>
  );
}
