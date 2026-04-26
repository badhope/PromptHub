#!/bin/bash
# ==============================================
# ✅ PromptHub 全自动一键部署脚本
# 自动解决所有常见坑
# ==============================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════╗"
echo "║     PromptHub 全自动部署脚本                  ║"
echo "║     自动检测并解决所有常见坑                  ║"
echo "╚═══════════════════════════════════════════════╝"
echo -e "${NC}"

# ==============================================
# 🚨 坑 #1: Node.js 版本检测
# ==============================================
echo -e "\n${YELLOW}[1/8] 检测 Node.js 版本...${NC}"
NODE_VERSION=$(node -v | sed 's/v//')
NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1)

if [ "$NODE_MAJOR" -lt "20" ]; then
    echo -e "${RED}❌ Node.js 版本太低: v$NODE_VERSION${NC}"
    echo -e "${YELLOW}→ 自动升级到 Node.js 20...${NC}"
    curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
    echo -e "${GREEN}✅ Node.js 升级完成: $(node -v)${NC}"
else
    echo -e "${GREEN}✅ Node.js 版本正常: v$NODE_VERSION${NC}"
fi

# ==============================================
# 🚨 坑 #2: 内存不足自动加交换分区
# ==============================================
echo -e "\n${YELLOW}[2/8] 检测系统内存...${NC}"
TOTAL_MEM=$(free -g | awk '/^Mem:/{print $2}')

if [ "$TOTAL_MEM" -lt "2" ]; then
    echo -e "${YELLOW}⚠️  内存不足 ${TOTAL_MEM}G，自动添加 2G 交换分区...${NC}"
    if [ ! -f /swapfile ]; then
        fallocate -l 2G /swapfile
        chmod 600 /swapfile
        mkswap /swapfile
        swapon /swapfile
        echo -e "${GREEN}✅ 交换分区已添加${NC}"
    else
        echo -e "${GREEN}✅ 交换分区已存在${NC}"
    fi
else
    echo -e "${GREEN}✅ 内存充足: ${TOTAL_MEM}G${NC}"
fi

# ==============================================
# 🚨 坑 #3: npm 源设置
# ==============================================
echo -e "\n${YELLOW}[3/8] 配置 npm 镜像源...${NC}"
npm config set registry https://registry.npmmirror.com
echo -e "${GREEN}✅ 已设置淘宝 npm 源${NC}"

# ==============================================
# 🚨 坑 #4: 安装 pm2 进程守护
# ==============================================
echo -e "\n${YELLOW}[4/8] 安装 pm2 进程守护...${NC}"
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
    echo -e "${GREEN}✅ pm2 已安装${NC}"
else
    echo -e "${GREEN}✅ pm2 已存在${NC}"
fi

# ==============================================
# 安装依赖
# ==============================================
echo -e "\n${YELLOW}[5/8] 安装项目依赖...${NC}"
npm install --legacy-peer-deps
echo -e "${GREEN}✅ 依赖安装完成${NC}"

# ==============================================
# 构建项目
# ==============================================
echo -e "\n${YELLOW}[6/8] 构建项目（预计 3-8 分钟）...${NC}"
echo -e "${BLUE}   请耐心等待，这步比较慢...${NC}"
npm run build
echo -e "${GREEN}✅ 构建成功${NC}"

# ==============================================
# 🚨 坑 #5: pm2 启动（关掉终端也不会挂）
# ==============================================
echo -e "\n${YELLOW}[7/8] 启动服务...${NC}"

pm2 delete prompthub 2>/dev/null || true
pm2 start .next/standalone/server.js --name prompthub --max-memory-restart 1G
pm2 startup | tail -1
pm2 save

echo -e "${GREEN}✅ 服务已启动，关掉终端也不会停！${NC}"

# ==============================================
# 🚨 坑 #6: 开放端口
# ==============================================
echo -e "\n${YELLOW}[8/8] 配置防火墙端口...${NC}"

if command -v ufw &> /dev/null; then
    ufw allow 3000
    ufw reload
    echo -e "${GREEN}✅ 防火墙已开放 3000 端口${NC}"
elif command -v firewall-cmd &> /dev/null; then
    firewall-cmd --add-port=3000/tcp --permanent
    firewall-cmd --reload
    echo -e "${GREEN}✅ 防火墙已开放 3000 端口${NC}"
fi

# ==============================================
# 部署完成
# ==============================================
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "你的服务器IP")

echo -e "\n${GREEN}"
echo "╔═══════════════════════════════════════════════╗"
echo "║               🎉 部署完成！                   ║"
echo "╚═══════════════════════════════════════════════╝"
echo -e "${NC}"
echo -e "🌐 访问地址:  ${BLUE}http://$SERVER_IP:3000${NC}"
echo ""
echo -e "📋 常用命令:"
echo -e "   ${BLUE}pm2 status${NC}           查看运行状态"
echo -e "   ${BLUE}pm2 logs prompthub${NC}   查看运行日志"
echo -e "   ${BLUE}pm2 restart prompthub${NC} 重启服务"
echo ""
pm2 status
