import express from "express";
import cors from "cors";
import "dotenv/config";

import authRoutes from "./routes/auth.routes.js";
import placesRoutes from "./routes/places.routes.js";
import reviewsRoutes from "./routes/reviews.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
}));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "Pumachefcitos" });
});

app.use("/api/auth", authRoutes);
app.use("/api/places", placesRoutes);
app.use("/api/reviews", reviewsRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada." });
});

app.use(errorHandler);

export default app;
