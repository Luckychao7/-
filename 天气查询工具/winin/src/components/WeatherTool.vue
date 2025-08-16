<script setup lang="ts">
import { ref } from 'vue'

const city = ref('')
const weather = ref<any>(null)
const loading = ref(false)
const error = ref('')

function en2zhWeather(en: string) {
  const map: Record<string, string> = {
    'sunny': '晴',
    'clear': '晴',
    'cloudy': '多云',
    'partly cloudy': '多云',
    'overcast': '阴',
    'mist': '薄雾',
    'patchy rain possible': '局部有雨',
    'light rain': '小雨',
    'moderate rain': '中雨',
    'heavy rain': '大雨',
    'thunderstorm': '雷阵雨',
    'snow': '雪',
    'fog': '雾',
    'haze': '霾',
    'patchy rain nearby': '附近有零星小雨',
    'patchy light rain': '局部小雨',
    'patchy moderate rain': '局部中雨',
    'patchy heavy rain': '局部大雨',
    'patchy snow possible': '局部有雪',
    'patchy light snow': '局部小雪',
    'patchy moderate snow': '局部中雪',
    'patchy heavy snow': '局部大雪',
    'light snow': '小雪',
    'moderate snow': '中雪',
    'heavy snow': '大雪',
    'thundery outbreaks possible': '可能有雷暴',
    'blizzard': '暴风雪',
    'freezing fog': '冻雾',
    'drizzle': '毛毛雨',
    'rain': '雨',
    'snow showers': '阵雪',
    'rain showers': '阵雨',
    'sleet': '雨夹雪',
    'ice pellets': '冰粒',
    'torrential rain shower': '暴雨',
    'light sleet': '小雨夹雪',
    'moderate or heavy sleet': '中到大雨夹雪',
    'patchy freezing drizzle possible': '局部有冻毛毛雨',
    'freezing drizzle': '冻毛毛雨',
    'patchy freezing rain possible': '局部有冻雨',
    'freezing rain': '冻雨',
    'other': '未知'
  }
  const key = en.trim().toLowerCase()
  return map[key] || en
}

function windDir2zh(dir: string) {
  const map: Record<string, string> = {
    'N': '北风', 'NNE': '北东北风', 'NE': '东北风', 'ENE': '东东北风', 'E': '东风', 'ESE': '东东南风',
    'SE': '东南风', 'SSE': '南东南风', 'S': '南风', 'SSW': '南西南风', 'SW': '西南风', 'WSW': '西西南风',
    'W': '西风', 'WNW': '西西北风', 'NW': '西北风', 'NNW': '北西北风'
  }
  return map[dir] || dir
}

function getWeatherIcon(desc: string) {
  const d = desc.toLowerCase()
  if (d.includes('sunny') || d.includes('clear')) return new URL('../assets/weather/sunny.svg', import.meta.url).href
  if (d.includes('cloud')) return new URL('../assets/weather/cloudy.svg', import.meta.url).href
  if (d.includes('overcast')) return new URL('../assets/weather/cloudy.svg', import.meta.url).href
  if (d.includes('rain')) {
    if (d.includes('heavy')) return new URL('../assets/weather/heavyrain.svg', import.meta.url).href
    return new URL('../assets/weather/lightrain.svg', import.meta.url).href
  }
  if (d.includes('thunder')) return new URL('../assets/weather/thunder.svg', import.meta.url).href
  if (d.includes('snow')) return new URL('../assets/weather/snow.svg', import.meta.url).href
  if (d.includes('fog') || d.includes('mist')) return new URL('../assets/weather/fog.svg', import.meta.url).href
  if (d.includes('haze')) return new URL('../assets/weather/haze.svg', import.meta.url).href
  return new URL('../assets/weather/unknown.svg', import.meta.url).href
}

function fetchWithTimeout(promise: Promise<any>, ms: number) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('查询超时，请稍后重试')), ms))
  ])
}

