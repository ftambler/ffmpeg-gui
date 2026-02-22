import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import renderRoutes from "./routes/renderRoutes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// API routes FIRST
app.use("/api", renderRoutes);

// Serve built frontend
app.use(express.static(path.join(__dirname, "../dist")));

// SPA fallback (MUST be last)
app.use((req, res) => {
  res.sendFile(path.resolve("dist/index.html"));
});

const PORT = 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});