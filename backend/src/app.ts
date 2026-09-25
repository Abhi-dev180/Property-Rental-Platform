import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";
import profileRoutes from "./routes/profile.routes";
import { errorHandler } from "./middleware/error.middleware";
import propertyRoutes from "./routes/property.routes";
import publicPropertyRoutes from "./routes/public-property.routes";
import favoriteRoutes from "./routes/favorite.routes";
import applicationRoutes from "./routes/application.routes";
import documentRoutes from "./routes/document.routes";
import leaseRoutes from "./routes/lease.routes";
import maintenanceRoutes from "./routes/maintenance.routes";





const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true, // allows cookies to be sent/received cross-origin
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan(env.nodeEnv === "development" ? "dev" : "combined"));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", env: env.nodeEnv });
});

// Future feature routers will be added here as we build them:
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/properties", propertyRoutes);


// add alongside your existing app.use lines:
app.use("/api/public/properties", publicPropertyRoutes);
app.use("/api/favorites", favoriteRoutes);




app.use("/api/applications", applicationRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/leases", leaseRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use(errorHandler);



app.use((_req, res) => {
  res.status(404).json({ message: "Route not found." });
});

export default app;