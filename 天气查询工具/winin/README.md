# 天气查询工具

## 项目概述
这是一个基于Vue 3 + TypeScript + Vite开发的天气查询工具，能够根据用户输入的城市名称查询实时天气信息。

## 功能特点
- 城市天气查询：输入城市名获取实时天气数据
- 天气状况展示：显示温度、天气状况、风向风力等信息
- 天气图标：根据天气状况显示对应的图标
- 中英文转换：天气状况和风向支持中英文显示
- 响应式设计：适配不同屏幕尺寸
- 加载状态和错误处理：提供友好的用户反馈

## 技术栈
- 前端框架：Vue 3
- 编程语言：TypeScript
- 构建工具：Vite
- HTTP请求：Fetch API
- 天气数据API：[wttr.in](https://wttr.in/)

## 项目结构
```
├── .gitignore
├── .vscode/
├── README.md
├── index.html
├── package.json
├── pnpm-lock.yaml
├── public/
│   └── 文心一言AI作图_20250815143823.png
├── src/
│   ├── App.vue
│   ├── assets/
│   │   └── weather/
│   ├── components/
│   │   └── WeatherTool.vue
│   ├── main.ts
│   ├── style.css
│   └── vite-env.d.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## 安装与运行
1. 安装依赖
```bash
pnpm install
```

2. 运行开发服务器
```bash
pnpm run dev
```

3. 构建生产版本
```bash
pnpm run build
```

## 使用说明
1. 在搜索框中输入城市名称（例如：北京）
2. 点击"查询"按钮或按回车键
3. 查看天气信息结果

## 开发贡献
欢迎提交issue和pull request来改进这个项目。

## 许可证
MIT License
