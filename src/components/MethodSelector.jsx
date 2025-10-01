/**
 * Method Selector Component
 * 分析手法選択コンポーネント - カテゴリー別表示、複数選択、カスタム手法対応
 */

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Search, 
  Filter, 
  CheckSquare, 
  Square, 
  Zap, 
  Brain, 
  Settings,
  Info,
  Plus,
  X
} from 'lucide-react'
import analysisMethods from '../lib/analysis-methods.js'
import { CustomMethodDialog } from './CustomMethodDialog'
import { HelpTooltip } from './HelpTooltip'

export function MethodSelector({ 
  selectedMethods = [], 
  onSelectedMethodsChange, 
  problemText = '',
  autoMode = false,
  onAutoModeChange 
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedComplexity, setSelectedComplexity] = useState('all')
  const [customMethods, setCustomMethods] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [isAutoMode, setIsAutoMode] = useState(autoMode)

  // 分析手法の取得
  const getAllMethods = () => {
    const allMethods = []
    Object.values(analysisMethods.categories).forEach(category => {
      allMethods.push(...category.methods)
    })
    return [...allMethods, ...customMethods]
  }

  // フィルタリングされた手法の取得
  const getFilteredMethods = () => {
    let methods = getAllMethods()

    // カテゴリーフィルター
    if (selectedCategory !== 'all') {
      const categoryMethods = analysisMethods.categories[selectedCategory]?.methods || []
      methods = methods.filter(method => 
        categoryMethods.some(catMethod => catMethod.id === method.id) ||
        customMethods.some(custom => custom.id === method.id)
      )
    }

    // 複雑度フィルター
    if (selectedComplexity !== 'all') {
      methods = methods.filter(method => method.complexity === selectedComplexity)
    }

    // 検索フィルター
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      methods = methods.filter(method =>
        method.name.toLowerCase().includes(term) ||
        method.description.toLowerCase().includes(term) ||
        method.keywords.some(keyword => keyword.toLowerCase().includes(term))
      )
    }

    return methods
  }

  // 手法の選択/選択解除
  const toggleMethod = (methodId) => {
    const newSelected = selectedMethods.includes(methodId)
      ? selectedMethods.filter(id => id !== methodId)
      : [...selectedMethods, methodId]
    
    onSelectedMethodsChange(newSelected)
  }

  // 全選択/全解除
  const toggleAllMethods = () => {
    const filteredMethods = getFilteredMethods()
    const allSelected = filteredMethods.every(method => selectedMethods.includes(method.id))
    
    if (allSelected) {
      // 全解除
      const filteredIds = filteredMethods.map(method => method.id)
      const newSelected = selectedMethods.filter(id => !filteredIds.includes(id))
      onSelectedMethodsChange(newSelected)
    } else {
      // 全選択
      const filteredIds = filteredMethods.map(method => method.id)
      const newSelected = [...new Set([...selectedMethods, ...filteredIds])]
      onSelectedMethodsChange(newSelected)
    }
  }

  // 自動選択モードの切り替え
  const handleAutoModeToggle = (enabled) => {
    setIsAutoMode(enabled)
    if (onAutoModeChange) {
      onAutoModeChange(enabled)
    }
    
    if (enabled && problemText) {
      // 問題文から推奨手法を取得
      const recommended = getRecommendedMethods(problemText)
      onSelectedMethodsChange(recommended.map(method => method.id))
    }
  }

  // 問題文が変更された時の推奨手法更新
  useEffect(() => {
    if (problemText && isAutoMode) {
      const recommended = getRecommendedMethods(problemText)
      setSuggestions(recommended)
      onSelectedMethodsChange(recommended.map(method => method.id))
    }
  }, [problemText, isAutoMode, onSelectedMethodsChange])

  // 推奨手法の取得
  const getRecommendedMethods = (text) => {
    const keywords = text.toLowerCase()
    const allMethods = getAllMethods()
    
    return allMethods.filter(method => 
      method.keywords.some(keyword => keywords.includes(keyword.toLowerCase()))
    ).slice(0, 5) // 上位5つまで
  }

  // カスタム手法の追加
  const addCustomMethod = (method) => {
    const newMethod = {
      ...method,
      id: `custom_${Date.now()}`,
      category: 'custom',
      complexity: method.complexity || 'medium'
    }
    setCustomMethods(prev => [...prev, newMethod])
  }

  // カスタム手法の削除
  const removeCustomMethod = (methodId) => {
    setCustomMethods(prev => prev.filter(method => method.id !== methodId))
    onSelectedMethodsChange(selectedMethods.filter(id => id !== methodId))
  }

  const filteredMethods = getFilteredMethods()
  const selectedCount = selectedMethods.length

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              分析手法選択
              <Badge variant="outline">{selectedCount}個選択中</Badge>
            </CardTitle>
            <CardDescription>
              問題に適した分析手法を選択してください
            </CardDescription>
          </div>
          <HelpTooltip content="Shift+クリックで複数選択、自動選択モードでAIが推奨手法を選択します" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 自動選択モード */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <Label htmlFor="auto-mode">自動選択モード</Label>
            <HelpTooltip content="問題文から最適な分析手法を自動で選択します" />
          </div>
          <Switch
            id="auto-mode"
            checked={isAutoMode}
            onCheckedChange={handleAutoModeToggle}
          />
        </div>

        {/* 推奨手法の表示 */}
        {isAutoMode && suggestions.length > 0 && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Brain className="h-4 w-4" />
              推奨手法
            </h4>
            <div className="flex flex-wrap gap-2">
              {suggestions.map(method => (
                <Badge key={method.id} variant="secondary">
                  {method.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* 検索とフィルター */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="手法名、説明、キーワードで検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAllMethods}
              className="whitespace-nowrap"
            >
              {filteredMethods.every(method => selectedMethods.includes(method.id)) ? (
                <>
                  <Square className="h-4 w-4 mr-1" />
                  全解除
                </>
              ) : (
                <>
                  <CheckSquare className="h-4 w-4 mr-1" />
                  全選択
                </>
              )}
            </Button>
          </div>

          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">すべてのカテゴリー</option>
              {Object.entries(analysisMethods.categories).map(([key, category]) => (
                <option key={key} value={key}>{category.name}</option>
              ))}
            </select>

            <select
              value={selectedComplexity}
              onChange={(e) => setSelectedComplexity(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">すべての複雑度</option>
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
            </select>
          </div>
        </div>

        {/* 手法一覧 */}
        <ScrollArea className="h-64 w-full border rounded-md p-4">
          <div className="space-y-2">
            {filteredMethods.map((method) => (
              <div
                key={method.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedMethods.includes(method.id) ? 'bg-primary/10 border-primary' : ''
                }`}
                onClick={() => toggleMethod(method.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {selectedMethods.includes(method.id) ? (
                        <CheckSquare className="h-4 w-4 text-primary" />
                      ) : (
                        <Square className="h-4 w-4 text-muted-foreground" />
                      )}
                      <h4 className="font-medium text-sm">{method.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {method.complexity === 'low' ? '低' : method.complexity === 'medium' ? '中' : '高'}
                      </Badge>
                      {method.category === 'custom' && (
                        <Badge variant="secondary" className="text-xs">カスタム</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {method.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {method.keywords.slice(0, 3).map((keyword, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {method.category === 'custom' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeCustomMethod(method.id)
                      }}
                      className="ml-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* カスタム手法追加 */}
        <div className="flex justify-between items-center pt-2 border-t">
          <span className="text-sm text-muted-foreground">
            {filteredMethods.length}個の手法が見つかりました
          </span>
          <CustomMethodDialog onAddMethod={addCustomMethod} />
        </div>
      </CardContent>
    </Card>
  )
}

