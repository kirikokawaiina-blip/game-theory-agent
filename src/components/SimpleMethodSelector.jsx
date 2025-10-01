import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Plus, Minus } from 'lucide-react'

// 基本的な分析手法の定義
const ANALYSIS_METHODS = {
  'game-theory': {
    name: 'ゲーム理論',
    methods: [
      { id: 'nash-equilibrium', name: 'ナッシュ均衡', description: '戦略的均衡点の分析' },
      { id: 'dominant-strategy', name: '支配戦略', description: '最適戦略の特定' },
      { id: 'pareto-optimal', name: 'パレート最適', description: '効率的な結果の分析' },
      { id: 'mixed-strategy', name: '混合戦略', description: '確率的戦略の分析' }
    ]
  },
  'optimization': {
    name: '最適化問題',
    methods: [
      { id: 'linear-programming', name: '線形計画法', description: '線形制約下での最適化' },
      { id: 'integer-programming', name: '整数計画法', description: '整数制約を含む最適化' },
      { id: 'dynamic-programming', name: '動的計画法', description: '段階的最適化問題' },
      { id: 'nonlinear-programming', name: '非線形計画法', description: '非線形制約下での最適化' }
    ]
  },
  'probability': {
    name: '確率・統計',
    methods: [
      { id: 'markov-chain', name: 'マルコフ連鎖', description: '確率過程の分析' },
      { id: 'queuing-theory', name: '待ち行列理論', description: 'サービスシステムの分析' },
      { id: 'monte-carlo', name: 'モンテカルロ法', description: '確率的シミュレーション' },
      { id: 'bayesian-analysis', name: 'ベイズ分析', description: '事前情報を活用した分析' }
    ]
  },
  'network': {
    name: 'ネットワーク分析',
    methods: [
      { id: 'shortest-path', name: '最短経路問題', description: '最適経路の探索' },
      { id: 'max-flow', name: '最大流問題', description: 'ネットワーク流量の最大化' },
      { id: 'minimum-spanning-tree', name: '最小全域木', description: '最小コストでの全点接続' },
      { id: 'network-optimization', name: 'ネットワーク最適化', description: 'ネットワーク構造の最適化' }
    ]
  }
}

