# 🚀 Mobile Skills - 部署包

本文件夹包含完整的静态部署文件，可以直接部署到任何静态托管服务。

## 📊 部署包信息

| 项目 | 详情 |
|------|------|
| **版本** | v2.1.0 |
| **总文件数** | 3359 个 |
| **预渲染页面** | 373 个 |
| **构建时间** | 2026-04-17 |

## 🎯 支持的部署平台

| 平台 | 方法 |
|------|------|
| **GitHub Pages** | 上传本文件夹所有内容 |
| **Vercel / Netlify** | 直接上传本文件夹 |
| **Nginx / Apache** | 放到网站根目录 |
| **CDN 托管** | 上传所有文件至 CDN |
| **云存储 (OSS/COS)** | 配置静态网站托管 |

## 📁 目录结构

```
deploy/
├── index.html                    # 入口文件
├── 404.html                      # 错误页面
├── sitemap.xml                   # 站点地图
├── robots.txt                    # 爬虫规则
├── manifest.json                 # PWA 清单
├── service-worker.js             # PWA 服务
├── favicon.ico / favicon.svg     # 图标
│
├── skills-data.json              # 技能完整数据 (4.5MB)
├── skills.json                   # 技能精简数据
├── ai-tools.json                 # AI工具数据 (1MB)
│
├── _next/                        # Next.js 构建资源
├── skills/                       # 300+ 技能详情页（SSG）
├── tools/                        # 工具详情页
├── category/                     # 分类页面
│
├── about/
├── categories/
├── search/
├── favorites/
├── settings/
└── ... 其他页面
```

## ✅ 验证方法

本地验证部署是否正常：

```bash
cd deploy
python -m http.server 8080
# 或者
npx serve .
```

然后访问 http://localhost:8080

---

**🎉 本文件夹就是完整的网站，直接上传即可使用！**
