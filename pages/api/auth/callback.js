import Cookies from "cookies";

const cookieName = "callback-url";
const acceptableMethods = ["GET", "POST"];

/**
 * POST: callbackUrl is passed to store where the user should be redirected to
 * GET: callbackUrl is retrieved on callback screen to redirect the user using NextAuth
 * @param {NextApiRequest} req
 * @param {NextApiResult} res
 * @returns NextApiResult
 */
export default async function handler(req, res) {
  if (!acceptableMethods.includes(req.method)) {
    return res.status(405).json({
      error: { message: "Method not allowed" },
    });
  }

  const cookies = new Cookies(req, res);

  if (req.method === "POST") {
    cookies.set(cookieName, req.body.callbackUrl);
    res.end();
  }

  if (req.method === "GET") {
    const callbackUrl = cookies.get(cookieName);
    cookies.set(cookieName);
    res.json(JSON.stringify({ callbackUrl }));
  }
}
