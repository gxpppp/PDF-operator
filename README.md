# PDF Master

<p align="center">
  <strong>企业级 PDF 处理软件</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-0.1.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/Tauri-2.0-orange.svg" alt="Tauri">
  <img src="https://img.shields.io/badge/Vue-3.4-brightgreen.svg" alt="Vue">
  <img src="https://img.shields.io/badge/FastAPI-0.109+-red.svg" alt="FastAPI">
</p>

---

## 📖 简介

PDF Master 是一款功能强大的企业级 PDF 处理软件，采用现代化的技术栈构建，提供丰富的 PDF 处理功能。

### ✨ 核心功能

- 📄 **PDF 查看** - 高性能 PDF 阅读器，支持缩放、旋转、搜索
- 🔀 **PDF 合并** - 将多个 PDF 文件合并为一个
- ✂️ **PDF 拆分** - 按页码、范围或固定页数拆分 PDF
- 🔄 **格式转换** - PDF 与 Word、Excel、PPT、图片等格式互转
- 🗜️ **PDF 压缩** - 智能压缩减小 PDF 文件大小
- 🔒 **安全加密** - PDF 加密、解密、权限管理
- 💧 **水印添加** - 文字/图片水印，支持位置、透明度设置
- 📝 **OCR 识别** - 识别扫描 PDF 中的文字
- 🤖 **AI 助手** - AI 驱动的智能 PDF 处理
- ⚡ **批量处理** - 批量处理多个 PDF 文件
- 🔧 **工作流** - 自定义处理流程

---

## 🏗️ 项目结构

```
pdf-master/
├── apps/
│   ├── desktop/          # Tauri + Vue3 桌面应用
│   │   ├── src/          # Vue 前端源码
│   │   └── src-tauri/    # Rust 后端
│   └── server/           # FastAPI 后端服务
│       ├── app/          # 应用代码
│       ├── tests/        # 测试文件
│       └── scripts/      # 工具脚本
├── docs/                 # 文档
└── .github/              # GitHub 配置
```

---

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18.0
- **Python** >= 3.10
- **Rust** >= 1.70 (可选，用于 Tauri 桌面应用)
- **pnpm** >= 8.0

### 后端启动

```bash
# 进入后端目录
cd apps/server

# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 启动服务
python scripts/start_server.py
```

后端服务将运行在 http://localhost:8080

### 前端启动

```bash
# 进入前端目录
cd apps/desktop

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端服务将运行在 http://localhost:1420

### Tauri 桌面应用 (需要 Rust)

```bash
cd apps/desktop
npm run tauri dev
```

---

## 📦 技术栈

### 前端

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.4 | 渐进式 JavaScript 框架 |
| Vue Router | 4.2 | 官方路由管理器 |
| Pinia | 2.1 | 状态管理 |
| TypeScript | 5.3 | 类型安全 |
| Vite | 5.0 | 构建工具 |
| Tauri | 2.0 | 桌面应用框架 |
| pdf.js | 4.0 | PDF 渲染 |
| TailwindCSS | 3.4 | CSS 框架 |

### 后端

| 技术 | 版本 | 说明 |
|------|------|------|
| FastAPI | 0.109+ | 高性能 Python Web 框架 |
| Pydantic | 2.5+ | 数据验证 |
| PyMuPDF | 1.23+ | PDF 处理核心 |
| pikepdf | - | PDF 操作库 |
| pdfplumber | - | PDF 表格提取 |
| PaddleOCR | 2.7+ | OCR 引擎 |
| SQLAlchemy | 2.0+ | ORM |
| Loguru | 0.7+ | 日志 |

---

## 📡 API 文档

启动后端服务后，访问以下地址查看 API 文档：

- Swagger UI: http://localhost:8080/docs
- ReDoc: http://localhost:8080/redoc

### 主要 API 端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `/health` | GET | 健康检查 |
| `/api/v1/pdf/upload` | POST | 上传 PDF |
| `/api/v1/pdf/merge` | POST | 合并 PDF |
| `/api/v1/pdf/split` | POST | 拆分 PDF |
| `/api/v1/pdf/compress` | POST | 压缩 PDF |
| `/api/v1/pdf/watermark` | POST | 添加水印 |
| `/api/v1/ocr/recognize` | POST | OCR 识别 |
| `/api/v1/convert/to-pdf` | POST | 转换为 PDF |
| `/api/v1/system/info` | GET | 系统信息 |

---

## 🧪 测试

### 后端测试

```bash
cd apps/server
pytest
```

### 前端测试

```bash
cd apps/desktop
npm run test
```

---

## 📁 项目特性

- 🌐 **国际化** - 支持中文、英文多语言
- 🎨 **主题切换** - 支持亮色/暗色主题
- 🔌 **插件系统** - 可扩展的插件架构
- 📊 **工作流引擎** - 自定义处理流程
- 🔐 **安全加密** - AES-256 加密支持
- 📱 **响应式设计** - 适配多种屏幕尺寸

---

## 🤝 贡献

欢迎贡献代码！请查看 [贡献指南](CONTRIBUTING.md) 了解详情。

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

---

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

## 🙏 致谢

- [PyMuPDF](https://pymupdf.readthedocs.io/) - 强大的 PDF 处理库
- [pdf.js](https://mozilla.github.io/pdf.js/) - Mozilla 的 PDF 渲染库
- [Tauri](https://tauri.app/) - 现代化桌面应用框架
- [FastAPI](https://fastapi.tiangolo.com/) - 高性能 Python Web 框架
- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架

---

<p align="center">
  Made with ❤️ by PDF Master Team
</p>
