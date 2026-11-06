# 🍅 番茄钟 · Pomodoro Timer

一个简洁现代的番茄钟计时器，帮助你保持专注、高效工作。

![Tech Stack](https://img.shields.io/badge/React-18-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-7-purple?logo=vite)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-cyan?logo=tailwindcss)

## ✨ 功能特性

- **三种计时模式** — 专注 25 分钟、短休息 5 分钟、长休息 15 分钟，一键切换
- **开始 / 暂停 / 重置** — 完整的计时控制，随时开始或暂停
- **圆形进度环** — 时间走动时进度环顺时针填满，直观可视
- **时间到提示音** — 使用 Web Audio API 生成悦耳的三连音铃声，无需外部音频文件
- **今日完成统计** — 每完成一个专注番茄自动计数，追踪每日产出
- **标签页实时倒计时** — 切到其他标签页也能在浏览器标题栏看到剩余时间
- **响应式设计** — 在手机和桌面端都有良好的显示效果

## 🛠️ 技术栈

| 技术 | 用途 |
| --- | --- |
| [React 18](https://react.dev/) | UI 框架 |
| [TypeScript](https://www.typescriptlang.org/) | 类型安全 |
| [Vite 7](https://vite.dev/) | 构建工具与开发服务器 |
| [Tailwind CSS 3](https://tailwindcss.com/) | 原子化 CSS 样式 |
| [Lucide React](https://lucide.dev/) | 图标库 |

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

### 类型检查

```bash
npm run typecheck
```

## 📂 项目结构

```
.
├── index.html              # HTML 入口
├── src/
│   ├── App.tsx             # 番茄钟主组件（计时逻辑 + 界面）
│   ├── main.tsx            # React 应用入口
│   ├── index.css           # 全局样式（Tailwind 指令）
│   └── vite-env.d.ts       # Vite 类型声明
├── vite.config.ts          # Vite 配置（含 @ 路径别名）
├── tailwind.config.js      # Tailwind 配置
├── tsconfig.json           # TypeScript 配置
└── package.json
```

## 🧠 工作原理

### 计时

计时使用 `setInterval` 每秒递减剩余秒数，到达零时自动停止并播放提示音。

### 提示音

通过 Web Audio API 生成声音 —— 创建三个正弦波振荡器依次播放 880Hz、1108.73Hz、1318.51Hz 的音符，无需引入任何音频文件，也无需额外依赖。

### 进度环

使用 SVG 圆形配合 `strokeDasharray` 和 `strokeDashoffset` 实现进度动画，随时间流逝顺时针填充。

## 📄 许可证

MIT
