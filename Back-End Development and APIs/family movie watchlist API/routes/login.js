import * as db from "../utils/db.js";

import Router from "express";
const loginRoute = Router();
export default loginRoute;

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

loginRoute.post("/", (req, res) => {
  if(!req.body?.username || !req.body?.password) {
    res.status(400).json({ error: "Missing username or password" });
    return;
  }
  
  const user = db.findByUsername(req.body.username);
  if(!user || !bcrypt.compareSync(req.body.password, user.passwordHash)) {
    res.status(401).json({ error: "Invalid username or password" });
    return;
  }

  const token = jwt.sign({ 
    id: user.id,
    role: user.role
  }, process.env.JWT_SECRET, { expiresIn: "1d" });

  res.json({
    token
  });
});
