# 事件追踪服务器

一个基于 NestJS 的事件追踪服务器,用于收集和分析用户行为数据。

## 功能特点

- 支持实时事件追踪
- MongoDB 持久化存储
- Redis 缓存支持
- RESTful API 接口
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
git clone https://github.com/your-repo/event-tracking-server.git

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

### 运行

```bash
# 开发模式
npm run start:dev

# 生产模式
npm run build
npm run start:prod
```

### 部署

#### Vercel 部署

1. 首先确保你的项目已经推送到 GitHub 仓库

2. 在项目根目录创建 `vercel.json` 文件:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/main.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/main.js"
    }
  ]
}
```

3. 登录 [Vercel](https://vercel.com) 并导入你的 GitHub 项目

4. 在 Vercel 项目设置中配置环境变量:
   - `MONGODB_URI`: MongoDB 连接字符串
   - `REDIS_HOST`: Redis 主机地址
   - `REDIS_PORT`: Redis 端口
   - `REDIS_PASSWORD`: Redis 密码
   - `REDIS_DB`: Redis 数据库编号

5. 部署完成后，Vercel 会自动生成一个域名供你访问

注意：由于 Vercel 的无服务器特性，Redis 建议使用云服务提供商（如 Upstash）的方案。MongoDB 可以使用 MongoDB Atlas。

#### 安全配置

1. 数据库安全
   - 使用 MongoDB Atlas
   - 创建独立的数据库用户，设置强密码
   - 限制数据库访问IP（在 MongoDB Atlas 网络设置中配置）
   - 启用 MongoDB Atlas 的审计日志功能

2. Redis 安全（使用 Upstash）
   - 使用 Upstash 提供的 TLS 加密连接
   - 设置强密码
   - 定期轮换访问凭证

3. Vercel 环境变量
   ```bash
   # 在 Vercel 项目设置中添加以下环境变量
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
   REDIS_URL=rediss://:password@hostname:port
   
   # 可选的安全配置
   RATE_LIMIT=100  # API速率限制
   API_KEY_REQUIRED=true  # 是否需要API密钥
   CORS_ORIGINS=https://yourdomain.com  # 允许的跨域来源
   ```

4. 安全最佳实践
   - 启用请求速率限制
   - 配置 CORS 策略
   - 使用 HTTPS
   - 实现 API 密钥认证
   - 定期更新依赖包

5. 监控与告警
   - 设置 Vercel 的部署通知
   - 配置数据库监控告警
   - 设置错误日志通知
   - 监控异常流量

#### 生产环境检查清单

- [ ] 所有敏感信息已配置为环境变量
- [ ] 数据库连接使用 TLS/SSL
- [ ] API 端点已实现速率限制
- [ ] CORS 策略已正确配置
- [ ] 生产环境日志级别适当设置
- [ ] 监控和告警系统已配置
- [ ] 备份策略已实施
- [ ] 安全更新自动化已配置