async function fetchWeather() {
  if (!city.value) {
    error.value = '请输入城市名！'
    weather.value = null
    return
  }
  error.value = ''
  loading.value = true
  weather.value = null
  try {
    const url = `https://wttr.in/${encodeURIComponent(city.value)}?format=j1`
    const res = await fetchWithTimeout(fetch(url), 5000)
    const data = await res.json()
    if (!data.current_condition || !data.current_condition[0]) throw new Error('未找到该城市或接口异常')
    const now = data.current_condition[0]
    const textEn = now.weatherDesc[0].value
    const windDirEn = now.winddir16Point
    weather.value = {
      city: city.value,
      temp: now.temp_C,
      text: textEn,
      textZh: en2zhWeather(textEn),
      windDir: windDirEn,
      windDirZh: windDir2zh(windDirEn),
      windScale: now.windspeedKmph + ' km/h',
      updateTime: now.localObsDateTime,
      icon: getWeatherIcon(textEn)
    }
  } catch (e: any) {
    error.value = e.message || '查询失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="weather-tool">
    <div class="weather-card">
      <div class="weather-title">
        <img src="/文心一言AI作图_20250815143823.png" class="logo-mini" alt="logo" />
        <span>天气查询工具</span>
      </div>
      <div class="search-bar">
        <input
          v-model="city"
          @keyup.enter="fetchWeather"
          placeholder="请输入城市名，如：北京"
        />
        <button @click="fetchWeather">查询</button>
      </div>
      <div v-if="loading" class="loading">
        <span class="loader"></span> 查询中，请稍候…
      </div>
      <div v-if="error" class="error">{{ error }}</div>
      <transition name="fade">
        <div v-if="weather" class="result">
          <h3>{{ weather.city }}<span class="sub">天气</span></h3>
          <div class="weather-info">
            <img :src="weather.icon" alt="weather icon" class="weather-icon" />
            <div class="weather-detail">
              <div><span class="label">温度：</span>{{ weather.temp }}℃</div>
              <div><span class="label">天气：</span>{{ weather.textZh }} ({{ weather.text }})</div>
              <div><span class="label">风力：</span>{{ weather.windDirZh }} ({{ weather.windDir }}) {{ weather.windScale }}</div>
              <div class="update-time">更新时间：{{ weather.updateTime }}</div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<style scoped>
.weather-tool {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7fafd;
}
.weather-card {
  background: linear-gradient(135deg, #fbc2eb 0%, #fcb69f 30%, #a1c4fd 60%, #c2e9fb 100%, #fbc2eb 100%);
  border-radius: 24px;
  box-shadow: 0 8px 32px 0 rgba(255, 182, 193, 0.15);
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  min-width: 350px;
  max-width: 400px;
  width: 100%;
  margin: 2rem auto;
  position: relative;
  transition: box-shadow 0.2s;
  border: 2px solid #fbc2eb;
}
.weather-title {
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.2rem;
  letter-spacing: 2px;
}
.logo-mini {
  width: 32px;
  height: 32px;
  margin-right: 0.5rem;
}
.search-bar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}
.search-bar input {
  flex: 1;
  padding: 0.6rem 0.9rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
}
.search-bar input:focus {
  border: 1.5px solid #7bb7fa;
}
.search-bar button {
  padding: 0.6rem 1.2rem;
  background: linear-gradient(90deg, #7bb7fa 0%, #5a9cf8 100%);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.search-bar button:hover {
  background: linear-gradient(90deg, #5a9cf8 0%, #7bb7fa 100%);
}
.loading {
  display: flex;
  align-items: center;
  color: #5a9cf8;
  font-size: 1rem;
  margin: 1.2rem 0;
}
.loader {
  border: 3px solid #e0e0e0;
  border-top: 3px solid #5a9cf8;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  margin-right: 0.7rem;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.error {
  color: #e74c3c;
  background: #fbeaea;
  border-radius: 6px;
  padding: 0.7rem 1rem;
  margin-bottom: 1rem;
  font-size: 1rem;
}
.result {
  margin-top: 1.5rem;
  animation: fadeIn 0.5s;
}
@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}
.weather-info {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-top: 1rem;
}
.weather-icon {
  width: 64px;
  height: 64px;
}
.weather-detail {
  font-size: 1.1rem;
  color: #333;
  line-height: 2;
}
.label {
  color: #5a9cf8;
  font-weight: bold;
}
.update-time {
  font-size: 0.9rem;
  color: #888;
  margin-top: 0.5rem;
}
.sub {
  font-size: 1rem;
  color: #5a9cf8;
  margin-left: 0.5rem;
}
</style>

