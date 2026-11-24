import express from "express";
import helmet from "helmet";

import { authenticate } from "./middleware/authenticate.js";

import loginRoute from "./routes/login.js";
import watchlistRoutes from "./routes/watchlist.js";

const PORT = process.env.PORT;
const app = express();

app.use(helmet());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Family Movie Watchlist API");
});

app.use("/api/auth/login", loginRoute);

app.use("/api/watchlist", authenticate, watchlistRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
})

app.use((err, req, res, next) => {
  res.status(err.status ?? 500).send(`HTTP Status code ${err.status}`);
  next(err);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
