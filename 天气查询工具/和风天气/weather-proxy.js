import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = 3001;
const HEFENG_KEY = process.env.VITE_HEFENG_KEY || '';
const API_HOST = process.env.VITE_API_HOST || 'https://devapi.qweather.com';

console.log(`使用API主机地址: ${API_HOST}`);

// 检查API密钥是否存在
if (!HEFENG_KEY) {
  console.error('错误: 未找到和风天气API密钥，请在.env文件中设置VITE_HEFENG_KEY');
  process.exit(1);
}

// CORS中间件应放在所有路由前
app.use(cors());
app.use(express.json());


// 通用请求头
const COMMON_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Node.js Proxy)',
  'Accept': 'application/json'
};

// 处理JSON响应的工具函数
async function handleJsonResponse(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (jsonErr) {
    console.error('和风天气API返回非JSON:', text);
    throw new Error(`和风天气API返回非JSON: ${text.substring(0, 200)}...`);
  }
}

// 获取城市ID
async function getLocationId(city) {
  const url = `${API_HOST}/geo/v2/city/lookup?location=${encodeURIComponent(city)}&key=${HEFENG_KEY}`;
  try {
    const res = await fetch(url, {
      headers: COMMON_HEADERS,
      timeout: 10000
    });
    const data = await handleJsonResponse(res);
    if (data && data.code === '200' && Array.isArray(data.location) && data.location.length > 0) {
      return data.location[0].id;
    }
    throw new Error(`未找到该城市，或API响应异常: 代码=${data?.code}`);
  } catch (e) {
    console.error(`请求和风天气API失败:`, e);
    throw new Error(`请求和风天气API失败: ${e.message}`);
  }
}



app.get('/api/weather', async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: '缺少城市参数' });
  try {
    const locationId = await getLocationId(city);
    const url = `${API_HOST}/v7/weather/now?location=${locationId}&key=${HEFENG_KEY}&lang=zh`;
    const weatherRes = await fetch(url, {
      headers: COMMON_HEADERS
    });
    const weatherData = await handleJsonResponse(weatherRes);
    if (weatherData.code !== '200') {
      console.error('和风天气API错误:', weatherData);
      return res.status(502).json({ error: weatherData.message || '天气查询失败', code: weatherData.code });
    }
    res.json({
      city: city,
      ...weatherData.now
    });
  } catch (e) {
    console.error('代理服务错误:', e);
    res.status(500).json({ error: e.message });
  }
});


// 获取未来7天天气预报
app.get('/api/weather/forecast', async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: '缺少城市参数' });
  try {
    const locationId = await getLocationId(city);
    const url = `${API_HOST}/v7/weather/7d?location=${locationId}&key=${HEFENG_KEY}&lang=zh`;
    const forecastRes = await fetch(url, {
      headers: COMMON_HEADERS
    });
    const forecastData = await handleJsonResponse(forecastRes);
    if (forecastData.code !== '200') {
      console.error('和风天气API错误:', forecastData);
      return res.status(502).json({ error: forecastData.message || '天气预报查询失败', code: forecastData.code });
    }
    res.json(forecastData.daily);
  } catch (e) {
    console.error('代理服务错误:', e);
    res.status(500).json({ error: e.message });
  }
});

