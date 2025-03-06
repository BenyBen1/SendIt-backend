const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/usersRoute");
const ordersRoutes = require("./routes/ordersRoute");

const app = express();

// ✅ Enable CORS for frontend access with credentials
app.use(
  cors({
    origin: "http://192.168.0.175:19006", // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent
  })
);

// ✅ Middleware
app.use(express.json());
app.use(
  session({
    secret: "senditBackendIT", // Change this to a strong secret
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true }, // Set secure: true in production
  })
);

// ✅ Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.use("/orders", ordersRoutes);

// ✅ Check session route (AFTER middleware)
app.get("/auth/session", (req, res) => {
  if (req.session && req.session.user) {
    res.json({ isAuthenticated: true, user: req.session.user });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// ✅ MongoDB connection with error handling
mongoose
  .connect("mongodb://localhost:27017/userDb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
