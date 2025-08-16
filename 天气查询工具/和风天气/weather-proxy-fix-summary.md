# 和风天气代理服务器修复总结

## 问题背景
代理服务器在转发请求到和风天气API时出现问题，主要表现为API返回非JSON格式数据，导致前端无法正确解析。具体错误信息为：`{"error":"和风天气API返回非JSON: "}`。

## 问题原因
1. API路径不正确：缺少`/geo`前缀，正确路径应为`/geo/v2/city/lookup`而非`/v2/city/lookup`
2. 部分API请求没有使用环境变量中定义的API主机地址，导致无法灵活切换API环境
3. 代码中存在硬编码的API地址，如`https://devapi.qweather.com`，不利于维护
4. 代理服务器日志输出不够详细，难以定位问题根源
5. 测试过程中遇到PowerShell命令执行失败问题，无法使用`curl`和`Invoke-WebRequest`命令

## 解决方案
在解决问题的过程中，我们采取了以下步骤：

1. 检查代理服务器日志，发现API返回非JSON格式数据
2. 对比用户提供的有效API URL，发现路径中缺少`/geo`前缀
3. 检查代码，发现多处存在硬编码API地址和不正确的路径
4. 修改`getLocationId`函数和`/api/city`路由中的API路径
5. 确保所有API请求都使用环境变量中定义的API主机地址
6. 添加详细的日志输出，以便于调试

具体修改如下：

### 1. 更新`getLocationId`函数中的API路径
```javascript
// 修改前
const url = `${API_HOST}/v2/city/lookup?location=${encodeURIComponent(city)}&key=${HEFENG_KEY}`;

// 修改后
const url = `${API_HOST}/geo/v2/city/lookup?location=${encodeURIComponent(city)}&key=${HEFENG_KEY}`;
```

### 2. 更新`/api/city`路由中的API路径
```javascript
// 修改前
const url = `https://devapi.qweather.com/v2/city/lookup?location=${encodeURIComponent(name)}&key=${HEFENG_KEY}`;

// 修改后
const url = `${API_HOST}/geo/v2/city/lookup?location=${encodeURIComponent(name)}&key=${HEFENG_KEY}`;
```

## 测试过程与结果
在修复过程中，我们遇到了测试工具的问题：

1. 使用`curl`命令测试时，遇到PowerShell环境下的执行错误
2. 尝试使用PowerShell的`Invoke-WebRequest`命令，也遇到了命令未识别的错误
3. 最终通过调整测试方式，成功执行了API请求测试

修改后，使用以下命令测试API：
```bash
curl http://localhost:3001/api/city?name=北京
```

测试结果显示API请求成功，返回状态码200和有效的JSON响应，包含北京的天气信息。

## 总结与经验教训
通过本次修复，我们获得了以下经验教训：

1. 开发过程中应严格遵循API文档，确保路径的正确性
2. 避免硬编码配置信息，应使用环境变量以便于灵活切换环境
3. 添加详细的日志输出对于调试和问题定位至关重要
4. 在跨平台环境下测试时，应注意不同终端和命令行工具的兼容性问题
5. 修复问题时，应全面检查所有相关代码，确保一致性修改

最终，通过更新API路径并确保所有请求都使用环境变量中定义的API主机地址，成功解决了代理服务器转发请求的问题。现在代理服务器能够正确处理请求并返回有效的JSON响应。