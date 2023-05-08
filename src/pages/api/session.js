// pages/api/session.js
export default async (req, res) => {
  if (req.method === "GET") {
    const token = req.cookies.token;
    if (token) {
      res.status(200).json({ authenticated: true, token });
    } else {
      res.status(401).json({ authenticated: false });
    }
  } else if (req.method === "DELETE") {
    try {
      res.setHeader("Set-Cookie", "token=; Max-Age=0; Path=/; HttpOnly");
      res.status(200).json({ message: "User logged out" });
    } catch (error) {
      console.error("API Session Error:", error);
      res.status(500).json({ error: "Failed to log out" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};