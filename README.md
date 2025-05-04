#  网页智能摘要工具 | Website Smart Summarizer

[English](#english) | [中文](#chinese)

<h2 id="chinese">中文说明</h2>

一个基于 Tauri + React + TypeScript 开发的网页内容智能摘要工具。支持网页 URL 和直接文本输入两种方式，让信息获取更加便捷。

### 功能特点

- 🔍 双模式输入
  - 支持网页 URL 智能提取
  - 支持直接文本输入分析
- 🤖 使用 AI 生成摘要
- 🎨 美观的 Markdown 渲染
- ⚙️ 专业的配置界面
  - API Key 安全显示
  - 多种预设模型选择
  - 支持自定义模型
  - 可配置 API 设置
- 🌐 支持自定义 API 端点

### 技术栈

- 前端：React + TypeScript + Ant Design + Tailwind CSS
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

1. 启动应用后，可以选择以下两种方式之一：
   - 在 URL 输入框中粘贴要摘要的网页地址
   - 切换到文本输入模式，直接粘贴要总结的文本内容
2. 点击"开始总结"按钮
3. 等待片刻，即可看到生成的摘要内容
4. 可以通过右下角的设置按钮配置 API 参数
5. 点击左下角的原始内容按钮可查看解析的原文

### 配置说明

点击右下角的⚙️图标，可以配置以下参数：
- API Key：你的 OpenAI API 密钥（支持显示/隐藏）
- API Model：选择使用的模型
  - 预设模型：gpt-4o、gpt-4o-mini
  - 支持输入自定义模型
- API URL：API 的基础 URL
- API Path：API 的具体路径
- 提示词：自定义 AI 的行为提示

---

<h2 id="english">English</h2>

A web content summarization tool built with Tauri + React + TypeScript, supporting both URL and direct text input for more convenient information processing.

### Features

- 🔍 Dual Input Modes
  - Smart web content extraction from URL
  - Direct text input analysis
- 🤖 AI-powered summarization
- 🎨 Beautiful Markdown rendering
- ⚙️ Professional Configuration Interface
  - Secure API Key display
  - Multiple preset models
  - Custom model support
  - Configurable API settings
- 🌐 Custom API endpoint support

### Tech Stack

- Frontend: React + TypeScript + Ant Design + Tailwind CSS
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

1. After launching the app, choose one of the following methods:
   - Paste the URL you want to summarize in the URL input box
   - Switch to text input mode and paste the content directly
2. Click the "Summarize" button
3. Wait a moment to see the generated summary
4. Configure API parameters through the settings button in the bottom right corner
5. View the original content by clicking the button in the bottom left corner

### Configuration

Click the ⚙️ icon in the bottom right corner to configure:
- API Key: Your OpenAI API key (with show/hide support)
- API Model: Choose the model to use
  - Preset models: gpt-4o, gpt-4o-mini
  - Support for custom models
- API URL: Base URL for the API
- API Path: Specific path for the API endpoint
- Prompt: Custom AI behavior prompt
