/**
 * Payoff Matrix Component
 * 利得行列の可視化コンポーネント
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

export function PayoffMatrix({ 
  matrix, 
  player1Strategies, 
  player2Strategies, 
  player1Name = "プレイヤー1", 
  player2Name = "プレイヤー2",
  nashEquilibria = [],
  paretoOptimal = [],
  className = ""
}) {
  if (!matrix || !player1Strategies || !player2Strategies) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>利得行列</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            利得行列データがありません
          </div>
        </CardContent>
      </Card>
    )
  }

  // ナッシュ均衡の座標を取得（安全なアクセス）
  const nashCoordinates = (nashEquilibria || [])
    .filter(eq => eq && eq.coordinates && Array.isArray(eq.coordinates))
    .map(eq => `${eq.coordinates[0]}-${eq.coordinates[1]}`)

  // パレート最適解の座標を取得（安全なアクセス）
  const paretoCoordinates = (paretoOptimal || [])
    .filter(po => po && po.coordinates && Array.isArray(po.coordinates))
    .map(po => `${po.coordinates[0]}-${po.coordinates[1]}`)

  // セルのスタイルを決定
  const getCellStyle = (i, j) => {
    const coord = `${i}-${j}`
    const isNash = nashCoordinates.includes(coord)
    const isPareto = paretoCoordinates.includes(coord)
    
    let className = "border border-gray-300 p-3 text-center relative"
    
    if (isNash && isPareto) {
      className += " bg-green-100 border-green-400"
    } else if (isNash) {
      className += " bg-blue-100 border-blue-400"
    } else if (isPareto) {
      className += " bg-yellow-100 border-yellow-400"
    } else {
      className += " bg-white"
    }
    
    return className
  }

  // 利得の表示形式を決定
  const formatPayoff = (cell) => {
    if (Array.isArray(cell)) {
      return `(${cell[0]}, ${cell[1]})`
    }
    return cell.toString()
  }

  // エクスポート機能
  const handleExport = () => {
    const csvContent = [
      ['', ...player2Strategies],
      ...player1Strategies.map((strategy, i) => [
        strategy,
        ...player2Strategies.map((_, j) => formatPayoff(matrix[i][j]))
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'payoff_matrix.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>利得行列</CardTitle>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            CSV出力
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 凡例 */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 border border-blue-400 rounded"></div>
              <span>ナッシュ均衡</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-100 border border-yellow-400 rounded"></div>
              <span>パレート最適</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-400 rounded"></div>
              <span>ナッシュ均衡 & パレート最適</span>
            </div>
          </div>

          {/* 利得行列テーブル */}
          <div className="overflow-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-3 bg-gray-50 font-semibold">
                    {player1Name} \ {player2Name}
                  </th>
                  {player2Strategies.map((strategy, j) => (
                    <th key={j} className="border border-gray-300 p-3 bg-gray-50 font-semibold min-w-[120px]">
                      {strategy}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {player1Strategies.map((strategy, i) => (
                  <tr key={i}>
                    <td className="border border-gray-300 p-3 bg-gray-50 font-semibold">
                      {strategy}
                    </td>
                    {player2Strategies.map((_, j) => (
                      <td key={j} className={getCellStyle(i, j)}>
                        <div className="font-mono text-sm">
                          {formatPayoff(matrix[i][j])}
                        </div>
                        {/* バッジ表示 */}
                        <div className="absolute top-1 right-1 flex gap-1">
                          {nashCoordinates.includes(`${i}-${j}`) && (
                            <Badge variant="secondary" className="text-xs px-1 py-0">N</Badge>
                          )}
                          {paretoCoordinates.includes(`${i}-${j}`) && (
                            <Badge variant="outline" className="text-xs px-1 py-0">P</Badge>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 分析結果サマリー */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">ナッシュ均衡</h4>
              {nashEquilibria && nashEquilibria.length > 0 ? (
                <ul className="text-sm space-y-1">
                  {nashEquilibria.map((eq, index) => (
                    <li key={index}>
                      {eq.strategies && Object.entries(eq.strategies).map(([player, strategy]) => 
                        `${player}: ${strategy}`
                      ).join(', ')}
                      {eq.payoffs && (
                        <span className="text-muted-foreground ml-2">
                          ({Object.values(eq.payoffs).join(', ')})
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">純戦略ナッシュ均衡なし</p>
              )}
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">パレート最適解</h4>
              {paretoOptimal.length > 0 ? (
                <ul className="text-sm space-y-1">
                  {paretoOptimal.map((po, index) => (
                    <li key={index}>
                      {po.strategies && Object.entries(po.strategies).map(([player, strategy]) => 
                        `${player}: ${strategy}`
                      ).join(', ')}
                      <span className="text-muted-foreground ml-2">
                        ({po.payoffs && Object.values(po.payoffs).join(', ')})
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">パレート最適解なし</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PayoffMatrix

