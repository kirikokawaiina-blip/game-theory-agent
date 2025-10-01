/**
 * Enhanced Test Suite Component
 * APIキーテスト、モデル選択、機能テストを含む強化されたテストスイート
 */

import { useState, useCallback, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Loader2, 
  Key, 
  Brain, 
  Calculator,
  BarChart3,
  Settings,
  Bell
} from 'lucide-react'
import { EnhancedGeminiClient } from '../lib/enhanced-gemini-client'
import { NashEquilibriumSolver } from '../lib/game-theory-algorithms'
import { ORAnalysisEngine } from '../lib/or-analysis-engine'

export function EnhancedTestSuite({ apiKey, onApiKeyChange, onModelChange }) {
  const [isRunning, setIsRunning] = useState(false)
  const [currentTest, setCurrentTest] = useState('')
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState([])
  const [availableModels, setAvailableModels] = useState([])
  const [selectedModel, setSelectedModel] = useState('')
  const [notifications, setNotifications] = useState([])
  
  const clientRef = useRef(null)
  const testStartTime = useRef(null)

  // 通知の追加
  const addNotification = useCallback((notification) => {
    setNotifications(prev => [...prev, {
      ...notification,
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString()
    }])
  }, [])

  // テスト結果の追加
  const addTestResult = useCallback((test) => {
    setResults(prev => [...prev, {
      ...test,
      timestamp: new Date().toLocaleTimeString()
    }])
  }, [])

  // APIキーテスト
  const testApiKey = async () => {
    if (!apiKey) {
      throw new Error('APIキーが設定されていません')
    }

    try {
      clientRef.current = new EnhancedGeminiClient(apiKey)
      const models = await clientRef.current.getAvailableModels()
      
      setAvailableModels(models)
      
      if (models.length > 0) {
        const defaultModel = models[0].name
        setSelectedModel(defaultModel)
        if (onModelChange) {
          onModelChange(defaultModel)
        }
      }

      // レート制限を避けるために待機
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return {
        success: true,
        message: `${models.length}個のモデルが利用可能です`,
        data: models
      }
    } catch (error) {
      throw new Error(`APIキーテスト失敗: ${error.message}`)
    }
  }

  // モデル選択テスト
  const testModelSelection = async () => {
    const client = clientRef.current
    const modelsInClient = client?.availableModels || []
    if (!client || modelsInClient.length === 0) {
      throw new Error('モデルが利用できません')
    }

    try {
      // 各モデルで簡単なテストを実行
      const testPrompt = "1+1の答えを数字のみで回答してください。"
      const model = selectedModel || modelsInClient[0].name
      
      const response = await clientRef.current.callGeminiAPI(model, testPrompt, {
        temperature: 0,
        maxOutputTokens: 10
      })

      return {
        success: true,
        message: `モデル ${model} が正常に動作しています`,
        data: { model, response: response.trim() }
      }
    } catch (error) {
      throw new Error(`モデルテスト失敗: ${error.message}`)
    }
  }

  // 分析機能テスト
  const testAnalysisFunction = async () => {
    if (!clientRef.current) {
      throw new Error('APIクライアントが初期化されていません')
    }

    try {
      const testProblem = "2つの企業が価格競争をしています。企業Aが高価格なら利益10、低価格なら利益5。企業Bが高価格なら利益8、低価格なら利益3。"
      
      const result = await clientRef.current.analyzeProblem(testProblem, ['game_theory'], {
        model: selectedModel || availableModels[0]?.name
      })

      return {
        success: true,
        message: '分析機能が正常に動作しています',
        data: result
      }
    } catch (error) {
      throw new Error(`分析機能テスト失敗: ${error.message}`)
    }
  }

  // 計算式生成テスト
  const testFormulaGeneration = async () => {
    if (!clientRef.current) {
      throw new Error('APIクライアントが初期化されていません')
    }

    try {
      const testData = {
        problemType: "game_theory",
        results: { summary: "ナッシュ均衡の計算" }
      }
      
      const formulas = await clientRef.current.generateCalculationFormulas(testData, 'game_theory')

      return {
        success: true,
        message: '計算式生成が正常に動作しています',
        data: formulas
      }
    } catch (error) {
      throw new Error(`計算式生成テスト失敗: ${error.message}`)
    }
  }

  // 可視化生成テスト
  const testVisualizationGeneration = async () => {
    if (!clientRef.current) {
      throw new Error('APIクライアントが初期化されていません')
    }

    try {
      const testData = {
        problemType: "game_theory",
        results: { summary: "利得行列の可視化" }
      }
      
      const html = await clientRef.current.generateVisualizationHTML(testData, 'game_theory')

      return {
        success: html.includes('<html') || html.includes('<!DOCTYPE'),
        message: '可視化生成が正常に動作しています',
        data: { htmlLength: html.length }
      }
    } catch (error) {
      throw new Error(`可視化生成テスト失敗: ${error.message}`)
    }
  }

  // ローカル計算テスト
  const testLocalCalculations = async () => {
    try {
      // ゲーム理論テスト
      const payoffMatrix = [
        [[3, 3], [0, 5]],
        [[5, 0], [1, 1]]
      ]
      const nashEquilibrium = NashEquilibriumSolver.findPureStrategyEquilibria(
        payoffMatrix, 
        ['戦略A', '戦略B'], 
        ['戦略X', '戦略Y']
      )

      // OR分析テスト（staticメソッドとして呼び出し）
      const lpResult = ORAnalysisEngine.solveLinearProgramming({
        objective: [3, 2],
        constraints: [[1, 1], [2, 1]],
        bounds: [4, 6],
        maximize: true
      })

      return {
        success: true,
        message: 'ローカル計算が正常に動作しています',
        data: { nashEquilibrium, lpResult }
      }
    } catch (error) {
      throw new Error(`ローカル計算テスト失敗: ${error.message}`)
    }
  }

  // 全テストの実行
  const runAllTests = async () => {
    setIsRunning(true)
    setResults([])
    setProgress(0)
    setNotifications([])
    testStartTime.current = Date.now()

    const tests = [
      { name: 'APIキー検証', icon: Key, test: testApiKey },
      { name: 'モデル選択', icon: Brain, test: testModelSelection },
      { name: '分析機能', icon: Calculator, test: testAnalysisFunction },
      { name: '計算式生成', icon: Calculator, test: testFormulaGeneration },
      { name: '可視化生成', icon: BarChart3, test: testVisualizationGeneration },
      { name: 'ローカル計算', icon: Settings, test: testLocalCalculations }
    ]

    let passedTests = 0
    let failedTests = 0

    for (let i = 0; i < tests.length; i++) {
      const { name, icon, test } = tests[i]
      setCurrentTest(name)
      setProgress((i / tests.length) * 100)

      try {
        const result = await test()
        addTestResult({
          name,
          icon,
          status: 'success',
          message: result.message,
          data: result.data
        })
        passedTests++
      } catch (error) {
        addTestResult({
          name,
          icon,
          status: 'error',
          message: error.message,
          error: error
        })
        failedTests++
      }

      // レート制限を避けるために待機時間を延長
      await new Promise(resolve => setTimeout(resolve, 2000)) // 2秒待機
    }

    setProgress(100)
    setCurrentTest('完了')
    setIsRunning(false)

    // 完了通知
    const totalTime = Date.now() - testStartTime.current
    const notification = {
      type: failedTests === 0 ? 'success' : 'warning',
      title: 'テスト完了',
      message: `${passedTests}個成功、${failedTests}個失敗 (${Math.round(totalTime / 1000)}秒)`,
      allPassed: failedTests === 0
    }

    addNotification(notification)

    // ブラウザ通知（権限がある場合）
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('テスト完了', {
        body: notification.message,
        icon: failedTests === 0 ? '✅' : '⚠️'
      })
    }
  }

  // 通知権限の要求
  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission()
    }
  }

  return (
    <div className="space-y-6">
      {/* テスト実行コントロール */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            システムテスト
          </CardTitle>
          <CardDescription>
            APIキー、モデル選択、分析機能の動作を確認します
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={runAllTests}
              disabled={isRunning || !apiKey}
              className="flex-1"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  テスト実行中...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  全テストを開始
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={requestNotificationPermission}
              size="sm"
            >
              <Bell className="h-4 w-4" />
            </Button>
          </div>

          {isRunning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{currentTest}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* モデル選択 */}
      {availableModels.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              利用可能なモデル
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {availableModels.map((model) => (
                <div
                  key={model.name}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedModel === model.name ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => {
                    setSelectedModel(model.name)
                    if (onModelChange) {
                      onModelChange(model.name)
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{model.displayName}</h4>
                      <p className="text-sm text-muted-foreground">{model.description}</p>
                    </div>
                    {selectedModel === model.name && (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* テスト結果 */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              テスト結果
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0">
                    {result.status === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : result.status === 'error' ? (
                      <XCircle className="h-5 w-5 text-red-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{result.name}</h4>
                      <Badge variant={result.status === 'success' ? 'default' : 'destructive'}>
                        {result.status === 'success' ? '成功' : '失敗'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{result.timestamp}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{result.message}</p>
                    {result.data && (
                      <details className="mt-2">
                        <summary className="text-xs cursor-pointer text-blue-600 hover:text-blue-800">
                          詳細データを表示
                        </summary>
                        <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto max-h-32">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 通知 */}
      {notifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              通知
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border ${
                    notification.type === 'success' 
                      ? 'bg-green-50 border-green-200 dark:bg-green-950/20' 
                      : 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {notification.allPassed ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                    )}
                    <div>
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

