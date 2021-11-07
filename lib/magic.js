import { Magic } from "magic-sdk";

/**
 * creates client magic instance
 * this is where you can add oAuth, WebAuthn, and other extensions
 * oAuth is not required if using the login form
 * https://magic.link/docs/login-methods/social-logins/oauth-implementation/web
 */
const createMagic = (key) => {
  return typeof window != "undefined" && new Magic(key);
};

export const magic = createMagic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY);
