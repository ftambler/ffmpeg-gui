import express from "express";
import renderRoutes from "./routes/renderRoutes";

const app = express();
app.use(express.json());

app.use("/api", renderRoutes);

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
