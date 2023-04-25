// pages/api/session.js
import axios from "axios";

// export default async (req, res) => {
//   try {
//     const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}session/getSession`, {
//       headers: {
//         Cookie: req.headers.cookie,
//       },
//         withCredentials: true,
//     });
//     console.log("API Session Request:", req.headers.cookie)
//     console.log("API Session Response:", response.data);

//     if (response.status === 200) {
//       res.status(200).json({ authenticated: response.data.authenticated });
//     } else {
//       res.status(response.status).json({ error: "Failed to get session" });
//     }
//   } catch (error) {
//     console.error("API Session Error:", error);
//     res.status(500).json({ error: "Failed to get session" });
//   }
// };


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