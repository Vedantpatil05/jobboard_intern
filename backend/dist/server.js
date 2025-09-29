import express from "express";
import matchRoutes from "./routes/match.js";
import userRoutes from "./routes/user.js";
import statsRoutes from "./routes/stats.js";
const app = express();
const PORT = process.env.PORT || 5000;
// ✅ Middleware: JSON body parser
app.use(express.json());
// ✅ Middleware: CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});
// ✅ Routes
app.use("/api/match", matchRoutes); // old match feature
app.use("/api/user", userRoutes); // new user profile merge
app.use("/api/stats", statsRoutes); // skill stats calculation
// ✅ Health check route
app.get("/", (_req, res) => {
    res.send("Backend is running 🚀");
});
// ✅ Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
