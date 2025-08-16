# 技术问题文档

## API 相关问题

### 1. wttr.in API 跨域问题
**问题描述**：在开发过程中，可能会遇到浏览器跨域限制，导致无法直接请求 wttr.in API。
**解决方案**：
- 使用 Vite 的代理配置来解决跨域问题
- 在 `vite.config.ts` 中添加以下配置：
```typescript
export default defineConfig({
  // ...其他配置
  server: {
    proxy: {
      '/api/weather': {
        target: 'https://wttr.in',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/weather/, ''),
      },
    },
  },
})
```
- 然后在代码中将请求 URL 修改为 `/api/weather/${encodeURIComponent(city.value)}?format=j1`

### 2. API 响应数据格式不一致
**问题描述**：wttr.in API 可能会返回不同格式的数据，特别是对于不同地区的查询。
**解决方案**：
- 在解析数据前添加严格的检查
- 使用 TypeScript 接口定义数据结构
- 添加异常处理机制

### 3. API 请求超时
**问题描述**：网络状况不佳时，API 请求可能会超时。
**解决方案**：
- 实现请求超时处理函数（项目中已实现 `fetchWithTimeout`）
- 设置合理的超时时间（当前设置为 5000ms）
- 提供友好的超时提示

## Vue 3 和 TypeScript 相关问题

### 1. Composition API 的使用
**问题描述**：不熟悉 Vue 3 的 Composition API 语法。
**解决方案**：
- 参考 [Vue 3 官方文档](https://vuejs.org/guide/introduction.html)
- 项目中使用了 `<script setup>` 语法糖，简化了组件的编写
- 学习 `ref`、`computed`、`watch` 等核心 API 的使用

### 2. TypeScript 类型定义
**问题描述**：天气数据的类型定义不明确。
**解决方案**：
- 为天气数据创建明确的接口
```typescript
interface WeatherData {
  city: string;
  temp: string;
  text: string;
  textZh: string;
  windDir: string;
  windDirZh: string;
  windScale: string;
  updateTime: string;
  icon: string;
}
```
- 使用 `as` 关键字进行类型断言（如果必要）

## UI/UX 相关问题

### 1. 天气图标加载失败
**问题描述**：天气图标可能因为路径问题无法正确加载。
**解决方案**：
- 使用 `new URL()` 确保路径的正确性（项目中已实现）
- 提供默认图标作为备用

### 2. 响应式设计适配
**问题描述**：在不同屏幕尺寸下，界面布局可能会出现问题。
**解决方案**：
- 使用 Flexbox 和 Grid 布局
- 设置合适的媒体查询
- 使用相对单位（如 rem、%）而非固定像素

## 性能优化问题

### 1. 重复请求优化
**问题描述**：短时间内多次查询同一城市会导致重复请求。
**解决方案**：
- 添加请求防抖或节流
- 缓存已查询的城市天气数据

### 2. 组件重渲染优化
**问题描述**：不必要的组件重渲染会影响性能。
**解决方案**：
- 使用 `memo` 或 `shallowRef` 减少不必要的重渲染
- 合理设计组件结构，避免过度拆分

## 部署相关问题

### 1. 生产环境构建
**问题描述**：生产环境构建可能遇到各种问题。
**解决方案**：
- 确保 `vite.config.ts` 配置正确
- 检查 TypeScript 配置是否符合生产要求
- 使用 `pnpm run build` 命令进行构建

### 2. 静态资源路径问题
**问题描述**：部署后静态资源（如图标）可能无法正确加载。
**解决方案**：
- 确保使用正确的资源路径
- 配置 Vite 的 `base` 选项（如果部署在子路径下）