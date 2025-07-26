const express = require("express");
const path = require("path");
const fs = require("fs");

const config = JSON.parse(fs.readFileSync("config.json", "utf8"));
const app = express();

let clipboardList = []; // 存储多个粘贴内容

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

/**
 * GET /api/content?index=0
 */
app.get("/api/content", (req, res) => {
  const index = parseInt(req.query.index) || 0;

  if (index < 0 || index >= clipboardList.length) {
    return res.status(404).json({ error: "Index out of range" });
  }

  res.json({ content: clipboardList[index] });
});

/**
 * POST /api/content?index=0
 * body: { content: "..." }
 */
app.post("/api/content", (req, res) => {
  const index = parseInt(req.query.index) || 0;
  const content = req.body.content || "";

  // 自动扩容数组
  while (clipboardList.length <= index) {
    clipboardList.push("");
  }

  clipboardList[index] = content;
  res.json({ success: true });
});

app.listen(config.port, config.host, () => {
  console.log(`📋 Clipboard server running at http://${config.host}:${config.port}`);
});
