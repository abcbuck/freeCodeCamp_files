import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
    const authHeader = req.headers.authorization?.split(" ");
    if(!(authHeader && authHeader[0] === "Bearer")) {
        res.status(401).json({ error: "No token provided." });
        return;
    }

    try {
        const data = jwt.verify(authHeader[1], process.env.JWT_SECRET);
        req.user = data;
    } catch {
        res.status(401).json({ error: "Invalid or expired token." });
        return;
    }
    
    next();
}
