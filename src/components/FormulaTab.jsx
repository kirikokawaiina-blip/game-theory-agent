/**
 * Formula Tab Component
 * 厳密な計算式を表示するタブ - JavaScript実行可能な式とLaTeX表示
 */

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Calculator, 
  Play, 
  Copy, 
  Check, 
  AlertTriangle, 
  Info,
  Code,
  Eye,
  Download
} from 'lucide-react'

export function FormulaTab({ analysisResults }) {
  const [formulas, setFormulas] = useState([])
  const [executionResults, setExecutionResults] = useState({})
  const [copiedFormula, setCopiedFormula] = useState(null)
  const [activeFormulaTab, setActiveFormulaTab] = useState('javascript')

  // 分析結果から計算式を生成
  useEffect(() => {
    if (analysisResults) {
      generateFormulas(analysisResults)
    }
  }, [analysisResults])

  const generateFormulas = (results) => {
    const generatedFormulas = []

    // 分析手法に基づいて計算式を生成
    if (results.selectedMethods) {
      results.selectedMethods.forEach(method => {
        const methodFormulas = getFormulasForMethod(method, results)
        generatedFormulas.push(...methodFormulas)
      })
    }

    setFormulas(generatedFormulas)
  }

  const getFormulasForMethod = (method, results) => {
    const formulas = []

    switch (method) {
      case 'nash_equilibrium':
        formulas.push({
          id: 'nash_best_response',
          name: 'ナッシュ均衡 - 最適反応',
          category: 'ゲーム理論',
          description: 'プレイヤーiの戦略siに対する最適反応関数',
          jsFormula: `
// プレイヤーiの最適反応関数
function bestResponse(payoffMatrix, playerIndex, opponentStrategies) {
  const strategies = payoffMatrix[playerIndex];
  let maxPayoff = -Infinity;
  let bestStrategy = 0;
  
  for (let i = 0; i < strategies.length; i++) {
    let expectedPayoff = 0;
    for (let j = 0; j < opponentStrategies.length; j++) {
      expectedPayoff += strategies[i][j] * opponentStrategies[j];
    }
    if (expectedPayoff > maxPayoff) {
      maxPayoff = expectedPayoff;
      bestStrategy = i;
    }
  }
  
  return { strategy: bestStrategy, payoff: maxPayoff };
}

// 例: 2x2ゲームでの計算
const payoffMatrix = [
  [[3, 3], [0, 5]],  // プレイヤー1の利得
  [[3, 3], [5, 0]]   // プレイヤー2の利得
];
const opponentMixedStrategy = [0.5, 0.5];  // 相手の混合戦略
const result = bestResponse(payoffMatrix, 0, opponentMixedStrategy);
`,
          latexFormula: `BR_i(s_{-i}) = \\arg\\max_{s_i \\in S_i} u_i(s_i, s_{-i})`,
          variables: {
            'BR_i': 'プレイヤーiの最適反応',
            's_i': 'プレイヤーiの戦略',
            's_{-i}': '他のプレイヤーの戦略',
            'u_i': 'プレイヤーiの効用関数'
          }
        })

        formulas.push({
          id: 'nash_equilibrium_condition',
          name: 'ナッシュ均衡条件',
          category: 'ゲーム理論',
          description: 'ナッシュ均衡の数学的定義',
          jsFormula: `
// ナッシュ均衡の検証
function isNashEquilibrium(payoffMatrix, strategies) {
  const numPlayers = payoffMatrix.length;
  
  for (let player = 0; player < numPlayers; player++) {
    const currentStrategy = strategies[player];
    const otherStrategies = strategies.filter((_, i) => i !== player);
    
    // 現在の戦略が最適反応かチェック
    const bestResp = bestResponse(payoffMatrix, player, otherStrategies);
    
    if (Math.abs(bestResp.strategy - currentStrategy) > 1e-6) {
      return false;  // ナッシュ均衡ではない
    }
  }
  
  return true;  // ナッシュ均衡
}

// 例: 戦略プロファイルの検証
const strategyProfile = [0, 1];  // (戦略0, 戦略1)
const isEquilibrium = isNashEquilibrium(payoffMatrix, strategyProfile);
`,
          latexFormula: `s^* = (s_1^*, s_2^*, ..., s_n^*) \\text{ is Nash Equilibrium if } \\forall i: s_i^* \\in BR_i(s_{-i}^*)`,
          variables: {
            's^*': 'ナッシュ均衡戦略プロファイル',
            'BR_i': 'プレイヤーiの最適反応対応',
            'n': 'プレイヤー数'
          }
        })
        break

      case 'linear_programming':
        formulas.push({
          id: 'simplex_pivot',
          name: 'シンプレックス法 - ピボット操作',
          category: '最適化',
          description: 'シンプレックス表でのピボット操作',
          jsFormula: `
// シンプレックス法のピボット操作
function pivotOperation(tableau, pivotRow, pivotCol) {
  const rows = tableau.length;
  const cols = tableau[0].length;
  const newTableau = tableau.map(row => [...row]);
  
  // ピボット要素で正規化
  const pivotElement = tableau[pivotRow][pivotCol];
  for (let j = 0; j < cols; j++) {
    newTableau[pivotRow][j] = tableau[pivotRow][j] / pivotElement;
  }
  
  // 他の行を更新
  for (let i = 0; i < rows; i++) {
    if (i !== pivotRow) {
      const multiplier = tableau[i][pivotCol];
      for (let j = 0; j < cols; j++) {
        newTableau[i][j] = tableau[i][j] - multiplier * newTableau[pivotRow][j];
      }
    }
  }
  
  return newTableau;
}

// 例: 3x4のシンプレックス表
const tableau = [
  [1, 2, 1, 0, 8],
  [2, 1, 0, 1, 10],
  [-3, -2, 0, 0, 0]
];
const newTableau = pivotOperation(tableau, 0, 0);
`,
          latexFormula: `x_{ij}^{new} = \\begin{cases} 
x_{rj} / x_{rc} & \\text{if } i = r \\\\
x_{ij} - x_{ic} \\cdot (x_{rj} / x_{rc}) & \\text{if } i \\neq r
\\end{cases}`,
          variables: {
            'x_{ij}': 'シンプレックス表の要素',
            'r': 'ピボット行',
            'c': 'ピボット列',
            'x_{rc}': 'ピボット要素'
          }
        })
        break

      case 'queuing_theory':
        formulas.push({
          id: 'mm1_queue_metrics',
          name: 'M/M/1待ち行列の性能指標',
          category: '確率モデル',
          description: 'M/M/1待ち行列システムの主要性能指標',
          jsFormula: `
// M/M/1待ち行列の性能指標計算
function mm1QueueMetrics(arrivalRate, serviceRate) {
  if (arrivalRate >= serviceRate) {
    throw new Error('システムが不安定です (ρ ≥ 1)');
  }
  
  const rho = arrivalRate / serviceRate;  // 利用率
  const L = rho / (1 - rho);              // 平均系内客数
  const Lq = (rho * rho) / (1 - rho);     // 平均待ち行列長
  const W = L / arrivalRate;              // 平均系内時間
  const Wq = Lq / arrivalRate;            // 平均待ち時間
  
  return {
    utilization: rho,
    avgCustomersInSystem: L,
    avgCustomersInQueue: Lq,
    avgTimeInSystem: W,
    avgWaitingTime: Wq,
    probability0: 1 - rho  // 空の確率
  };
}

// 例: λ=8, μ=10の場合
const lambda = 8;  // 到着率 (customers/hour)
const mu = 10;     // サービス率 (customers/hour)
const metrics = mm1QueueMetrics(lambda, mu);
`,
          latexFormula: `\\rho = \\frac{\\lambda}{\\mu}, \\quad L = \\frac{\\rho}{1-\\rho}, \\quad W = \\frac{L}{\\lambda}`,
          variables: {
            'λ': '到着率',
            'μ': 'サービス率',
            'ρ': '利用率',
            'L': '平均系内客数',
            'W': '平均系内時間'
          }
        })
        break

      case 'eoq_model':
        formulas.push({
          id: 'eoq_formula',
          name: '経済発注量 (EOQ)',
          category: '在庫管理',
          description: '最適な発注量を求めるEOQ公式',
          jsFormula: `
// 経済発注量 (EOQ) の計算
function calculateEOQ(annualDemand, orderingCost, holdingCost) {
  const eoq = Math.sqrt((2 * annualDemand * orderingCost) / holdingCost);
  const totalCost = Math.sqrt(2 * annualDemand * orderingCost * holdingCost);
  const orderFrequency = annualDemand / eoq;
  const cycleTime = eoq / annualDemand * 365;  // 日数
  
  return {
    economicOrderQuantity: eoq,
    totalAnnualCost: totalCost,
    orderingFrequency: orderFrequency,
    cycleLengthDays: cycleTime,
    orderingCostPerYear: orderFrequency * orderingCost,
    holdingCostPerYear: (eoq / 2) * holdingCost
  };
}

// 例: D=1000, K=50, h=2の場合
const D = 1000;  // 年間需要
const K = 50;    // 発注費用
const h = 2;     // 保管費用 (単位あたり年間)
const eoqResult = calculateEOQ(D, K, h);
`,
          latexFormula: `Q^* = \\sqrt{\\frac{2DK}{h}}, \\quad TC^* = \\sqrt{2DKh}`,
          variables: {
            'Q*': '最適発注量',
            'D': '年間需要',
            'K': '発注費用',
            'h': '単位保管費用',
            'TC*': '最小総費用'
          }
        })
        break

      default:
        // 一般的な計算式
        formulas.push({
          id: 'general_optimization',
          name: '一般最適化問題',
          category: '最適化',
          description: '制約付き最適化問題の一般形',
          jsFormula: `
// 制約付き最適化問題の評価
function evaluateOptimizationProblem(objectiveFunc, constraints, variables) {
  // 目的関数の評価
  const objectiveValue = objectiveFunc(variables);
  
  // 制約条件の評価
  const constraintViolations = constraints.map(constraint => {
    const value = constraint.func(variables);
    const violation = Math.max(0, value - constraint.bound);
    return { constraint: constraint.name, value, violation };
  });
  
  // 実行可能性の判定
  const isFeasible = constraintViolations.every(c => c.violation === 0);
  
  return {
    objectiveValue,
    constraintViolations,
    isFeasible,
    totalViolation: constraintViolations.reduce((sum, c) => sum + c.violation, 0)
  };
}

// 例: 簡単な線形計画問題
const objective = (x) => 3*x[0] + 2*x[1];  // 目的関数
const constraints = [
  { name: 'constraint1', func: (x) => x[0] + x[1], bound: 4 },
  { name: 'constraint2', func: (x) => 2*x[0] + x[1], bound: 6 }
];
const solution = [2, 2];
const result = evaluateOptimizationProblem(objective, constraints, solution);
`,
          latexFormula: `\\max f(x) \\text{ subject to } g_i(x) \\leq b_i, \\forall i`,
          variables: {
            'f(x)': '目的関数',
            'g_i(x)': 'i番目の制約関数',
            'b_i': 'i番目の制約の右辺値',
            'x': '決定変数ベクトル'
          }
        })
    }

    return formulas
  }

  // JavaScript式の実行
  const executeFormula = (formula) => {
    try {
      // 安全な実行環境を作成
      const safeEval = new Function('Math', 'console', formula.jsFormula)
      const result = safeEval(Math, console)
      
      setExecutionResults(prev => ({
        ...prev,
        [formula.id]: { success: true, result: 'コードが正常に実行されました' }
      }))
    } catch (error) {
      setExecutionResults(prev => ({
        ...prev,
        [formula.id]: { success: false, error: error.message }
      }))
    }
  }

  // 計算式のコピー
  const copyFormula = (formula, type = 'js') => {
    const text = type === 'js' ? formula.jsFormula : formula.latexFormula
    navigator.clipboard.writeText(text)
    setCopiedFormula(`${formula.id}_${type}`)
    setTimeout(() => setCopiedFormula(null), 2000)
  }

  if (!analysisResults) {
    return (
      <Card className="bg-white/60 backdrop-blur-sm border-slate-200">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Calculator className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">計算式はまだ生成されていません</h3>
            <p className="text-slate-600">分析を実行すると、厳密な計算式が表示されます</p>
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
            <Calculator className="h-5 w-5" />
            厳密な計算式
          </CardTitle>
          <CardDescription>
            分析で使用された数学的計算式とJavaScript実装
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge variant="outline">{formulas.length} 個の計算式</Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const allFormulas = formulas.map(f => f.jsFormula).join('\n\n')
                navigator.clipboard.writeText(allFormulas)
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              全てエクスポート
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 計算式一覧 */}
      <div className="grid gap-6">
        {formulas.map(formula => (
          <Card key={formula.id} className="bg-white/60 backdrop-blur-sm border-slate-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{formula.name}</CardTitle>
                  <CardDescription className="mt-1">
                    <Badge variant="outline" className="mr-2">{formula.category}</Badge>
                    {formula.description}
                  </CardDescription>
                </div>
                <Button
                  onClick={() => executeFormula(formula)}
                  size="sm"
                  variant="outline"
                >
                  <Play className="h-4 w-4 mr-2" />
                  実行
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeFormulaTab} onValueChange={setActiveFormulaTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="latex">数式 (LaTeX)</TabsTrigger>
                  <TabsTrigger value="variables">変数説明</TabsTrigger>
                </TabsList>

                <TabsContent value="javascript" className="mt-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">実行可能なJavaScriptコード</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyFormula(formula, 'js')}
                      >
                        {copiedFormula === `${formula.id}_js` ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <ScrollArea className="h-64">
                      <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
                        <code>{formula.jsFormula}</code>
                      </pre>
                    </ScrollArea>
                    
                    {/* 実行結果 */}
                    {executionResults[formula.id] && (
                      <div className={`p-3 rounded-lg border ${
                        executionResults[formula.id].success 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-center gap-2">
                          {executionResults[formula.id].success ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          )}
                          <span className={`text-sm font-medium ${
                            executionResults[formula.id].success ? 'text-green-800' : 'text-red-800'
                          }`}>
                            {executionResults[formula.id].success ? '実行成功' : '実行エラー'}
                          </span>
                        </div>
                        <p className={`text-sm mt-1 ${
                          executionResults[formula.id].success ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {executionResults[formula.id].result || executionResults[formula.id].error}
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="latex" className="mt-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">数学的表現 (LaTeX)</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyFormula(formula, 'latex')}
                      >
                        {copiedFormula === `${formula.id}_latex` ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border">
                      <code className="text-sm font-mono">{formula.latexFormula}</code>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">レンダリング情報</span>
                      </div>
                      <p className="text-xs text-blue-700">
                        この数式をレンダリングするには、KaTeX や MathJax などの数式レンダリングライブラリを使用してください。
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="variables" className="mt-4">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">変数と記号の説明</Label>
                    <div className="grid gap-2">
                      {Object.entries(formula.variables).map(([symbol, description]) => (
                        <div key={symbol} className="flex items-center gap-3 p-2 bg-slate-50 rounded">
                          <code className="bg-white px-2 py-1 rounded text-sm font-mono border">
                            {symbol}
                          </code>
                          <span className="text-sm text-slate-700">{description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default FormulaTab

