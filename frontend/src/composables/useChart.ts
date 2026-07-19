import { ref, onUnmounted, type Ref } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption, ECharts } from 'echarts'

/** 图表实例管理组合式函数 */
export function useChart(
  chartRef: Ref<HTMLElement | null>,
  theme: 'dark' | 'light' = 'dark'
) {
  const chartInstance = ref<ECharts | null>(null)
  const isLoading = ref(false)

  /** 初始化图表 */
  const initChart = () => {
    if (!chartRef.value) return
    if (chartInstance.value) return
    chartInstance.value = echarts.init(chartRef.value, theme)
  }

  /** 设置图表配置 */
  const setOption = (option: EChartsOption, notMerge = true) => {
    if (!chartInstance.value) {
      initChart()
    }
    chartInstance.value?.setOption(option, { notMerge })
  }

  /** 图表自适应 */
  const resize = () => {
    chartInstance.value?.resize()
  }

  /** 显示/隐藏加载状态 */
  const showLoading = () => {
    isLoading.value = true
    chartInstance.value?.showLoading('default', {
      text: '加载中...',
      color: '#00d4ff',
      maskColor: 'rgba(10, 22, 40, 0.7)'
    })
  }

  const hideLoading = () => {
    isLoading.value = false
    chartInstance.value?.hideLoading()
  }

  /** 销毁图表实例 */
  const dispose = () => {
    chartInstance.value?.dispose()
    chartInstance.value = null
  }

  /** 组件卸载时自动销毁 */
  onUnmounted(() => {
    dispose()
  })

  return {
    chartInstance,
    isLoading,
    initChart,
    setOption,
    resize,
    showLoading,
    hideLoading,
    dispose
  }
}
