# 和风天气查询工具

这是一个基于Vue 3和和风天气API的天气查询工具，支持实时天气查询、未来7天天气预报和近5天历史天气查询。

## 功能特点
- 实时天气查询：获取当前温度、天气状况、湿度、风向风速等信息
- 未来7天天气预报：查看未来7天的天气状况和温度范围
- 近5天历史天气：查看过去5天的天气状况和温度范围
- 城市自动补全：输入城市名时提供智能补全建议

## 技术栈
- 前端：Vue 3、Vite、CSS
- 后端：Node.js、Express
- API：和风天气API

## 安装和运行
1. 克隆项目到本地
2. 安装依赖：
   ```bash
   pnpm install
   ```
3. 配置环境变量：
   在项目根目录创建.env文件，并添加以下内容：
   ```env
   VITE_HEFENG_KEY=你的和风天气API密钥
   ```
4. 启动后端代理服务器：
   ```bash
   node weather-proxy.js
   ```
5. 启动前端开发服务器：
   ```bash
   pnpm dev
   ```
6. 在浏览器中访问：http://localhost:5173

## 项目结构
```
├── .env              # 环境变量配置
├── index.html        # 入口HTML文件
├── package.json      # 项目依赖
├── weather-proxy.js  # 后端代理服务器
├── src/
│   ├── App.vue       # 根组件
│   ├── main.js       # 入口文件
│   ├── components/
│   │   └── WeatherSearch.vue  # 天气查询组件
│   └── assets/       # 静态资源
```

## 注意事项
- 请确保已获取和风天气API密钥，并正确配置到.env文件中
- 代理服务器默认运行在3001端口，前端开发服务器默认运行在5173端口
- 本项目仅用于学习和演示目的，请勿用于商业用途

## 常见问题和故障排除
1. **日期格式错误**：确保后端代理使用的日期格式为`YYYYMMDD`，而非`YYYY-MM-DD`
2. **API返回400错误**：检查API密钥是否有效，日期格式是否正确
3. **历史天气日期显示为"Invalid Date"**：这是前端日期解析问题，确保日期格式转换正确
4. **控制台输出过多**：已清理不必要的控制台输出，只保留关键错误信息

更多技术问题和解决方案，请参考：[天气应用技术问题整理](weather-app-technical-issues.md)

## API接口说明
### 后端代理接口
- `GET /api/weather/current?city={city}`: 获取指定城市的实时天气
- `GET /api/weather/forecast?city={city}`: 获取指定城市的未来7天天气预报
- `GET /api/weather/history?city={city}`: 获取指定城市的近4天历史天气
- `GET /api/city/completion?keyword={keyword}`: 获取城市补全建议

## 项目截图
![天气查询工具截图]()

## 更新日志
### v1.0.0 (2025-08-13)
- 初始版本发布
- 实现实时天气查询、未来7天天气预报和近4天历史天气查询功能
- 实现城市自动补全功能

## 许可证
[MIT License](LICENSE)
