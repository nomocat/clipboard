const express = require("express");
const path = require("path");
const fs = require("fs");
const http = require("http");
const WebSocket = require("ws");

const config = JSON.parse(fs.readFileSync("config.json", "utf8"));
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clipboardList = [];

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// WebSocket 连接处理
wss.on("connection", (ws) => {
  console.log("📡 WebSocket 客户端已连接");

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      const index = parseInt(data.index) || 0;

      if (data.type === "read") {
        const content = clipboardList[index] || "";
        ws.send(JSON.stringify({ type: "read", index, content }));
      }

      if (data.type === "write") {
        const content = data.content || "";
        while (clipboardList.length <= index) clipboardList.push("");
        clipboardList[index] = content;

        // 广播给所有客户端更新内容
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: "update", index, content }));
          }
        });
      }
    } catch (err) {
      console.error("⚠️ 解析消息出错", err);
    }
  });
});

server.listen(config.port, config.host, () => {
  console.log(`📋 Clipboard WebSocket server running at http://${config.host}:${config.port}`);
});