// 获取历史天气（近5天）
app.get('/api/weather/history', async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: '缺少城市参数' });
  try {
    const locationId = await getLocationId(city);
    // 生成近4天的日期 (格式: yyyyMMdd，不包含今天)
    let dates = [];
    const today = new Date();
    // 确保不生成未来日期
    today.setHours(0, 0, 0, 0);
    
    // 生成过去4天的日期（不包含今天）
    for (let i = 1; i <= 4; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      // 格式化为 yyyyMMdd (和风天气API要求的格式)
      const formattedDate = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
      dates.push(formattedDate);
    }
    // 获取每天的历史天气
    const historyData = [];
    for (const date of dates) {
      // 构建完整的API请求URL
      const url = `${API_HOST}/v7/historical/weather?location=${locationId}&date=${date}&key=${HEFENG_KEY}&lang=zh&unit=m`;
      try {
          // 添加常见浏览器请求头以模拟浏览器请求
          const options = {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
              'Accept': 'application/json, text/plain, */*',
              'Accept-Language': 'zh-CN,zh;q=0.9'
            },
            timeout: 10000  // 设置10秒超时
          };

          const historyRes = await fetch(url, options);
          const dayData = await handleJsonResponse(historyRes);
          
          if (dayData.code === '200') {
              // 检查API响应结构
              if (dayData.weatherHourly && Array.isArray(dayData.weatherHourly) && dayData.weatherHourly.length > 0) {
                // 提取所有小时温度
                const temps = dayData.weatherHourly.map(entry => {
                  // 确保温度是数字
                  const temp = parseFloat(entry.temp);
                  return isNaN(temp) ? null : temp;
                }).filter(temp => temp !== null);
                
                // 提取天气状况
                const weatherConditions = dayData.weatherHourly.map(entry => entry.text);
                
                // 计算最低和最高温度
                const tempMin = temps.length > 0 ? Math.min(...temps) : null;
                const tempMax = temps.length > 0 ? Math.max(...temps) : null;
                
                // 找出出现最频繁的天气状况
                const conditionCounts = {};
                weatherConditions.forEach(condition => {
                  conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
                });
                
                let mostCommonCondition = '未知';
                let maxCount = 0;
                Object.entries(conditionCounts).forEach(([condition, count]) => {
                  if (count > maxCount) {
                    maxCount = count;
                    mostCommonCondition = condition;
                  }
                });
                      
                historyData.push({
                  fxDate: date,
                  textDay: mostCommonCondition,
                  tempMin: tempMin !== null ? tempMin.toString() : '未知',
                  tempMax: tempMax !== null ? tempMax.toString() : '未知'
                });
              } else if (dayData.daily && Array.isArray(dayData.daily) && dayData.daily.length > 0) {
                // 尝试从daily字段获取数据
                const dailyData = dayData.daily[0];
                const textDay = dailyData.textDay || dailyData.condition || '未知';
                const tempMin = dailyData.tempMin !== undefined ? dailyData.tempMin : '未知';
                const tempMax = dailyData.tempMax !== undefined ? dailyData.tempMax : '未知';
                 
                historyData.push({
                  fxDate: date,
                  textDay: textDay,
                  tempMin: tempMin.toString(),
                  tempMax: tempMax.toString()
                });
              } else {
                console.error(`获取${date}历史天气失败: 响应结构不符合预期`);
                historyData.push({
                  fxDate: date,
                  textDay: '未知',
                  tempMin: '未知',
                  tempMax: '未知'
                });
              }
          } else {
            console.error(`获取${date}历史天气失败: API返回错误代码 ${dayData.code || '未知'}, 消息 ${dayData.message || '无详细消息'}`);
            historyData.push({
              fxDate: date,
              textDay: '未知',
              tempMin: '未知',
              tempMax: '未知'
            });
          }
      } catch (e) {
        console.error(`获取${date}历史天气失败:`, e);
        historyData.push({
          fxDate: date,
          textDay: '未知',
          tempMin: '未知',
          tempMax: '未知'
        });
        // 继续尝试其他日期
      }
    }
    res.json(historyData);
  } catch (e) {
    console.error('代理服务错误:', e);
    res.status(500).json({ error: e.message });
  }
});

// 端口监听放在所有路由后
app.listen(PORT, () => {
  console.log(`天气代理服务已启动: http://localhost:${PORT}`);
});


// 城市自动补全接口
app.get('/api/city', async (req, res) => {
  const name = req.query.name;
  if (!name) return res.status(400).json({ error: '缺少城市名参数' });
  try {
    const url = `${API_HOST}/geo/v2/city/lookup?location=${encodeURIComponent(name)}&key=${HEFENG_KEY}`;
    const cityRes = await fetch(url, {
      headers: COMMON_HEADERS
    });
    const data = await handleJsonResponse(cityRes);
    if (data.code === '200' && Array.isArray(data.location)) {
      res.json({ location: data.location });
    } else {
      res.json({ location: [] });
    }
  } catch (e) {
    console.error('代理服务错误:', e);
    res.status(500).json({ error: e.message });
  }
});