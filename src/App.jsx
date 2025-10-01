import { useState, useEffect, useCallback } from 'react'
import { useAnalysis, useModels } from './hooks/useAnalysis'
import { useLocalStorage } from './hooks/useLocalStorage'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Textarea } from './components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './components/ui/card'
import { ScrollArea } from './components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'
import { Label } from './components/ui/label'
import { Switch } from './components/ui/switch'
import { Alert, AlertDescription, AlertTitle } from './components/ui/alert'
import { Badge } from './components/ui/badge'
import {
  Terminal, Lightbulb, Settings, Play, CheckCircle, XCircle, Info, Loader2,
  Brain, BarChart3, FileText, Eye, EyeOff, Download
} from 'lucide-react'
import { MermaidDiagram } from './components/MermaidDiagram'
import { PayoffMatrix } from './components/PayoffMatrix'
import { AnalysisChart } from './components/AnalysisChart'
import { VisualizationTab } from './components/VisualizationTab'
import ProcessStatus from './components/ProcessStatus'
import ErrorBoundary from './components/ErrorBoundary'
import { HelpTooltip } from './components/HelpTooltip'
import { ThemeToggle } from './components/ThemeToggle'
import { EnhancedTestSuite } from './components/EnhancedTestSuite'
import { PerformanceMonitor } from './components/PerformanceMonitor'
import { SimpleMethodSelector } from './components/SimpleMethodSelector'
import { useTheme } from './hooks/useTheme'
import './App.css'