export function SimpleMethodSelector({ selectedMethods = [], onMethodsChange, autoMode = false, problemText = '' }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isAutoMode, setIsAutoMode] = useState(autoMode)

  // すべての手法を取得
  const getAllMethods = () => {
    const allMethods = []
    Object.entries(ANALYSIS_METHODS).forEach(([categoryId, category]) => {
      category.methods.forEach(method => {
        allMethods.push({
          ...method,
          category: categoryId,
          categoryName: category.name
        })
      })
    })
    return allMethods
  }

  // フィルタリングされた手法を取得
  const getFilteredMethods = () => {
    let methods = getAllMethods()

    // カテゴリーフィルター
    if (selectedCategory !== 'all') {
      methods = methods.filter(method => method.category === selectedCategory)
    }

    // 検索フィルター
    if (searchTerm) {
      methods = methods.filter(method => 
        method.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        method.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return methods
  }

  // 手法の選択/解除
  const toggleMethod = (methodId) => {
    const newMethods = selectedMethods.includes(methodId)
      ? selectedMethods.filter(id => id !== methodId)
      : [...selectedMethods, methodId]
    
    onMethodsChange(newMethods)
  }

  // 全選択/全解除
  const toggleAllMethods = () => {
    const filteredMethodIds = getFilteredMethods().map(m => m.id)
    const allSelected = filteredMethodIds.every(id => selectedMethods.includes(id))
    
    if (allSelected) {
      // 全解除
      const newMethods = selectedMethods.filter(id => !filteredMethodIds.includes(id))
      onMethodsChange(newMethods)
    } else {
      // 全選択
      const newMethods = [...new Set([...selectedMethods, ...filteredMethodIds])]
      onMethodsChange(newMethods)
    }
  }

  // AI推奨手法の取得（簡易版）
  const getRecommendedMethods = (problemText) => {
    if (!problemText) return []
    
    const text = problemText.toLowerCase()
    const recommendations = new Set()
    
    if (text.includes('競争') || text.includes('戦略') || text.includes('プレイヤー')) {
      recommendations.add('nash-equilibrium')
      recommendations.add('dominant-strategy')
    }
    if (text.includes('最適') || text.includes('最大') || text.includes('最小')) {
      recommendations.add('linear-programming')
      recommendations.add('dynamic-programming')
    }
    if (text.includes('確率') || text.includes('ランダム') || text.includes('不確実')) {
      recommendations.add('monte-carlo')
      recommendations.add('bayesian-analysis')
    }
    if (text.includes('ネットワーク') || text.includes('経路') || text.includes('流れ')) {
      recommendations.add('shortest-path')
      recommendations.add('max-flow')
    }
    
    return Array.from(recommendations)
  }

  useEffect(() => {
    if (isAutoMode && problemText) {
      const recommended = getRecommendedMethods(problemText)
      onMethodsChange(recommended)
    }
    // 自動モードでも問題文がない場合は既存の選択を保持
  }, [isAutoMode, problemText])

  const filteredMethods = getFilteredMethods()
  const categories = Object.entries(ANALYSIS_METHODS)

  return (
    <div className="space-y-4">
      {/* 自動選択モード */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="auto-mode"
            checked={isAutoMode}
            onCheckedChange={(checked) => {
              setIsAutoMode(checked)
              if (checked && problemText) {
                const recommended = getRecommendedMethods(problemText)
                onMethodsChange(recommended)
              }
              // 自動モード解除時は既存の選択を保持
            }}
          />
          <Label htmlFor="auto-mode" className="text-sm">
            自動選択モード
          </Label>
        </div>
        <div className="text-sm text-muted-foreground">
          選択中: {selectedMethods.length}個の手法
        </div>
      </div>

      {/* 検索とフィルター */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="手法名、説明、キーワードで検索"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            disabled={isAutoMode}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={isAutoMode}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="カテゴリー" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            {categories.map(([id, category]) => (
              <SelectItem key={id} value={id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 全選択/全解除ボタン */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleAllMethods}
          className="flex items-center gap-1"
          disabled={isAutoMode}
        >
          {filteredMethods.every(m => selectedMethods.includes(m.id)) ? (
            <>
              <Minus className="h-3 w-3" />
              全解除
            </>
          ) : (
            <>
              <Plus className="h-3 w-3" />
              全選択
            </>
          )}
        </Button>
        <div className="text-xs text-muted-foreground flex items-center">
          {filteredMethods.length}個の手法が表示中
        </div>
      </div>

      {/* 手法一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
        {filteredMethods.map((method) => (
          <div
            key={method.id}
            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
              selectedMethods.includes(method.id)
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
            }`}
            onClick={() => !isAutoMode && toggleMethod(method.id)} // 自動モード時はクリック無効
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedMethods.includes(method.id)}
                    onCheckedChange={() => !isAutoMode && toggleMethod(method.id)} // チェックボックスも自動モード時は無効
                    className="pointer-events-auto"
                    disabled={isAutoMode}
                  />
                  <h4 className="font-medium text-sm">{method.name}</h4>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {method.description}
                </p>
                <Badge variant="outline" className="text-xs mt-1">
                  {method.categoryName}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMethods.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>該当する分析手法が見つかりません</p>
          <p className="text-xs mt-1">検索条件を変更してください</p>
        </div>
      )}

      {/* 選択された手法の表示 */}
      {selectedMethods.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">選択された手法:</Label>
          <div className="flex flex-wrap gap-1">
            {selectedMethods.map((methodId) => {
              const method = getAllMethods().find(m => m.id === methodId)
              return method ? (
                <Badge
                  key={methodId}
                  variant="secondary"
                  className="text-xs cursor-pointer"
                  onClick={() => !isAutoMode && toggleMethod(methodId)}
                >
                  {method.name}
                  {!isAutoMode && <span className="ml-1">×</span>}
                </Badge>
              ) : null
            })}
          </div>
        </div>
      )}
    </div>
  )
}


