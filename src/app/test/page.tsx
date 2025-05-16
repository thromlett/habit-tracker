import { DisplayTest } from "../components/DisplayTest";
import { fetchTestData } from "../services/fetchTestData";

export default async function TestPage() {
  const data = await fetchTestData();

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Test Page</h1>
      <DisplayTest message={data.message} />
    </main>
  );
}
