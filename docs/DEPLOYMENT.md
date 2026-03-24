# AI Agent Ecosystem - Private Deployment Guide

**Document**: Private Deployment Guide
**Version**: 1.0
**Date**: 2026-03-24
**Status**: Ready for Implementation

---

## 1. Deployment Overview

### 1.1 Deployment Types

| Deployment Type | Target Users | Complexity | Use Case |
|:----------------|:-------------|:-----------|:---------|
| **Local Clone** | Individual users | Very Low | Personal use, testing |
| **GitHub Pages** | Public access | Low | Community showcase |
| **Private Server** | Teams, organizations | Medium | Internal use |
| **Enterprise** | Large organizations | High | Mission-critical |
| **Air-Gapped** | High-security | Very High | Classified environments |

### 1.2 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT ARCHITECTURE                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    PUBLIC DEPLOYMENT                             │   │
│  │                                                                 │   │
│  │   GitHub ──► GitHub Pages ──► Global CDN ──► Users             │   │
│  │       │                                                              │   │
│  │       └──► Raw File Server ──► AI Platforms                    │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    PRIVATE DEPLOYMENT                             │   │
│  │                                                                 │   │
│  │   ┌─────────┐     ┌─────────┐     ┌─────────┐                  │   │
│  │   │  Local  │ ──► │ Private │ ──► │  Local  │                  │   │
│  │   │  Git    │     │  File   │     │  AI     │                  │   │
│  │   └─────────┘     │ Server  │     │ Server  │                  │   │
│  │                   └─────────┘     └─────────┘                  │   │
│  │                        │                                      │   │
│  │                        ▼                                      │   │
│  │                   ┌─────────┐                                 │   │
│  │                   │ Enterprise│                                │   │
│  │                   │  CDN    │                                 │   │
│  │                   └─────────┘                                 │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Local Deployment (Individual)

### 2.1 Prerequisites

| Requirement | Version | Notes |
|:------------|:--------|:------|
| Git | Latest | Version control |
| Text Editor | Any | VS Code recommended |
| Web Browser | Modern | For browsing documentation |

### 2.2 Step-by-Step Guide

```bash
# Step 1: Clone the repository
git clone https://github.com/badhope/mobile-skills.git

# Step 2: Navigate to directory
cd mobile-skills

# Step 3: View available agents
ls agents/

# Step 4: Read specific agent
cat agents/functional/smart-planner.md

# Step 5: Use with AI platform
# Copy the raw URL or local file path
```

### 2.3 File Access Methods

| Method | URL Format | Use Case |
|:-------|:----------|:---------|
| **GitHub Raw** | `https://raw.githubusercontent.com/...` | AI platforms with web access |
| **Local File** | `file:///path/to/agent.md` | Local AI deployments |
| **Copied Content** | Manual copy-paste | Any platform |

---

## 3. GitHub Pages Deployment

### 3.1 Current Setup

The project uses GitHub Pages for public documentation hosting.

**URL**: https://badhope.github.io/mobile-skills/

### 3.2 Custom Domain Setup (Optional)

```yaml
# CNAME file content
agents.example.com
```

### 3.3 GitHub Pages Configuration

```yaml
# _config.yml (if needed)
repository: badhope/mobile-skills
title: AI Agent Ecosystem
description: Open-source AI Agent collection
```

---

## 4. Private Server Deployment

### 4.1 Server Requirements

| Resource | Minimum | Recommended |
|:---------|:--------|:------------|
| CPU | 1 core | 2+ cores |
| RAM | 1 GB | 2+ GB |
| Storage | 10 GB | 50+ GB |
| OS | Ubuntu 20.04+ | Ubuntu 22.04 LTS |
| Web Server | Nginx/Apache | Nginx |

### 4.2 Nginx Configuration

```nginx
server {
    listen 80;
    server_name agents.internal.example.com;

    root /var/www/mobile-skills;
    index index.html;

    # Enable CORS for AI platforms
    add_header 'Access-Control-Allow-Origin' '*';
    add_header 'Access-Control-Allow-Methods' 'GET, OPTIONS';

    # Cache control
    location ~* \.(md|yaml)$ {
        add_header Cache-Control 'no-cache';
    }

    # Static assets cache
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1d;
        add_header Cache-Control 'public, immutable';
    }

    # Enable directory listing
    autoindex on;
    autoindex_exact_size off;
    autoindex_localtime on;
}
```

