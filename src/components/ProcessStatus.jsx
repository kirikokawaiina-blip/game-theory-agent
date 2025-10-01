import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Loader2, CheckCircle, XCircle, Clock, Brain, Settings, Play, BarChart3, FileCheck } from 'lucide-react'

const ProcessStatus = ({ 
  isAnalyzing, 
  progress, 
  progressMessage, 
  currentStep, 
  logs = [],
  onClearLogs 
}) => {
  const steps = [
    { id: 1, name: '問題分析', icon: Brain, description: '問題の構造と要件を分析' },
    { id: 2, name: '手法選択', icon: Settings, description: '最適な分析手法を選択' },
    { id: 3, name: '実行', icon: Play, description: '選択された手法で分析を実行' },
    { id: 4, name: '検証', icon: FileCheck, description: '結果の妥当性を検証' },
    { id: 5, name: '統合', icon: BarChart3, description: '結果を統合してレポート生成' }
  ]

  const getStepIcon = (stepId, currentStep) => {
    if (stepId < currentStep) return CheckCircle
    if (stepId === currentStep && isAnalyzing) return Loader2
    if (stepId === currentStep && !isAnalyzing) return Clock
    return Clock
  }

  const getStepStatus = (stepId, currentStep) => {
    if (stepId < currentStep) return 'completed'
    if (stepId === currentStep && isAnalyzing) return 'active'
    if (stepId === currentStep && !isAnalyzing) return 'pending'
    return 'pending'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'active': return 'bg-blue-500'
      case 'pending': return 'bg-gray-300 dark:bg-gray-600'
      default: return 'bg-gray-300 dark:bg-gray-600'
    }
  }

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 dark:text-green-400'
      case 'active': return 'text-blue-600 dark:text-blue-400'
      case 'pending': return 'text-gray-500 dark:text-gray-400'
      default: return 'text-gray-500 dark:text-gray-400'
    }
  }

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'completed': return 'default'
      case 'active': return 'secondary'
      case 'pending': return 'outline'
      default: return 'outline'
    }
  }

  return (
    <div className="space-y-4">
      {/* プロセス進行状況 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isAnalyzing ? (
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
            ) : (
              <Brain className="h-5 w-5" />
            )}
            分析プロセス
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* プログレスバー */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{progressMessage || '分析を開始しています...'}</span>
                <span className="text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* ステップ表示 */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
              {steps.map((step) => {
                const Icon = getStepIcon(step.id, currentStep)
                const status = getStepStatus(step.id, currentStep)
                const isActive = step.id === currentStep && isAnalyzing
                
                return (
                  <div
                    key={step.id}
                    className={`p-3 rounded-lg border transition-all ${
                      status === 'completed' 
                        ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
                        : status === 'active'
                        ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                        : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getStatusColor(status)}`}>
                        <Icon 
                          className={`h-3 w-3 ${
                            status === 'completed' ? 'text-white' : 
                            status === 'active' ? 'text-white' : 
                            'text-gray-500 dark:text-gray-400'
                          } ${isActive ? 'animate-spin' : ''}`} 
                        />
                      </div>
                      <Badge variant={getStatusBadgeVariant(status)} className="text-xs">
                        {step.name}
                      </Badge>
                    </div>
                    <p className={`text-xs ${getStatusTextColor(status)}`}>
                      {step.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* リアルタイムログ */}
      {logs.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                リアルタイムログ
              </CardTitle>
              <button
                onClick={onClearLogs}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                クリア
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {logs.slice(-10).map((log, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-2 rounded-lg bg-muted/50"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {log.type === 'error' ? (
                      <XCircle className="h-4 w-4 text-red-500" />
                    ) : log.type === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-muted-foreground">
                        {log.timestamp}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {log.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground break-words">
                      {log.message}
                    </p>
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

export default ProcessStatus
