#  网页智能摘要工具 | Website Smart Summarizer

[English](#english) | [中文](#chinese)

<h2 id="chinese">中文说明</h2>

一个基于 Tauri + React + TypeScript 开发的网页内容智能摘要工具。

### 功能特点

- 🔍 智能提取网页主要内容
- 🤖 使用 AI 生成摘要
- 🎨 美观的 Markdown 渲染
- ⚙️ 可配置的 API 设置
- 🌐 支持自定义 API 端点

### 技术栈

- 前端：React + TypeScript + Tailwind CSS
- 后端：Rust + Tauri
- AI：OpenAI API
- 存储：Tauri Store Plugin

### 快速开始

1. 克隆项目
```bash
git clone [项目地址]
cd url-summarizer
```

2. 安装依赖
```bash
pnpm install
```

3. 运行开发环境
```bash
pnpm tauri dev
```

4. 构建应用
```bash
pnpm tauri build
```

### 使用说明

1. 启动应用后，在输入框中粘贴要摘要的网页 URL
2. 点击"开始总结"按钮
3. 等待片刻，即可看到生成的摘要内容
4. 可以通过右下角的设置按钮配置 API 参数

### 配置说明

点击右下角的⚙️图标，可以配置以下参数：
- API Key：你的 OpenAI API 密钥
- API Model：选择使用的模型
- API URL：API 的基础 URL
- API Path：API 的具体路径

---

<h2 id="english">English</h2>

A web content summarization tool built with Tauri + React + TypeScript.

### Features

- 🔍 Smart web content extraction
- 🤖 AI-powered summarization
- 🎨 Beautiful Markdown rendering
- ⚙️ Configurable API settings
- 🌐 Custom API endpoint support

### Tech Stack

- Frontend: React + TypeScript + Tailwind CSS
- Backend: Rust + Tauri
- AI: OpenAI API
- Storage: Tauri Store Plugin

### Quick Start

1. Clone the project
```bash
git clone [project-url]
cd url-summarizer
```

2. Install dependencies
```bash
pnpm install
```

3. Run development environment
```bash
pnpm tauri dev
```

4. Build the application
```bash
pnpm tauri build
```

### Usage

1. After launching the app, paste the URL you want to summarize in the input box
2. Click the "Summarize" button
3. Wait a moment to see the generated summary
4. Configure API parameters through the settings button in the bottom right corner

### Configuration

Click the ⚙️ icon in the bottom right corner to configure:
- API Key: Your OpenAI API key
- API Model: Choose the model to use
- API URL: Base URL for the API
- API Path: Specific path for the API endpoint
