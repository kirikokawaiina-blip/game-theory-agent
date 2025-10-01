/**
 * Test Suite Component
 * アプリケーションの基本機能をテストするコンポーネント
 */

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, AlertCircle, Play } from 'lucide-react'

export function TestSuite() {
  const [testResults, setTestResults] = useState([])
  const [isRunning, setIsRunning] = useState(false)

  const tests = [
    {
      name: 'UI コンポーネント',
      description: 'React コンポーネントが正常に動作するか',
      test: () => {
        return document.querySelector('.container') !== null
      }
    },
    {
      name: 'ローカルストレージ',
      description: 'ローカルストレージへの読み書きが可能か',
      test: () => {
        try {
          localStorage.setItem('test', 'value')
          const value = localStorage.getItem('test')
          localStorage.removeItem('test')
          return value === 'value'
        } catch (error) {
          return false
        }
      }
    },
    {
      name: 'JSON パース',
      description: 'JSON データの解析が正常に動作するか',
      test: () => {
        try {
          const data = JSON.parse('{"test": "value"}')
          return data.test === 'value'
        } catch (error) {
          return false
        }
      }
    },
    {
      name: 'DOM 操作',
      description: 'DOM 要素の操作が可能か',
      test: () => {
        try {
          const element = document.createElement('div')
          element.textContent = 'test'
          return element.textContent === 'test'
        } catch (error) {
          return false
        }
      }
    },
    {
      name: 'イベント処理',
      description: 'イベントリスナーの登録・削除が可能か',
      test: () => {
        try {
          const element = document.createElement('button')
          let clicked = false
          const handler = () => { clicked = true }
          element.addEventListener('click', handler)
          element.click()
          element.removeEventListener('click', handler)
          return clicked
        } catch (error) {
          return false
        }
      }
    },
    {
      name: 'CSS スタイル',
      description: 'CSS スタイルの適用が正常に動作するか',
      test: () => {
        try {
          const element = document.createElement('div')
          element.style.color = 'red'
          return element.style.color === 'red'
        } catch (error) {
          return false
        }
      }
    }
  ]

  const runTests = async () => {
    setIsRunning(true)
    setTestResults([])
    
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i]
      
      try {
        const startTime = Date.now()
        const passed = await test.test()
        const duration = Date.now() - startTime
        
        setTestResults(prev => [...prev, {
          name: test.name,
          description: test.description,
          passed,
          duration,
          error: null
        }])
      } catch (error) {
        setTestResults(prev => [...prev, {
          name: test.name,
          description: test.description,
          passed: false,
          duration: 0,
          error: error.message
        }])
      }
      
      // 少し待機してUIを更新
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    setIsRunning(false)
  }

  const passedTests = testResults.filter(result => result.passed).length
  const totalTests = testResults.length
  const allTestsRun = totalTests === tests.length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          機能テストスイート
        </CardTitle>
        <CardDescription>
          アプリケーションの主要機能が正常に動作するかテストします
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Button 
            onClick={runTests} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            {isRunning ? 'テスト実行中...' : 'テスト開始'}
          </Button>
          
          {allTestsRun && (
            <div className="flex items-center gap-2">
              <Badge variant={passedTests === totalTests ? 'default' : 'destructive'}>
                {passedTests}/{totalTests} 成功
              </Badge>
            </div>
          )}
        </div>

        {testResults.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold">テスト結果:</h4>
            {testResults.map((result, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {result.passed ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <div>
                    <p className="font-medium">{result.name}</p>
                    <p className="text-sm text-muted-foreground">{result.description}</p>
                    {result.error && (
                      <p className="text-sm text-red-600 mt-1">エラー: {result.error}</p>
                    )}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {result.duration}ms
                </Badge>
              </div>
            ))}
          </div>
        )}

        {isRunning && (
          <div className="text-center py-4">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">
              テスト実行中... ({testResults.length}/{tests.length})
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default TestSuite

