<script setup>
import WeatherSearch from './components/WeatherSearch.vue';
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <div class="header-content">
        <h1 class="app-title">天气查询工具</h1>
        <p class="app-subtitle">实时获取全球天气信息</p>
      </div>
    </header>
    
    <main class="app-main">
      <WeatherSearch />
    </main>
    
    <footer class="app-footer">
      <p>© {{ new Date().getFullYear() }} Luckychao天气查询工具 | 数据来源: 和风天气</p>
    </footer>
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
  background: #f5f6fa;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  padding: 2rem 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
}

.app-title {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.app-subtitle {
  margin: 0.5rem 0 0;
  font-size: 1.1rem;
  opacity: 0.9;
}

.app-main {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
  width: 100%;
  box-sizing: border-box;
}

.app-footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 1.5rem;
  font-size: 0.9rem;
}
</style>
