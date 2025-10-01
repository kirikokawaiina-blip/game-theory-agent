/**
 * Analysis Progress Component
 * リアルタイムで分析進捗を表示するコンポーネント
 */

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Pause, 
  Play,
  RotateCcw,
  Zap,
  Brain,
  Calculator,
  BarChart3,
  FileText
} from 'lucide-react'

export function AnalysisProgress({ isAnalyzing, selectedMethods, problemText }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [logs, setLogs] = useState([])
  const [progress, setProgress] = useState(0)
  const [estimatedTime, setEstimatedTime] = useState(0)
  const [startTime, setStartTime] = useState(null)

  // 分析ステップの定義
  const analysisSteps = [
    {
      id: 1,
      name: '問題文解析',
      description: 'テキストを解析し、キーワードと構造を特定',
      icon: FileText,
      estimatedDuration: 2000,
      color: 'blue'
    },
    {
      id: 2,
      name: '手法適合性評価',
      description: '選択された分析手法の適合性を評価',
      icon: Brain,
      estimatedDuration: 3000,
      color: 'purple'
    },
    {
      id: 3,
      name: 'モデル構築',
      description: '数学的モデルを構築し、パラメータを設定',
      icon: Calculator,
      estimatedDuration: 4000,
      color: 'green'
    },
    {
      id: 4,
      name: '数値計算',
      description: 'アルゴリズムを実行し、解を計算',
      icon: Zap,
      estimatedDuration: 5000,
      color: 'orange'
    },
    {
      id: 5,
      name: '結果生成',
      description: '計算結果を解釈し、可視化を生成',
      icon: BarChart3,
      estimatedDuration: 3000,
      color: 'pink'
    }
  ]

  // 分析開始時の初期化
  useEffect(() => {
    if (isAnalyzing && !startTime) {
      setStartTime(Date.now())
      setCurrentStep(0)
      setProgress(0)
      setLogs([])
      
      // 推定時間の計算
      const totalTime = analysisSteps.reduce((sum, step) => sum + step.estimatedDuration, 0)
      const methodMultiplier = Math.max(1, selectedMethods.length * 0.3)
      const complexityMultiplier = problemText.length > 500 ? 1.5 : 1
      setEstimatedTime(totalTime * methodMultiplier * complexityMultiplier)

      // 初期ログ
      addLog('info', '分析を開始しました', '問題文と選択された手法を確認中...')
      
      // 分析プロセスのシミュレーション
      simulateAnalysisProcess()
    }
  }, [isAnalyzing, startTime])

  // ログの追加
  const addLog = (type, message, details = '') => {
    const newLog = {
      id: Date.now(),
      timestamp: new Date(),
      type, // 'info', 'success', 'warning', 'error'
      message,
      details
    }
    setLogs(prev => [...prev, newLog])
  }

  // 分析プロセスのシミュレーション
  const simulateAnalysisProcess = async () => {
    for (let i = 0; i < analysisSteps.length; i++) {
      const step = analysisSteps[i]
      
      // ステップ開始
      setCurrentStep(i)
      addLog('info', `${step.name}を開始`, step.description)
      
      // 進捗の更新
      const stepProgress = (i / analysisSteps.length) * 100
      setProgress(stepProgress)
      
      // ステップ実行のシミュレーション
      await new Promise(resolve => {
        const duration = step.estimatedDuration + Math.random() * 1000 - 500
        
        // 中間進捗の更新
        const interval = setInterval(() => {
          setProgress(prev => {
            const newProgress = prev + (100 / analysisSteps.length) * 0.1
            return Math.min(newProgress, (i + 1) / analysisSteps.length * 100)
          })
        }, duration / 10)
        
        setTimeout(() => {
          clearInterval(interval)
          
          // ステップ完了
          addLog('success', `${step.name}が完了`, generateStepResult(step, i))
          setProgress((i + 1) / analysisSteps.length * 100)
          
          resolve()
        }, duration)
      })
    }
    
    // 分析完了
    addLog('success', '分析が完了しました', '結果タブで詳細を確認できます')
  }

  // ステップ結果の生成
  const generateStepResult = (step, stepIndex) => {
    const results = [
      [
        '重要キーワード: 企業, 競争, 利益, 戦略',
        '問題タイプ: ゲーム理論的競争問題',
        '変数: 2社の価格戦略'
      ],
      [
        'ナッシュ均衡分析: 高適合性 (95%)',
        '支配戦略分析: 適用可能',
        '混合戦略: 必要に応じて計算'
      ],
      [
        '2×2利得行列を構築',
        'プレイヤー: 企業A, 企業B',
        '戦略: 価格維持, 価格削減'
      ],
      [
        '純戦略ナッシュ均衡: (価格維持, 価格維持)',
        '支配戦略: 価格維持が弱支配',
        '混合戦略均衡: 計算完了'
      ],
      [
        'Mermaid図解を生成',
        '利得行列の可視化完了',
        '推奨事項を生成'
      ]
    ]
    
    return results[stepIndex]?.join(' | ') || '処理完了'
  }

  // 経過時間の計算
  const getElapsedTime = () => {
    if (!startTime) return 0
    return Math.floor((Date.now() - startTime) / 1000)
  }

  // 残り時間の推定
  const getRemainingTime = () => {
    if (!startTime || progress === 0) return estimatedTime / 1000
    const elapsed = getElapsedTime()
    const remaining = (elapsed / (progress / 100)) - elapsed
    return Math.max(0, Math.floor(remaining))
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getLogIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case 'error': return <AlertCircle className="h-4 w-4 text-red-600" />
      default: return <Clock className="h-4 w-4 text-blue-600" />
    }
  }

  const getLogBgColor = (type) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200'
      case 'warning': return 'bg-yellow-50 border-yellow-200'
      case 'error': return 'bg-red-50 border-red-200'
      default: return 'bg-blue-50 border-blue-200'
    }
  }

  if (!isAnalyzing && logs.length === 0) {
    return (
      <Card className="bg-white/60 backdrop-blur-sm border-slate-200">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">分析を開始してください</h3>
            <p className="text-slate-600">設定タブでAPIキーを設定し、問題文を入力して分析を開始してください</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* 進捗概要 */}
      <Card className="bg-white/60 backdrop-blur-sm border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            分析進捗
          </CardTitle>
          <CardDescription>
            リアルタイムで分析の進行状況を表示
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 進捗バー */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">全体進捗</span>
              <span className="text-sm text-slate-600">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* 時間情報 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-lg font-semibold text-blue-800">{formatTime(getElapsedTime())}</div>
              <div className="text-xs text-blue-600">経過時間</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-lg font-semibold text-green-800">{formatTime(getRemainingTime())}</div>
              <div className="text-xs text-green-600">残り時間</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-lg font-semibold text-purple-800">{selectedMethods.length}</div>
              <div className="text-xs text-purple-600">分析手法</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-lg font-semibold text-orange-800">{currentStep + 1}/{analysisSteps.length}</div>
              <div className="text-xs text-orange-600">ステップ</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 現在のステップ */}
      <Card className="bg-white/60 backdrop-blur-sm border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            現在の処理
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {analysisSteps.map((step, index) => {
              const isActive = index === currentStep
              const isCompleted = index < currentStep
              const isPending = index > currentStep
              
              const StepIcon = step.icon
              
              return (
                <div 
                  key={step.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    isActive ? 'bg-blue-50 border-blue-200 shadow-sm' :
                    isCompleted ? 'bg-green-50 border-green-200' :
                    'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isActive ? 'bg-blue-500 text-white animate-pulse' :
                    isCompleted ? 'bg-green-500 text-white' :
                    'bg-slate-300 text-slate-600'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <StepIcon className="h-4 w-4" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{step.name}</h4>
                      <Badge 
                        variant={isActive ? 'default' : isCompleted ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {isActive ? '実行中' : isCompleted ? '完了' : '待機中'}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{step.description}</p>
                  </div>
                  
                  {isActive && (
                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 詳細ログ */}
      <Card className="bg-white/60 backdrop-blur-sm border-slate-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              詳細ログ
            </CardTitle>
            <Badge variant="outline">{logs.length} エントリ</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {logs.map(log => (
                <div 
                  key={log.id}
                  className={`p-3 rounded-lg border ${getLogBgColor(log.type)}`}
                >
                  <div className="flex items-start gap-3">
                    {getLogIcon(log.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{log.message}</span>
                        <span className="text-xs text-slate-500">
                          {log.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      {log.details && (
                        <p className="text-xs text-slate-600 mt-1">{log.details}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

export default AnalysisProgress

