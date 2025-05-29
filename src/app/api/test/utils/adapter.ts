// test/utils/adapter.ts
/*import express from "express";
import { POST } from "../../auth/[...nextauth]/route"; // Adjust path as needed

const app = express();
app.use(express.urlencoded({ extended: true })); // to handle form-urlencoded body

app.post("/api/auth/callback/credentials", async (req, res) => {
  // Convert Express req to Web API Request
  const url = "http://localhost:3000/api/auth/callback/credentials";
  const body = new URLSearchParams(req.body).toString();
  const request = new Request(url, {
    method: "POST",
    headers: {
      "content-type": req.headers["content-type"] || "",
      // add other headers if needed
    },
    body,
  });

  const response = await POST(request);

  // Set status and headers from Response
  res.status(response.status);
  response.headers.forEach((value: string, key: string) => res.setHeader(key, value));
  const data = await response.text();
  res.send(data);
});

export default app;
*/