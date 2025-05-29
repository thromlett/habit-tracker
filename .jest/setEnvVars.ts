import dotenv from "dotenv";
import path from "path";

// Load .env.test from the root directory
dotenv.config({ path: path.resolve(__dirname, "../.env.test") });
