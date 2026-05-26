const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// TEST API
app.get("/", (req, res) => {
    res.send("Auth Service Running");
});

// LOGIN API
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (email === "admin@gmail.com" && password === "123") {
        return res.json({
            status: "success",
            data: {
                token: "dummy-jwt-token"
            }
        });
    }

    res.status(401).json({
        status: "error",
        message: "Login gagal"
    });
});

app.listen(3000, () => {
    console.log("Auth service running on port 3000");
});