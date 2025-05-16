import { GET } from "./route";

describe("GET /api/test", () => {
  it("returns a Hello World message", async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ message: "Hello Wor" });
  });
});
