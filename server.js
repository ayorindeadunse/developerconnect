const express = require("express");
const connectDB = require("./config/db");
const app = express();

// Connect database
connectDB();

// Initialize Middleware. Current best practices ensure one does not
// need to install bodyparser as a separate package, but now
// it's included with express so we implemement using extended: false
app.use(express.json({ extended: false }));
app.get("/", (req, res) => res.send("API Running"));

// Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
