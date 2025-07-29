#!/bin/bash

# 读取 config.json 中的 host
HOST=$(jq -r '.server_host' config.json)
PORT=$(jq -r '.port' config.json)

# 可选：设置目标目录
REMOTE_DIR=/root/clipboard-server

# 打包
echo "📦 打包项目..."
tar -czf clipboard-server-full.tar.gz \
  --exclude=".git" \
  --exclude="*.log" \
  .


# 上传
echo "🚀 上传到服务器 $HOST ..."
scp clipboard-server.tar.gz root@$HOST:/root/

# 部署
echo "🛠️ 解压并部署到 $HOST ..."
ssh root@$HOST <<EOF
  rm -rf $REMOTE_DIR
  mkdir -p $REMOTE_DIR
  tar -xzf /root/clipboard-server.tar.gz -C $REMOTE_DIR
  cd $REMOTE_DIR
  pnpm install
  pm2 restart clipboard || pm2 start server.js --name clipboard
  pm2 save
EOF

echo "✅ 部署完成，访问地址： http://$HOST:$PORT"