### 4.3 Apache Configuration

```apache
<VirtualHost *:80>
    ServerName agents.internal.example.com
    DocumentRoot /var/www/mobile-skills

    <Directory /var/www/mobile-skills>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted

        # CORS headers
        Header set Access-Control-Allow-Origin "*"
        Header set Access-Control-Allow-Methods "GET, OPTIONS"
    </Directory>

    # Cache markdown files
    <FilesMatch "\.(md|yaml)$">
        Header set Cache-Control "no-cache"
    </FilesMatch>
</VirtualHost>
```

### 4.4 Docker Deployment

```dockerfile
# Dockerfile
FROM nginx:alpine

COPY . /usr/share/nginx/html

RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    location ~* \.(md|yaml)$ { \
        add_header Cache-Control "no-cache"; \
        add_header Access-Control-Allow-Origin "*"; \
    } \
    \
    location / { \
        try_files $uri $uri/ =404; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Build and run
docker build -t mobile-skills:latest .
docker run -d -p 8080:80 --name mobile-skills mobile-skills:latest
```

---

## 5. Enterprise Deployment

### 5.1 Enterprise Requirements

| Component | Requirement | Notes |
|:----------|:------------|:------|
| **Load Balancer** | Required for 100+ users | Nginx, HAProxy |
| **SSL/TLS** | Required | Let's Encrypt recommended |
| **Backup** | Daily recommended | 7-day retention minimum |
| **Monitoring** | Required | Prometheus, Grafana |
| **Authentication** | Optional | LDAP, OAuth2 |

### 5.2 High Availability Setup

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    HIGH AVAILABILITY ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                         ┌─────────────┐                                │
│                         │Load Balancer│                                │
│                         └──────┬──────┘                                │
│                                │                                        │
│              ┌─────────────────┼─────────────────┐                    │
│              │                 │                 │                    │
│              ▼                 ▼                 ▼                    │
│        ┌──────────┐       ┌──────────┐       ┌──────────┐           │
│        │ Server 1 │       │ Server 2 │       │ Server 3 │           │
│        │ (Active) │       │ (Active) │       │(Standby) │           │
│        └────┬─────┘       └────┬─────┘       └──────────┘           │
│              │                 │                                       │
│              └────────┬────────┘                                        │
│                       │                                                │
│                       ▼                                                │
│                ┌──────────────┐                                        │
│                │ Shared Storage│                                       │
│                │ (NFS/Gluster)│                                        │
│                └──────────────┘                                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.3 Backup Strategy

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backup/mobile-skills"
REPO_DIR="/var/www/mobile-skills"
DATE=$(date +%Y%m%d)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup repository
tar -czf $BACKUP_DIR/repo-$DATE.tar.gz $REPO_DIR

# Backup git history
git --git-dir=$REPO_DIR/.git --work-tree=$REPO_DIR bundle create $BACKUP_DIR/history-$DATE.bundle --all

# Cleanup old backups (keep 7 days)
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR -name "*.bundle" -mtime +7 -delete

# Log
echo "$(date): Backup completed - $BACKUP_DIR/repo-$DATE.tar.gz"
```

### 5.4 Monitoring Setup

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'mobile-skills'
    static_configs:
      - targets: ['localhost:8080']
    metrics_path: '/metrics'
```

```yaml
# grafana-dashboard.json
{
  "dashboard": {
    "title": "AI Agent Ecosystem",
    "panels": [
      {
        "title": "Requests/sec",
        "type": "graph",
        "targets": [
          {"expr": "rate(http_requests_total[5m])"}
        ]
      },
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {"expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))"}
        ]
      }
    ]
  }
}
```

---

## 6. Air-Gapped Deployment

### 6.1 Air-Gapped Considerations

| Aspect | Consideration | Solution |
|:-------|:--------------|:---------|
| **Updates** | No internet access | Manual USB transfer |
| **Security** | Maximum isolation | Verify all media |
| **Compliance** | May be required | Document procedures |
| **Maintenance** | More difficult | Scheduled updates |

