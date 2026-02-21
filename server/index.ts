import express from "express";
import cors from "cors";
import renderRoutes from "./routes/renderRoutes";

const app = express();
app.use(
  cors({
    origin: /^http:\/\/localhost(?::\d+)?$/,
  })
);
app.use(express.json());

app.use("/api", renderRoutes);

app.listen(3001, "0.0.0.0", () => {
  console.log("Server running on port 3001");
});