import Router from "express";
const watchlistRoutes = Router();
export default watchlistRoutes;

import * as db from "../utils/db.js";
import { authorizeModification } from "../middleware/authorize.js";

watchlistRoutes.get("/:userId", (req, res) => {
    res.json(db.getWatchlist(+req.params.userId));
});

watchlistRoutes.post("/:userId/movies", authorizeModification, (req, res) => {
    db.addMovie(+req.params.userId, req.body);
    res.status(201).json({ message: "Movie added to watchlist." });
});

watchlistRoutes.put("/:userId/movies/:movieId", authorizeModification, (req, res) => {
    db.updateMovie(+req.params.userId, +req.params.movieId, req.body);
    res.json({ message: "Movie updated." });
});

watchlistRoutes.delete("/:userId/movies/:movieId", authorizeModification, (req, res) => {
    db.deleteMovie(+req.params.userId, +req.params.movieId);
    res.json({ message: "Movie deleted." });
});