### 6.2 Air-Gapped Setup Process

```bash
# Step 1: On internet-connected machine
git clone https://github.com/badhope/mobile-skills.git
tar -czvf mobile-skills-airgapped.tar.gz mobile-skills/

# Step 2: Transfer via secure media (USB, etc.)
# Verify checksums before transfer

# Step 3: On air-gapped machine
tar -xzvf mobile-skills-airgapped.tar.gz
cd mobile-skills

# Step 4: Serve locally
cd agents
python3 -m http.server 8080

# Step 5: Access via
# http://localhost:8080/functional/smart-planner.md
```

### 6.3 Security Checklist

- [ ] Verify SHA256 checksums before installation
- [ ] Sign releases with GPG (when available)
- [ ] Disable network interfaces after installation
- [ ] Implement physical access controls
- [ ] Document all access (audit trail)

---

## 7. Configuration Reference

### 7.1 Environment Variables

| Variable | Default | Description |
|:---------|:--------|:------------|
| `AGENT_BASE_URL` | GitHub Raw URL | Base URL for agent files |
| `AGENT_CACHE_TTL` | 300 | Cache TTL in seconds |
| `AGENT_MAX_SIZE` | 1048576 | Max file size (bytes) |
| `AGENT_ALLOWED_CATS` | all | Comma-separated allowed categories |

### 7.2 Configuration File

```yaml
# config.yaml
deployment:
  mode: private
  base_url: https://agents.internal.example.com
  cors_enabled: true
  cors_origins:
    - https://claude.ai
    - https://chat.openai.com
    - https://gemini.google.com

security:
  rate_limit: 100
  max_file_size: 1048576
  allowed_extensions:
    - .md
    - .yaml

cache:
  enabled: true
  ttl: 300
  max_entries: 1000

logging:
  level: info
  format: json
```

---

## 8. Troubleshooting

### 8.1 Common Issues

| Issue | Cause | Solution |
|:------|:------|:---------|
| CORS errors | Missing headers | Configure CORS on server |
| 404 on files | Incorrect path | Verify file exists |
| Slow loading | Large files | Enable compression |
| SSL errors | Invalid certificate | Renew/reinstall cert |

### 8.2 Debug Commands

```bash
# Check file exists
curl -I https://your-server/agents/functional/smart-planner.md

# Verify CORS headers
curl -H "Origin: https://claude.ai" -I https://your-server/agents/functional/smart-planner.md

# Check nginx config
nginx -t

# Test SSL certificate
openssl s_client -connect your-server:443
```

---

## 9. Performance Optimization

### 9.1 CDN Configuration

```javascript
// CDN with edge caching
// Deploy to multiple CDN providers:
// - Cloudflare
// - Fastly
// - AWS CloudFront
// - CloudFront
```

### 9.2 Compression

```nginx
# Enable gzip compression
gzip on;
gzip_types text/plain text/markdown application/json;
gzip_min_length 1000;
```

### 9.3 Caching Headers

| File Type | Cache Duration | Header |
|:----------|:---------------|:-------|
| Markdown | No cache | `Cache-Control: no-cache` |
| CSS/JS | 1 day | `Cache-Control: public, max-age=86400` |
| Images | 1 week | `Cache-Control: public, max-age=604800` |
| Fonts | 1 month | `Cache-Control: public, max-age=2592000` |

---

## 10. Security Hardening

### 10.1 Security Checklist

- [ ] Enable HTTPS/TLS
- [ ] Disable directory listing (optional, for privacy)
- [ ] Configure CORS properly
- [ ] Implement rate limiting
- [ ] Set up audit logging
- [ ] Regular security updates

### 10.2 SSL Configuration

```nginx
# Let's Encrypt (recommended)
server {
    listen 443 ssl http2;
    server_name agents.example.com;

    ssl_certificate /etc/letsencrypt/live/agents.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/agents.example.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
}
```

### 10.3 Rate Limiting

```nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

server {
    location /agents {
        limit_req zone=api burst=20 nodelay;
    }
}
```

---

**Document Status**: Complete
**Next Update**: After first deployment feedback