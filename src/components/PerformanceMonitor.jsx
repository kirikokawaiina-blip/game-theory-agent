/**
 * Performance Monitor Component
 * アプリケーションのパフォーマンスを監視するコンポーネント
 */

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Activity, Cpu, HardDrive, Wifi } from 'lucide-react'

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    memory: { used: 0, total: 0 },
    timing: { domContentLoaded: 0, loadComplete: 0 },
    network: { effectiveType: 'unknown', downlink: 0 },
    fps: 0,
    bundleSize: 0
  })

  useEffect(() => {
    // メモリ使用量の取得
    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        const memory = performance.memory
        setMetrics(prev => ({
          ...prev,
          memory: {
            used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
            total: Math.round(memory.totalJSHeapSize / 1024 / 1024)
          }
        }))
      }
    }

    // ページロード時間の取得
    const updateTimingInfo = () => {
      const navigation = performance.getEntriesByType('navigation')[0]
      if (navigation) {
        setMetrics(prev => ({
          ...prev,
          timing: {
            domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
            loadComplete: Math.round(navigation.loadEventEnd - navigation.loadEventStart)
          }
        }))
      }
    }

    // ネットワーク情報の取得
    const updateNetworkInfo = () => {
      if ('connection' in navigator) {
        const connection = navigator.connection
        setMetrics(prev => ({
          ...prev,
          network: {
            effectiveType: connection.effectiveType || 'unknown',
            downlink: connection.downlink || 0
          }
        }))
      }
    }

    // FPS計測
    let frameCount = 0
    let lastTime = performance.now()
    
    const measureFPS = () => {
      frameCount++
      const currentTime = performance.now()
      
      if (currentTime - lastTime >= 1000) {
        setMetrics(prev => ({
          ...prev,
          fps: Math.round(frameCount * 1000 / (currentTime - lastTime))
        }))
        frameCount = 0
        lastTime = currentTime
      }
      
      requestAnimationFrame(measureFPS)
    }

    // バンドルサイズの推定
    const estimateBundleSize = () => {
      const scripts = document.querySelectorAll('script[src]')
      let totalSize = 0
      
      scripts.forEach(script => {
        // 実際のサイズは取得できないため、推定値を使用
        totalSize += 500 // KB単位での推定
      })
      
      setMetrics(prev => ({
        ...prev,
        bundleSize: totalSize
      }))
    }

    // 初期化
    updateMemoryInfo()
    updateTimingInfo()
    updateNetworkInfo()
    estimateBundleSize()
    measureFPS()

    // 定期更新
    const interval = setInterval(() => {
      updateMemoryInfo()
      updateNetworkInfo()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getMemoryUsageColor = () => {
    const usage = (metrics.memory.used / metrics.memory.total) * 100
    if (usage > 80) return 'text-red-600'
    if (usage > 60) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getFPSColor = () => {
    if (metrics.fps >= 50) return 'text-green-600'
    if (metrics.fps >= 30) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getNetworkTypeColor = () => {
    switch (metrics.network.effectiveType) {
      case '4g': return 'text-green-600'
      case '3g': return 'text-yellow-600'
      case '2g': return 'text-red-600'
      default: return 'text-muted-foreground'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          パフォーマンス監視
        </CardTitle>
        <CardDescription>
          アプリケーションのリアルタイムパフォーマンス指標
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* メモリ使用量 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                <span className="text-sm font-medium">メモリ使用量</span>
              </div>
              <Badge variant="outline" className={getMemoryUsageColor()}>
                {metrics.memory.used}MB / {metrics.memory.total}MB
              </Badge>
            </div>
            <Progress 
              value={(metrics.memory.used / metrics.memory.total) * 100} 
              className="h-2"
            />
          </div>

          {/* FPS */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span className="text-sm font-medium">フレームレート</span>
              </div>
              <Badge variant="outline" className={getFPSColor()}>
                {metrics.fps} FPS
              </Badge>
            </div>
            <Progress 
              value={Math.min(metrics.fps / 60 * 100, 100)} 
              className="h-2"
            />
          </div>

          {/* ネットワーク */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4" />
                <span className="text-sm font-medium">ネットワーク</span>
              </div>
              <Badge variant="outline" className={getNetworkTypeColor()}>
                {metrics.network.effectiveType.toUpperCase()} 
                {metrics.network.downlink > 0 && ` (${metrics.network.downlink}Mbps)`}
              </Badge>
            </div>
          </div>

          {/* バンドルサイズ */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4" />
                <span className="text-sm font-medium">バンドルサイズ</span>
              </div>
              <Badge variant="outline">
                ~{metrics.bundleSize}KB
              </Badge>
            </div>
          </div>
        </div>

        {/* ページロード時間 */}
        <div className="pt-4 border-t">
          <h4 className="text-sm font-semibold mb-2">ページロード時間</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span>DOM読み込み:</span>
              <span className="font-mono">{metrics.timing.domContentLoaded}ms</span>
            </div>
            <div className="flex justify-between">
              <span>完全読み込み:</span>
              <span className="font-mono">{metrics.timing.loadComplete}ms</span>
            </div>
          </div>
        </div>

        {/* パフォーマンス推奨事項 */}
        <div className="pt-4 border-t">
          <h4 className="text-sm font-semibold mb-2">推奨事項</h4>
          <div className="space-y-1 text-sm text-muted-foreground">
            {(metrics.memory.used / metrics.memory.total) > 0.8 && (
              <p>• メモリ使用量が高いです。ページの再読み込みを検討してください。</p>
            )}
            {metrics.fps < 30 && (
              <p>• フレームレートが低下しています。重い処理を確認してください。</p>
            )}
            {metrics.network.effectiveType === '2g' && (
              <p>• ネットワーク速度が遅いです。軽量版の使用を検討してください。</p>
            )}
            {metrics.bundleSize > 1000 && (
              <p>• バンドルサイズが大きいです。コード分割を検討してください。</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PerformanceMonitor

