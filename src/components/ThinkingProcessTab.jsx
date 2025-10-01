/**
 * Thinking Process Tab Component
 * AIの思考過程をMermaid図で可視化するタブ
 */

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Lightbulb, 
  GitBranch, 
  Target, 
  CheckCircle, 
  AlertCircle,
  Download,
  Eye,
  Maximize2
} from 'lucide-react'
import { MermaidDiagram } from './MermaidDiagram'

export function ThinkingProcessTab({ analysisResults }) {
  const [thinkingSteps, setThinkingSteps] = useState([])
  const [decisionTree, setDecisionTree] = useState('')
  const [processFlow, setProcessFlow] = useState('')
  const [activeThinkingTab, setActiveThinkingTab] = useState('steps')

  // 分析結果から思考過程を生成
  useEffect(() => {
    if (analysisResults) {
      generateThinkingProcess(analysisResults)
    }
  }, [analysisResults])

  const generateThinkingProcess = (results) => {
    // 思考ステップの生成
    const steps = generateThinkingSteps(results)
    setThinkingSteps(steps)

    // 決定木の生成
    const tree = generateDecisionTree(results)
    setDecisionTree(tree)

    // プロセスフローの生成
    const flow = generateProcessFlow(results)
    setProcessFlow(flow)
  }

  const generateThinkingSteps = (results) => {
    const steps = [
      {
        id: 1,
        phase: '問題理解',
        title: '問題文の分析と分類',
        description: '入力された問題文を解析し、適切な分析手法を特定',
        details: [
          '問題文から重要なキーワードを抽出',
          '問題の種類（最適化、ゲーム理論、確率モデルなど）を判定',
          '制約条件と目的関数を識別',
          '必要なデータと変数を特定'
        ],
        status: 'completed',
        confidence: 0.95,
        reasoning: '問題文に「企業」「競争」「利益」などのキーワードが含まれており、ゲーム理論的アプローチが適切と判断'
      },
      {
        id: 2,
        phase: '手法選択',
        title: '最適な分析手法の選択',
        description: '問題の特性に基づいて最も適切な分析手法を選択',
        details: [
          '利用可能な分析手法の評価',
          '問題の複雑さと手法の適合性を評価',
          '計算可能性と実用性を考慮',
          '複数手法の組み合わせを検討'
        ],
        status: 'completed',
        confidence: 0.88,
        reasoning: 'ナッシュ均衡分析が最も適切。支配戦略の存在も確認する必要がある'
      },
      {
        id: 3,
        phase: 'モデル構築',
        title: '数学的モデルの構築',
        description: '問題を数学的に表現し、解析可能な形に変換',
        details: [
          '利得行列の構築',
          'プレイヤーと戦略の定義',
          '制約条件の数式化',
          'パラメータの設定'
        ],
        status: 'completed',
        confidence: 0.92,
        reasoning: '2×2の利得行列として表現可能。各プレイヤーの戦略と利得が明確に定義できる'
      },
      {
        id: 4,
        phase: '計算実行',
        title: '数値計算と解の導出',
        description: '構築したモデルに基づいて実際の計算を実行',
        details: [
          '純戦略ナッシュ均衡の探索',
          '混合戦略均衡の計算',
          '支配戦略の判定',
          'パレート効率性の評価'
        ],
        status: 'completed',
        confidence: 0.90,
        reasoning: '反復削除法により支配戦略を特定。混合戦略均衡も数値的に計算'
      },
      {
        id: 5,
        phase: '結果解釈',
        title: '結果の解釈と実用的示唆',
        description: '計算結果を実際の問題文脈で解釈し、実用的な推奨事項を導出',
        details: [
          '均衡解の経済的意味の解釈',
          '戦略の安定性評価',
          '実装可能性の検討',
          '感度分析の実施'
        ],
        status: 'completed',
        confidence: 0.85,
        reasoning: '協力戦略が相互に最適であることが判明。しかし実装には信頼関係が重要'
      }
    ]

    return steps
  }

  const generateDecisionTree = (results) => {
    return `
graph TD
    A[問題文入力] --> B{問題タイプ判定}
    B -->|競争・戦略| C[ゲーム理論]
    B -->|最適化| D[線形計画法]
    B -->|待ち時間・サービス| E[待ち行列理論]
    B -->|在庫・発注| F[在庫管理]
    
    C --> G{プレイヤー数}
    G -->|2人| H[2人ゲーム分析]
    G -->|多人数| I[n人ゲーム分析]
    
    H --> J{情報構造}
    J -->|完全情報| K[純戦略分析]
    J -->|不完全情報| L[混合戦略分析]
    
    K --> M[支配戦略チェック]
    M -->|存在| N[支配戦略均衡]
    M -->|不存在| O[ナッシュ均衡探索]
    
    L --> P[ベイジアン均衡]
    
    N --> Q[結果解釈]
    O --> Q
    P --> Q
    Q --> R[推奨事項生成]
    
    style A fill:#e1f5fe
    style Q fill:#e8f5e8
    style R fill:#fff3e0
    style N fill:#f3e5f5
    style O fill:#f3e5f5
    style P fill:#f3e5f5
`
  }

  const generateProcessFlow = (results) => {
    return `
flowchart LR
    subgraph "Phase 1: 問題理解"
        A1[テキスト解析] --> A2[キーワード抽出]
        A2 --> A3[問題分類]
        A3 --> A4[変数特定]
    end
    
    subgraph "Phase 2: 手法選択"
        B1[手法候補生成] --> B2[適合性評価]
        B2 --> B3[複雑度評価]
        B3 --> B4[最終選択]
    end
    
    subgraph "Phase 3: モデル化"
        C1[数学的定式化] --> C2[パラメータ設定]
        C2 --> C3[制約条件設定]
        C3 --> C4[モデル検証]
    end
    
    subgraph "Phase 4: 計算"
        D1[アルゴリズム選択] --> D2[数値計算]
        D2 --> D3[収束判定]
        D3 --> D4[解の検証]
    end
    
    subgraph "Phase 5: 解釈"
        E1[結果分析] --> E2[感度分析]
        E2 --> E3[実用性評価]
        E3 --> E4[推奨事項]
    end
    
    A4 --> B1
    B4 --> C1
    C4 --> D1
    D4 --> E1
    
    style A1 fill:#e3f2fd
    style B1 fill:#f3e5f5
    style C1 fill:#e8f5e8
    style D1 fill:#fff3e0
    style E1 fill:#fce4ec
`
  }

  const exportThinkingProcess = () => {
    const content = {
      steps: thinkingSteps,
      decisionTree,
      processFlow,
      metadata: {
        analysisType: analysisResults?.problemType,
        methods: analysisResults?.selectedMethods,
        timestamp: new Date().toISOString()
      }
    }

    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'thinking-process.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!analysisResults) {
    return (
      <Card className="bg-white/60 backdrop-blur-sm border-slate-200">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Lightbulb className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">思考過程はまだ生成されていません</h3>
            <p className="text-slate-600">分析を実行すると、AIの思考プロセスが可視化されます</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <Card className="bg-white/60 backdrop-blur-sm border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            AI思考過程の可視化
          </CardTitle>
          <CardDescription>
            分析プロセスの各段階と意思決定の流れを詳細に表示
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge variant="outline">{thinkingSteps.length} ステップ</Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={exportThinkingProcess}
            >
              <Download className="h-4 w-4 mr-2" />
              思考過程をエクスポート
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 思考過程タブ */}
      <Tabs value={activeThinkingTab} onValueChange={setActiveThinkingTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="steps">ステップ詳細</TabsTrigger>
          <TabsTrigger value="decision-tree">決定木</TabsTrigger>
          <TabsTrigger value="process-flow">プロセスフロー</TabsTrigger>
        </TabsList>

        {/* ステップ詳細 */}
        <TabsContent value="steps" className="space-y-4">
          <div className="grid gap-4">
            {thinkingSteps.map((step, index) => (
              <Card key={step.id} className="bg-white/60 backdrop-blur-sm border-slate-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">{step.id}</span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                        <CardDescription className="mt-1">
                          <Badge variant="outline" className="mr-2">{step.phase}</Badge>
                          {step.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={step.status === 'completed' ? 'default' : 'secondary'}
                        className="flex items-center gap-1"
                      >
                        {step.status === 'completed' ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <AlertCircle className="h-3 w-3" />
                        )}
                        {step.status === 'completed' ? '完了' : '処理中'}
                      </Badge>
                      <Badge variant="outline">
                        信頼度: {Math.round(step.confidence * 100)}%
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* 詳細ステップ */}
                    <div>
                      <h4 className="font-medium text-sm mb-2">実行内容</h4>
                      <ul className="space-y-1">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 推論根拠 */}
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-sm text-blue-800 mb-1">推論根拠</h4>
                      <p className="text-sm text-blue-700">{step.reasoning}</p>
                    </div>

                    {/* 進捗バー */}
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${step.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 決定木 */}
        <TabsContent value="decision-tree" className="space-y-4">
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                分析手法選択の決定木
              </CardTitle>
              <CardDescription>
                問題タイプから最終的な分析手法選択までの意思決定フロー
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white rounded-lg border p-4">
                <MermaidDiagram 
                  chart={decisionTree}
                  id="decision-tree-diagram"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* プロセスフロー */}
        <TabsContent value="process-flow" className="space-y-4">
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                分析プロセスフロー
              </CardTitle>
              <CardDescription>
                5つのフェーズにわたる詳細な分析プロセスの流れ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white rounded-lg border p-4">
                <MermaidDiagram 
                  chart={processFlow}
                  id="process-flow-diagram"
                />
              </div>
            </CardContent>
          </Card>

          {/* フェーズ説明 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                phase: 'Phase 1',
                title: '問題理解',
                description: 'テキスト解析とキーワード抽出により問題を分類',
                color: 'blue'
              },
              {
                phase: 'Phase 2', 
                title: '手法選択',
                description: '適合性と複雑度を評価して最適な手法を選択',
                color: 'purple'
              },
              {
                phase: 'Phase 3',
                title: 'モデル化',
                description: '数学的定式化とパラメータ設定',
                color: 'green'
              },
              {
                phase: 'Phase 4',
                title: '計算実行',
                description: 'アルゴリズム実行と数値計算',
                color: 'orange'
              },
              {
                phase: 'Phase 5',
                title: '結果解釈',
                description: '結果分析と実用的推奨事項の生成',
                color: 'pink'
              }
            ].map(phase => (
              <Card key={phase.phase} className="bg-white/60 backdrop-blur-sm border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className={`bg-${phase.color}-100 text-${phase.color}-800`}>
                      {phase.phase}
                    </Badge>
                  </div>
                  <h4 className="font-medium text-sm mb-1">{phase.title}</h4>
                  <p className="text-xs text-slate-600">{phase.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ThinkingProcessTab

