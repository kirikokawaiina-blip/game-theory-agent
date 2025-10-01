/**
 * Modern Layout Component
 * 参考サイトを基にした新しいモダンレイアウト
 */

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Settings, 
  Brain, 
  Calculator, 
  BarChart3, 
  FileText, 
  Lightbulb,
  Play,
  Pause,
  RotateCcw,
  Download,
  Share,
  Maximize2,
  Eye,
  EyeOff,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react'
import { EnhancedTestSuite } from './EnhancedTestSuite'
import { MethodSelector } from './MethodSelector'
import { CustomMethodDialog } from './CustomMethodDialog'
import AnalysisProgress from './AnalysisProgress'
import FormulaTab from './FormulaTab'
import VisualizationTab from './VisualizationTab'
import ThinkingProcessTab from './ThinkingProcessTab'

export function ModernLayout() {
  // 状態管理
  const [apiKey, setApiKey] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedMethods, setSelectedMethods] = useState([])
  const [problemText, setProblemText] = useState('')
  const [autoMode, setAutoMode] = useState(true)
  const [optimizationMode, setOptimizationMode] = useState(false)
  const [debugMode, setDebugMode] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState(null)
  const [activeTab, setActiveTab] = useState('setup')
  const [apiKeyVisible, setApiKeyVisible] = useState(false)

  // LocalStorageから設定を読み込み
  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini_api_key')
    const savedModel = localStorage.getItem('selected_model')
    const savedOptimization = localStorage.getItem('optimization_mode')
    const savedDebug = localStorage.getItem('debug_mode')

    if (savedApiKey) setApiKey(savedApiKey)
    if (savedModel) setSelectedModel(savedModel)
    if (savedOptimization) setOptimizationMode(JSON.parse(savedOptimization))
    if (savedDebug) setDebugMode(JSON.parse(savedDebug))
  }, [])

  // 設定の保存
  useEffect(() => {
    if (apiKey) localStorage.setItem('gemini_api_key', apiKey)
  }, [apiKey])

  useEffect(() => {
    if (selectedModel) localStorage.setItem('selected_model', selectedModel)
  }, [selectedModel])

  useEffect(() => {
    localStorage.setItem('optimization_mode', JSON.stringify(optimizationMode))
  }, [optimizationMode])

  useEffect(() => {
    localStorage.setItem('debug_mode', JSON.stringify(debugMode))
  }, [debugMode])

  // 分析開始
  const startAnalysis = async () => {
    if (!apiKey || !problemText.trim()) {
      alert('APIキーと問題文を入力してください')
      return
    }

    setIsAnalyzing(true)
    setActiveTab('progress')

    try {
      // 分析処理をここに実装
      // EnhancedGeminiClientを使用した分析
      console.log('分析開始:', { selectedMethods, problemText, selectedModel })
      
      // 模擬的な分析結果
      setTimeout(() => {
        setAnalysisResults({
          problemType: 'ゲーム理論',
          selectedMethods: selectedMethods.length > 0 ? selectedMethods : ['nash_equilibrium'],
          results: {
            summary: '分析が完了しました',
            keyFindings: ['ナッシュ均衡が見つかりました'],
            recommendations: ['協力戦略を推奨します']
          }
        })
        setIsAnalyzing(false)
        setActiveTab('results')
      }, 3000)
    } catch (error) {
      console.error('分析エラー:', error)
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">OR分析Agent</h1>
                <p className="text-sm text-slate-600">包括的なオペレーションズリサーチ分析システム</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="hidden sm:flex">
                {selectedMethods.length} 手法選択中
              </Badge>
              <Button
                onClick={startAnalysis}
                disabled={isAnalyzing || !apiKey || !problemText.trim()}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                {isAnalyzing ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    分析中...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    分析開始
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* タブナビゲーション */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-2 border border-slate-200">
            <TabsList className="grid w-full grid-cols-6 bg-transparent">
              <TabsTrigger 
                value="setup" 
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">設定</span>
              </TabsTrigger>
              <TabsTrigger 
                value="methods" 
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">手法選択</span>
              </TabsTrigger>
              <TabsTrigger 
                value="progress" 
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">進捗</span>
              </TabsTrigger>
              <TabsTrigger 
                value="results" 
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">結果</span>
              </TabsTrigger>
              <TabsTrigger 
                value="formulas" 
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Calculator className="h-4 w-4" />
                <span className="hidden sm:inline">計算式</span>
              </TabsTrigger>
              <TabsTrigger 
                value="thinking" 
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Lightbulb className="h-4 w-4" />
                <span className="hidden sm:inline">思考過程</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* 設定タブ */}
          <TabsContent value="setup" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* API設定 */}
              <Card className="lg:col-span-2 bg-white/60 backdrop-blur-sm border-slate-200">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-slate-900">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Settings className="h-4 w-4 text-green-600" />
                    </div>
                    Gemini API設定
                  </CardTitle>
                  <CardDescription>
                    APIキーとモデルを設定してください
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="api-key" className="text-sm font-medium text-slate-700">
                        Gemini APIキー
                      </Label>
                      <div className="relative">
                        <Input
                          id="api-key"
                          type={apiKeyVisible ? "text" : "password"}
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder="AIzaSy..."
                          className="pr-10 bg-white/80"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setApiKeyVisible(!apiKeyVisible)}
                        >
                          {apiKeyVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="model-select" className="text-sm font-medium text-slate-700">
                        AIモデル
                      </Label>
                      <select
                        id="model-select"
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="w-full px-3 py-2 bg-white/80 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">モデルを選択</option>
                        <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash (推奨)</option>
                        <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                        <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <div>
                        <Label className="text-sm font-medium text-amber-800">最適化モード</Label>
                        <p className="text-xs text-amber-600">トークン消費を抑制</p>
                      </div>
                      <Button
                        variant={optimizationMode ? "default" : "outline"}
                        size="sm"
                        onClick={() => setOptimizationMode(!optimizationMode)}
                        className={optimizationMode ? "bg-amber-500 hover:bg-amber-600" : ""}
                      >
                        <Zap className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div>
                        <Label className="text-sm font-medium text-purple-800">デバッグモード</Label>
                        <p className="text-xs text-purple-600">詳細ログを表示</p>
                      </div>
                      <Button
                        variant={debugMode ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDebugMode(!debugMode)}
                        className={debugMode ? "bg-purple-500 hover:bg-purple-600" : ""}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 問題入力 */}
              <Card className="bg-white/60 backdrop-blur-sm border-slate-200">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-slate-900">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    問題入力
                  </CardTitle>
                  <CardDescription>
                    分析したいOR問題を詳細に記述してください
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={problemText}
                    onChange={(e) => setProblemText(e.target.value)}
                    placeholder="例：ある工場では、製品Aと製品Bを生産している。製品Aの利益は2単位、製品Bの利益は3単位である。資源制約として..."
                    rows={8}
                    className="bg-white/80 resize-none"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-slate-500">
                      {problemText.length} 文字
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setProblemText('')}
                      disabled={!problemText}
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      クリア
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* テストスイート */}
            <EnhancedTestSuite
              apiKey={apiKey}
              onApiKeyChange={setApiKey}
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              optimizationMode={optimizationMode}
              onOptimizationModeChange={setOptimizationMode}
              debugMode={debugMode}
              onDebugModeChange={setDebugMode}
            />
          </TabsContent>

          {/* 手法選択タブ */}
          <TabsContent value="methods" className="space-y-6">
            <MethodSelector
              selectedMethods={selectedMethods}
              onMethodsChange={setSelectedMethods}
              problemText={problemText}
              autoMode={autoMode}
              onAutoModeChange={setAutoMode}
            />
          </TabsContent>

          {/* 進捗タブ */}
          <TabsContent value="progress" className="space-y-6">
            <AnalysisProgress
              isAnalyzing={isAnalyzing}
              selectedMethods={selectedMethods}
              problemText={problemText}
            />
          </TabsContent>

          {/* 結果タブ */}
          <TabsContent value="results" className="space-y-6">
            {analysisResults ? (
              <VisualizationTab analysisResults={analysisResults} />
            ) : (
              <Card className="bg-white/60 backdrop-blur-sm border-slate-200">
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">分析結果はまだありません</h3>
                    <p className="text-slate-600">問題を入力して分析を開始してください</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* 計算式タブ */}
          <TabsContent value="formulas" className="space-y-6">
            <FormulaTab analysisResults={analysisResults} />
          </TabsContent>

          {/* 思考過程タブ */}
          <TabsContent value="thinking" className="space-y-6">
            <ThinkingProcessTab analysisResults={analysisResults} />
          </TabsContent>
        </Tabs>
      </main>

      {/* フッター */}
      <footer className="bg-white/60 backdrop-blur-sm border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              © 2024 OR分析Agent - Powered by Gemini AI
            </p>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Share className="h-4 w-4 mr-2" />
                共有
              </Button>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4 mr-2" />
                エクスポート
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ModernLayout

