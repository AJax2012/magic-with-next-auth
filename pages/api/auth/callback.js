import Cookies from "cookies";

const cookieName = "callback-url";
const acceptableMethods = ["GET", "POST"];

export default async function callback(req, res) {
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
