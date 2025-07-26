const express = require("express");
const path = require("path");
const fs = require("fs");

const config = JSON.parse(fs.readFileSync("config.json", "utf8"));
const app = express();

let clipboardContent = "";

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/api/content", (req, res) => {
  res.json({ content: clipboardContent });
});

app.post("/api/content", (req, res) => {
  clipboardContent = req.body.content || "";
  res.json({ success: true });
});

app.listen(config.port, config.host, () => {
  console.log(`📋 Clipboard server running at http://${config.host}:${config.port}`);
});

