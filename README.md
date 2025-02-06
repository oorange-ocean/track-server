# 事件追踪服务器

一个基于 NestJS 的事件追踪服务器,用于收集和分析用户行为数据。

## 功能特点

- 支持多种事件类型追踪（错误、性能、录屏等）
- MongoDB 持久化存储
- Redis 缓存支持
- 完整的日志记录

## 技术栈

- NestJS
- MongoDB
- Redis
- TypeScript
- Jest

## 开始使用

### 环境要求

- Node.js >= 18
- MongoDB 8.0
- Redis 7.0

### 安装

```bash
# 克隆项目
git clone https://github.com/oorange-ocean/track-server.git

# 安装依赖
npm install
```

### 配置

在项目根目录创建 `.env` 文件:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/track-server
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

### 部署步骤

1. **系统准备**
```bash
# 更新系统
sudo apt update
sudo apt upgrade -y

# 安装基础工具
sudo apt install -y git curl wget
```

2. **安装 Node.js**
```bash
# 安装 Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

3. **安装 MongoDB**
```bash
# 导入 MongoDB 公钥
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor

# 添加 MongoDB 源
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# 安装 MongoDB
sudo apt update
sudo apt install -y mongodb-org

# 启动 MongoDB 服务
sudo systemctl start mongod
sudo systemctl enable mongod
```

4. **安装 Redis**
```bash
# 安装 Redis
sudo apt install -y redis-server

# 启动 Redis 服务
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

5. **部署项目**
```bash
# 创建项目目录
mkdir -p /var/www
cd /var/www

# 克隆项目
git clone https://github.com/oorange-ocean/track-server.git
cd track-server

# 安装依赖
npm install

# 构建项目
npm run build

# 安装 PM2
sudo npm install -g pm2

# 使用 PM2 启动项目
pm2 start dist/main.js --name track-server

# 设置 PM2 开机自启
pm2 startup
pm2 save
```

6. **配置防火墙**
```bash
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 3000  # 应用端口
sudo ufw enable
```

### 监控和维护

1. **查看服务状态**
```bash
pm2 status
pm2 logs track-server
```

2. **重启服务**
```bash
pm2 restart track-server
```

3. **查看 MongoDB 状态**
```bash
sudo systemctl status mongod
```

4. **查看 Redis 状态**
```bash
sudo systemctl status redis-server
```

### 备份策略

```bash
# 创建备份脚本
mkdir -p /var/backups/mongodb
nano /root/backup-mongo.sh

# 添加备份命令
#!/bin/bash
DATE=$(date +%Y%m%d)
mongodump --out="/var/backups/mongodb/backup-$DATE"

# 设置执行权限
chmod +x /root/backup-mongo.sh

# 添加到 crontab
crontab -e
# 添加以下行（每天凌晨2点备份）
0 2 * * * /root/backup-mongo.sh
```
