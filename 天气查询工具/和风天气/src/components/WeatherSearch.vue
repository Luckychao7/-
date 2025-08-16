<template>
  <div class="weather-search card">
    <div class="search-container">
      <input 
        v-model="city"
        placeholder="请输入城市名"
        @input="onCityInput"
        @keyup.enter="fetchWeather"
        autocomplete="off"
        class="search-input"
      />
      <button @click="fetchWeather" class="search-button">查询</button>
      <ul v-if="suggestions.length" class="suggestions">
        <li v-for="item in suggestions" :key="item.id" @click="selectSuggestion(item)">{{ item.name }}{{ item.adm2 ? '（' + item.adm2 + '）' : '' }}</li>
      </ul>
    </div>
    <transition name="fade">
      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
        <p>查询中...</p>
      </div>
    </transition>
    <div v-if="error" class="error">{{ error }}</div>
    <transition name="fade" mode="out-in">
      <div v-if="weather" :class="'weather-container weather-' + getWeatherClass(weather.text)">
        <div class="current-weather">
          <div class="location-info">
            <h2>{{ weather.city }} 天气</h2>
            <p class="update-time">更新时间: {{ formatTime(weather.obsTime) }}</p>
          </div>
          <div class="weather-main">
            <div class="temperature">
              <span class="temp-value">{{ weather.temp }}°</span>
              <span class="temp-unit">C</span>
            </div>
            <div class="weather-details">
              <i :class="'qi-' + getWeatherIcon(weather.text) + ' weather-icon'"></i>
              <span class="weather-text">{{ weather.text }}</span>
            </div>
          </div>
        </div>
        
        <div class="weather-metrics">
          <div class="metric-item">
            <i class="qi-humidity metric-icon"></i>
            <div class="metric-info">
              <p class="metric-label">湿度</p>
              <p class="metric-value">{{ weather.humidity }}%</p>
            </div>
          </div>
          <div class="metric-item">
            <i class="qi-wind metric-icon"></i>
            <div class="metric-info">
              <p class="metric-label">风向风力</p>
              <p class="metric-value">{{ weather.windDir }} {{ weather.windScale }}级</p>
            </div>
          </div>
          <div class="metric-item">
            <i class="qi-pressure metric-icon"></i>
            <div class="metric-info">
              <p class="metric-label">气压</p>
              <p class="metric-value">{{ weather.pressure || 'N/A' }} hPa</p>
            </div>
          </div>
          <div class="metric-item">
            <i class="qi-visibility metric-icon"></i>
            <div class="metric-info">
              <p class="metric-label">能见度</p>
              <p class="metric-value">{{ weather.vis || 'N/A' }} km</p>
            </div>
          </div>
        </div>
        
        <div v-if="forecast.length" class="forecast-container">
          <h3>未来天气预报</h3>
          <div class="forecast-list">
            <div v-for="item in forecast" :key="item.fxDate" class="forecast-item">
              <div class="forecast-date">{{ formatDate(item.fxDate) }}</div>
              <div class="forecast-icon"><i :class="'qi-' + getWeatherIcon(item.textDay)"></i></div>
              <div class="forecast-text">{{ item.textDay }}</div>
              <div class="forecast-temp">{{ item.tempMin }}° ~ {{ item.tempMax }}°</div>
            </div>
          </div>
        </div>
        
        <div v-if="history && history.length" class="history-container">
          <h3>历史天气</h3>
          <div class="history-list">
            <div v-for="item in history" :key="item.fxDate" class="history-item">
              <div class="history-date">{{ formatDate(item.fxDate) }}</div>
              <div class="history-icon"><i :class="'qi-' + getWeatherIcon(item.textDay)"></i></div>
              <div class="history-text">{{ item.textDay }}</div>
              <div class="history-temp">{{ item.tempMin }}° ~ {{ item.tempMax }}°</div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'WeatherSearch',
  data() {
    return {
      city: '',
      weather: null,
      forecast: [],
      history: [],
      suggestions: [],
      loading: false,
      error: '',
      // 天气图标映射
      weatherIcons: {
        '晴': 'sunny',
        '多云': 'cloudy',
        '阴天': 'overcast',
        '小雨': 'light-rain',
        '中雨': 'moderate-rain',
        '大雨': 'heavy-rain',
        '暴雨': 'rainstorm',
        '雷阵雨': 'thunderstorm',
        '雪': 'snow',
        '雾': 'fog',
        '霾': 'haze'
      }
    };
  },
  methods: {
      // 获取天气对应的图标类名
      getWeatherIcon(text) {
        console.log('天气文本:', text);
        // 尝试直接匹配
        if (this.weatherIcons[text]) {
          console.log('直接匹配图标:', this.weatherIcons[text]);
          return this.weatherIcons[text];
        }
        // 部分匹配
        if (text.includes('雨')) {
          console.log('部分匹配雨，返回rainy');
          return 'rainy';
        }
        if (text.includes('雪')) {
          return 'snowy';
        }
        if (text.includes('云')) {
          return 'cloudy';
        }
        // 默认返回晴天
        return 'sunny';
      },
      
      // 获取天气对应的背景类
      getWeatherClass(text) {
        if (text.includes('雨') || text.includes('雷')) {
          return 'rainy';
        }
        if (text.includes('雪')) {
          return 'snowy';
        }
        if (text === '晴') {
          return 'sunny';
        }
        if (text.includes('云') || text === '阴天') {
          return 'cloudy';
        }
        if (text.includes('雾') || text.includes('霾')) {
          return 'foggy';
        }
        return 'default';
      },
      
      // 格式化时间
      formatTime(timeStr) {
        const date = new Date(timeStr);
        return date.toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      },
      
      // 格式化日期
      formatDate(dateStr) {
        // 检查是否是YYYYMMDD格式
        if (/^\d{8}$/.test(dateStr)) {
          // 将YYYYMMDD转换为YYYY-MM-DD
          const year = dateStr.substring(0, 4);
          const month = dateStr.substring(4, 6);
          const day = dateStr.substring(6, 8);
          dateStr = `${year}-${month}-${day}`;
        }
        const date = new Date(dateStr);
        return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', weekday: 'short' });
      },

    async onCityInput() {
      if (!this.city) {
        this.suggestions = [];
        return;
      }
      try {
        const url = `http://localhost:3001/api/city?name=${encodeURIComponent(this.city)}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.location) {
          this.suggestions = data.location;
        } else {
          this.suggestions = [];
        }
      } catch {
        this.suggestions = [];
      }
    },
    selectSuggestion(item) {
      this.city = item.name;
      this.suggestions = [];
      this.fetchWeather();
    },
    async fetchWeather() {
      if (!this.city) {
        this.error = '请输入城市名';
        return;
      }
      this.loading = true;
      this.error = '';
      this.weather = null;
      this.forecast = [];
      this.history = [];
      try {
        // 获取当前天气
        const weatherUrl = `http://localhost:3001/api/weather?city=${encodeURIComponent(this.city)}`;
        const weatherRes = await fetch(weatherUrl);
        const weatherData = await weatherRes.json();
        if (weatherData.error) throw new Error(weatherData.error);

        this.weather = {
          city: this.city,
          ...weatherData
        };

        // 获取天气预报
        try {
          const forecastUrl = `http://localhost:3001/api/weather/forecast?city=${encodeURIComponent(this.city)}`;
          const forecastRes = await fetch(forecastUrl);
          const forecastData = await forecastRes.json();
          if (!forecastData.error) {
            this.forecast = forecastData;
          }
        } catch (err) {
          console.warn('获取天气预报失败:', err.message);
        }

        // 获取历史天气
        try {
          const historyUrl = `http://localhost:3001/api/weather/history?city=${encodeURIComponent(this.city)}`;
          console.log('请求历史天气:', historyUrl);
          const historyRes = await fetch(historyUrl);
          const historyData = await historyRes.json();
          console.log('历史天气数据:', historyData);
          if (!historyData.error) {
            this.history = Array.isArray(historyData) ? historyData : [];
            console.log('设置历史天气数据:', this.history);
          } else {
            console.warn('历史天气API返回错误:', historyData.error);
            this.error = `获取历史天气失败: ${historyData.error}`;
          }
        } catch (err) {
          console.error('获取历史天气失败:', err);
          this.error = `获取历史天气失败: ${err.message || '未知错误'}`;
        }
      } catch (e) {
        this.error = `查询失败: ${e.message}`;
        console.error('天气查询错误:', e);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped></style>
