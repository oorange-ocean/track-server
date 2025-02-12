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
公共字段

所有上报的数据都包含以下公共字段:

{
  type: string;        // 事件类型
  pageUrl: string;     // 页面地址
  time: number;        // 发生时间戳
  uuid: string;        // 页面唯一标识
  apikey: string;      // 项目id 
  status: string;      // 事件状态 'error' | 'ok'
  sdkVersion: string;  // SDK版本号
  breadcrumb?: BreadcrumbData[]; // 用户行为栈
  deviceInfo: {        // 设备信息
    browserVersion: string | number;  // 浏览器版本
    browser: string;                  // 浏览器名称
    osVersion: string | number;       // 系统版本
    os: string;                       // 操作系统
    ua: string;                       // UA信息
    device: string;                   // 设备描述
    device_type: string;              // 设备类型(pc/mobile)
  }
}

错误上报

1. 代码错误
{
  type: 'error',
  message: string;      // 错误信息
  fileName: string;     // 报错文件
  line: number;         // 行号
  column: number;       // 列号
}

2. 资源加载错误
{
  type: 'resource',
  time: number;         // 发生时间
  message: string;      // 加载失败信息
  name: string;         // 资源类型(js/css等)
}

3. 接口请求错误
{
  type: 'xhr' | 'fetch',      // 请求类型
  url: string,                // 请求URL
  elapsedTime: number,        // 请求耗时(ms)
  message: string,            // 错误信息,如 "请求失败，Status值为:404，not_found"
  
  // 请求数据
  requestData: {
    httpType: 'xhr' | 'fetch',// 请求方式
    method: string,           // HTTP方法(GET/POST等)
    data: any                 // 请求参数
  },
  
  // 响应数据  
  response: {
    Status: number,           // HTTP状态码
    data: any                 // 响应数据
  }
}

性能数据
{
  type: 'performance',
  name: string,           // 指标名称
  value: number,          // 指标值
  rating: string,         // 评级(good/poor)
}

具体指标包括:
1. FCP (First Contentful Paint)
{
  name: 'FCP',           // 首次内容绘制
  value: number,         // 数值(ms)
  rating: 'good' | 'poor' // value > 2500ms 为 poor
}

2. LCP (Largest Contentful Paint)
{
  name: 'LCP',           // 最大内容绘制
  value: number,         // 数值(ms)
  rating: 'good' | 'poor' // value > 4000ms 为 poor
}

3. TTFB (Time to First Byte)
{
  name: 'TTFB',          // 首字节时间
  value: number,         // 数值(ms)
  rating: 'good' | 'poor' // value > 100ms 为 poor
}

4. FID (First Input Delay)
{
  name: 'FID',           // 首次输入延迟
  value: number,         // 数值(ms)
  rating: 'good' | 'poor' // value > 100ms 为 poor
}

5. CLS (Cumulative Layout Shift)
{
  name: 'CLS',           // 累积布局偏移
  value: number,         // 数值(无单位)
  rating: 'good' | 'poor' // value > 0.1 为 poor
}

个性化指标

1. Long Task (长任务)
{
  type: 'performance',
  name: 'longTask',
  longTask: {
    name: string,         // 任务名称
    duration: number,     // 任务持续时间
    startTime: number,    // 开始时间
    entryType: string     // 条目类型
  }
}

2. Memory (内存)
{
  type: 'performance', 
  name: 'memory',
  memory: {
    jsHeapSizeLimit: number,  // JS堆内存大小限制
    totalJSHeapSize: number,  // 可使用的内存
    usedJSHeapSize: number    // 已使用的内存
  }
}

3. 首屏加载时间
{
  type: 'performance',
  name: 'FSP',            // First Screen Paint
  value: number,          // 数值(ms)
  rating: 'good' | 'poor' // value > 2500ms 为 poor
}

4. 资源列表
{
  type: 'performance',
  name: 'resourceList',           // 固定值
  time: number,                   // 时间戳
  status: 'ok',                   // 状态
  resourceList: Array<{          // 资源列表数组
    name: string,                // 资源名称/地址
    initiatorType: string,       // 资源类型(img/script/link等)
    startTime: number,           // 开始时间
    responseEnd: number,         // 响应结束时间
    duration: number,            // 加载耗时
    transferSize: number,        // 传输大小
    protocol: string,            // 协议(http/https)
    status: number              // HTTP状态码
  }>
}
白屏检测
{
   type:'whiteScreen',
   time:number,                   //时间戳
   status: 'error' | 'ok'         //是否白屏：'error'是白屏 | 'ok'不是白屏
}
