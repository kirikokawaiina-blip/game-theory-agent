/**
 * Analysis Chart Component
 * 分析結果をグラフ・チャートで表示するコンポーネント
 */

import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ScatterChart,
  Scatter
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

// カラーパレット
const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300', 
  '#00ff00', '#ff00ff', '#00ffff', '#ff0000'
]

export function AnalysisChart({ 
  data, 
  type = 'line', 
  title = "分析結果", 
  xKey = 'x', 
  yKey = 'y',
  className = "",
  height = 300
}) {
  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            チャートデータがありません
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleExport = () => {
    // SVGエクスポート機能（簡易版）
    const svgElement = document.querySelector(`#chart-${title.replace(/\s+/g, '-')} svg`)
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement)
      const blob = new Blob([svgData], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `${title.replace(/\s+/g, '_')}_chart.svg`
      link.click()
      
      URL.revokeObjectURL(url)
    }
  }

  const renderChart = () => {
    const commonProps = {
      width: '100%',
      height: height,
      data: data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    }

    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={yKey} 
                stroke={COLORS[0]} 
                strokeWidth={2}
                dot={{ fill: COLORS[0], strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )

      case 'area':
        return (
          <ResponsiveContainer {...commonProps}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey={yKey} 
                stroke={COLORS[0]} 
                fill={COLORS[0]}
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        )

      case 'bar':
        return (
          <ResponsiveContainer {...commonProps}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={yKey} fill={COLORS[0]} />
            </BarChart>
          </ResponsiveContainer>
        )

      case 'pie':
        return (
          <ResponsiveContainer {...commonProps}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey={yKey}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )

      case 'scatter':
        return (
          <ResponsiveContainer {...commonProps}>
            <ScatterChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xKey} />
              <YAxis dataKey={yKey} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter name="データポイント" data={data} fill={COLORS[0]} />
            </ScatterChart>
          </ResponsiveContainer>
        )

      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            サポートされていないチャートタイプです: {type}
          </div>
        )
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            SVG出力
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div id={`chart-${title.replace(/\s+/g, '-')}`}>
          {renderChart()}
        </div>
      </CardContent>
    </Card>
  )
}

// 特化したチャートコンポーネント

export function PayoffChart({ nashEquilibria, paretoOptimal, className = "" }) {
  if (!nashEquilibria && !paretoOptimal) return null

  const data = []
  
  // ナッシュ均衡データ
  if (nashEquilibria) {
    nashEquilibria.forEach((eq, index) => {
      if (eq.payoffs && eq.coordinates) {
        const payoffs = Object.values(eq.payoffs)
        data.push({
          name: `Nash ${index + 1}`,
          player1: payoffs[0] || 0,
          player2: payoffs[1] || 0,
          type: 'nash'
        })
      }
    })
  }

  // パレート最適解データ
  if (paretoOptimal) {
    paretoOptimal.forEach((po, index) => {
      if (po.payoffs && po.coordinates) {
        const payoffs = Object.values(po.payoffs)
        data.push({
          name: `Pareto ${index + 1}`,
          player1: payoffs[0] || 0,
          player2: payoffs[1] || 0,
          type: 'pareto'
        })
      }
    })
  }

  return (
    <AnalysisChart
      data={data}
      type="scatter"
      title="利得分布図"
      xKey="player1"
      yKey="player2"
      className={className}
    />
  )
}

export function QueueingChart({ performanceMetrics, className = "" }) {
  if (!performanceMetrics) return null

  const data = [
    { name: 'システム利用率', value: (performanceMetrics.utilization * 100).toFixed(1) },
    { name: '平均顧客数', value: performanceMetrics.avgCustomersInSystem?.toFixed(2) || 0 },
    { name: '平均待ち時間', value: performanceMetrics.avgWaitingTime?.toFixed(2) || 0 },
    { name: '平均滞在時間', value: performanceMetrics.avgTimeInSystem?.toFixed(2) || 0 }
  ]

  return (
    <AnalysisChart
      data={data}
      type="bar"
      title="待ち行列性能指標"
      xKey="name"
      yKey="value"
      className={className}
    />
  )
}

export function InventoryChart({ eoqAnalysis, className = "" }) {
  if (!eoqAnalysis) return null

  const data = [
    { name: '発注費用', value: eoqAnalysis.annualOrderingCost?.toFixed(0) || 0 },
    { name: '保管費用', value: eoqAnalysis.annualHoldingCost?.toFixed(0) || 0 }
  ]

  return (
    <AnalysisChart
      data={data}
      type="pie"
      title="年間費用内訳"
      xKey="name"
      yKey="value"
      className={className}
    />
  )
}

export default AnalysisChart