function App() {
  const [apiKey, setApiKey] = useLocalStorage('gemini-api-key', '')
  const [problemText, setProblemText] = useLocalStorage('problem-text', '')
  const [selectedModel, setSelectedModel] = useLocalStorage('selected-model', '')
  const [debugMode, setDebugMode] = useLocalStorage('debug-mode', false)
  const [optimizationMode, setOptimizationMode] = useLocalStorage('optimization-mode', false)
  const [selectedMethods, setSelectedMethods] = useLocalStorage('selected-methods', [])
  const [apiKeyVisible, setApiKeyVisible] = useState(false)

  const { theme } = useTheme()
  const { isAnalyzing, progress, currentPhase, logs, results, error, startAnalysis, clearResults } = useAnalysis()
  const { models, isLoading: isLoadingModels, error: modelsError, fetchModels } = useModels()

  // 簡易的な最適モデル選択（存在すれば Flash を優先、なければ先頭）
  const selectOptimalModel = (purpose) => {
    if (!models || models.length === 0) return ''
    const flash = models.find(m => /flash/i.test(m.name))
    return (flash || models[0]).name
  }

  useEffect(() => {
    if (apiKey) {
      fetchModels(apiKey)
    }
  }, [apiKey, fetchModels])

  useEffect(() => {
    if (models.length > 0 && !selectedModel) {
      setSelectedModel(selectOptimalModel('general'))
    }
  }, [models, selectedModel])

  const handleStartAnalysis = useCallback(async () => {
    try {
      console.log('分析開始:', { problemText, selectedMethods, apiKey: !!apiKey, selectedModel })
      await startAnalysis(problemText, selectedMethods, { apiKey, model: selectedModel, debugMode, optimizationMode })
    } catch (error) {
      console.error('分析開始エラー:', error)
      // エラーが発生してもアプリケーションがクラッシュしないようにする
    }
  }, [startAnalysis, problemText, selectedMethods, apiKey, selectedModel, debugMode, optimizationMode])

  const isAnalysisReady = problemText.trim() !== '' && !isAnalyzing

  return (
    <ErrorBoundary showDetails={true}>
<div className="min-h-screen bg-background">
        <div className="container mx-auto p-4 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ゲーム理論分析エージェント
              </h1>
              <p className="text-muted-foreground mt-1">
                AI駆動のOR分析プラットフォーム
              </p>
            </div>
            <ThemeToggle />
          </div>

          {/* Main Content */}
          <Tabs defaultValue="analysis" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="analysis" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                分析
              </TabsTrigger>
              <TabsTrigger value="results" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                結果
              </TabsTrigger>
              <TabsTrigger value="visualization" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                可視化
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                設定
              </TabsTrigger>
            </TabsList>

            {/* Analysis Tab */}
            <TabsContent value="analysis" className="space-y-6">
              {/* Main Input Section */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Problem Input - Takes 2 columns */}
                <div className="xl:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        問題入力
                        <HelpTooltip content="分析したい問題を自然言語で記述してください" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="例：ある工場では、製品Aと製品Bを生産している..."
                        value={problemText}
                        onChange={(e) => setProblemText(e.target.value)}
                        className="min-h-[200px]"
                      />
                      <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                        <span>{problemText.length} 文字</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setProblemText('')}
                        >
                          クリア
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Analysis Methods - Takes 1 column */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        分析手法
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <SimpleMethodSelector
                        selectedMethods={selectedMethods}
                        onMethodsChange={setSelectedMethods}
                        problemText={problemText}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Analysis Control and Status */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Control Panel */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Play className="h-5 w-5" />
                        分析実行
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {isAnalyzing && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span className="text-sm">分析実行中...</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <Button
                            onClick={handleStartAnalysis}
                            disabled={!isAnalysisReady}
                            className="w-full"
                          >
                            {isAnalyzing ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                分析中...
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4 mr-2" />
                                {selectedMethods.length > 0 ? '分析開始' : '自動分析開始'}
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={clearResults}
                            disabled={!results}
                            className="w-full"
                          >
                            結果クリア
                          </Button>
                        </div>

                        {error && (
                          <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Process Status */}
                <div className="lg:col-span-1">
                  <ProcessStatus 
                    isAnalyzing={isAnalyzing}
                    currentPhase={currentPhase}
                    progress={progress}
                  />
                </div>

                {/* Live Logs */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Terminal className="h-5 w-5" />
                        実行ログ
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[200px]">
                        <div className="space-y-1">
                          {logs.slice(-10).map((log, index) => (
                            <div key={index} className="text-xs font-mono p-2 bg-slate-100 dark:bg-slate-800 rounded">
                              <span className="text-muted-foreground">
                                {new Date(log.timestamp).toLocaleTimeString()}
                              </span>
                              <span className="ml-2">{log.message}</span>
                            </div>
                          ))}
                          {logs.length === 0 && (
                            <div className="text-sm text-muted-foreground text-center py-4">
                              ログがありません
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </div>

            </TabsContent>

            {/* Results Tab */}
            <TabsContent value="results" className="space-y-4">
              {results ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>分析結果</CardTitle>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const dataStr = JSON.stringify(results, null, 2)
                            const dataBlob = new Blob([dataStr], { type: 'application/json' })
                            const url = URL.createObjectURL(dataBlob)
                            const link = document.createElement('a')
                            link.href = url
                            link.download = `analysis-results-${new Date().toISOString().split('T')[0]}.json`
                            link.click()
                            URL.revokeObjectURL(url)
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          JSON出力
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">概要</h4>
                        <p className="text-sm text-muted-foreground">
                          {results.executiveSummary || results.interpretation?.summary || '分析結果の概要'}
                        </p>
                      </div>
                      
                      {results.keyFindings && results.keyFindings.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">主要な発見</h4>
                          <ul className="text-sm space-y-1">
                            {results.keyFindings.map((finding, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1">•</span>
                                {finding}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {results.recommendations && results.recommendations.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">推奨事項</h4>
                          <ul className="text-sm space-y-1">
                            {results.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {results.finalReport && (
                        <div>
                          <h4 className="font-semibold mb-2">最終レポート</h4>
                          <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-60">
                            {JSON.stringify(results.finalReport, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      分析を実行すると結果がここに表示されます
                    </p>
                  </CardContent>
                </Card>
              )}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>ログ</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px] p-4 border rounded-md mt-2">
                    {logs.length > 0 ? (
                      logs.map((log, index) => (
                        <p key={index} className="text-sm">[{log.timestamp}] <Badge variant={log.type === 'エラー' ? 'destructive' : 'secondary'}>{log.type}</Badge> {log.message}</p>
                      ))
                    ) : (
                      <p className="text-muted-foreground">ログはありません。</p>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Visualization Tab */}
            <TabsContent value="visualization" className="mt-4">
              <VisualizationTab analysisResults={results} />
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* API Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      API設定
                      <HelpTooltip content="Google AI StudioでGemini APIキーを取得してください" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="api-key">Gemini APIキー</Label>
                      <div className="flex gap-2">
                        <Input
                          id="api-key"
                          type={apiKeyVisible ? 'text' : 'password'}
                          placeholder="AIzaSy..."
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setApiKeyVisible(!apiKeyVisible)}
                        >
                          {apiKeyVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ai-model">AIモデル</Label>
                      <Select value={selectedModel} onValueChange={setSelectedModel} disabled={isLoadingModels || modelsError}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="モデルを選択" />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingModels ? (
                            <SelectItem value="loading" disabled>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> モデル読み込み中...
                            </SelectItem>
                          ) : modelsError ? (
                            <SelectItem value="error" disabled>
                              <XCircle className="mr-2 h-4 w-4" /> モデルの読み込みに失敗しました: {modelsError.message}
                            </SelectItem>
                          ) : (
                            models.map((model) => (
                              <SelectItem key={model.name} value={model.name}>
                                {model.displayName} ({model.name})
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      {modelsError && (
                        <p className="text-sm text-red-500">モデルの読み込みに失敗しました: {modelsError.message}</p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="debug-mode"
                        checked={debugMode}
                        onCheckedChange={setDebugMode}
                      />
                      <Label htmlFor="debug-mode">デバッグモード</Label>
                      <HelpTooltip content="デバッグモードを有効にすると、より詳細なログが出力されます。" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="optimization-mode"
                        checked={optimizationMode}
                        onCheckedChange={setOptimizationMode}
                      />
                      <Label htmlFor="optimization-mode">最適化モード</Label>
                      <HelpTooltip content="最適化モードを有効にすると、コストを抑えるために軽量なモデルや処理が優先されます。" />
                    </div>
                  </CardContent>
                </Card>

                {/* Test Suite */}
                <Card>
                  <CardHeader>
                    <CardTitle>システムテスト</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EnhancedTestSuite
                      apiKey={apiKey}
                      onApiKeyChange={setApiKey}
                      onModelChange={setSelectedModel}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Performance Monitor */}
              <Card>
                <CardHeader>
                  <CardTitle>パフォーマンス監視</CardTitle>
                </CardHeader>
                <CardContent>
                  <PerformanceMonitor />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default App


