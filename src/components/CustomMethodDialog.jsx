/**
 * Custom Method Dialog Component
 * ユーザーがカスタム分析手法を指定できるダイアログ
 */

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, X, Save, AlertCircle, Lightbulb } from 'lucide-react'
import { ANALYSIS_CATEGORIES } from '@/lib/analysis-methods'

export function CustomMethodDialog({ onAddMethod, existingMethods = [] }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    complexity: 'medium',
    keywords: [],
    requiredInputs: [],
    outputTypes: [],
    customInstructions: ''
  })
  const [currentKeyword, setCurrentKeyword] = useState('')
  const [currentInput, setCurrentInput] = useState('')
  const [currentOutput, setCurrentOutput] = useState('')

  const complexityOptions = [
    { value: 'low', label: '低', description: '基本的な計算' },
    { value: 'medium', label: '中', description: '中程度の複雑さ' },
    { value: 'high', label: '高', description: '高度な数学的処理' }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.description.trim()) {
      alert('名前と説明は必須です')
      return
    }

    // カスタム手法のキーを生成
    const methodKey = `custom_${formData.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')}`
    
    // 既存の手法と重複チェック
    if (existingMethods.includes(methodKey)) {
      alert('同じ名前の手法が既に存在します')
      return
    }

    const customMethod = {
      key: methodKey,
      category: formData.category || 'custom',
      name: formData.name,
      description: formData.description,
      complexity: formData.complexity,
      keywords: formData.keywords,
      requiredInputs: formData.requiredInputs,
      outputTypes: formData.outputTypes,
      customInstructions: formData.customInstructions,
      isCustom: true
    }

    onAddMethod(customMethod)
    
    // フォームをリセット
    setFormData({
      name: '',
      category: '',
      description: '',
      complexity: 'medium',
      keywords: [],
      requiredInputs: [],
      outputTypes: [],
      customInstructions: ''
    })
    
    setOpen(false)
  }

  const addKeyword = () => {
    if (currentKeyword.trim() && !formData.keywords.includes(currentKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, currentKeyword.trim()]
      }))
      setCurrentKeyword('')
    }
  }

  const removeKeyword = (keyword) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }))
  }

  const addRequiredInput = () => {
    if (currentInput.trim() && !formData.requiredInputs.includes(currentInput.trim())) {
      setFormData(prev => ({
        ...prev,
        requiredInputs: [...prev.requiredInputs, currentInput.trim()]
      }))
      setCurrentInput('')
    }
  }

  const removeRequiredInput = (input) => {
    setFormData(prev => ({
      ...prev,
      requiredInputs: prev.requiredInputs.filter(i => i !== input)
    }))
  }

  const addOutputType = () => {
    if (currentOutput.trim() && !formData.outputTypes.includes(currentOutput.trim())) {
      setFormData(prev => ({
        ...prev,
        outputTypes: [...prev.outputTypes, currentOutput.trim()]
      }))
      setCurrentOutput('')
    }
  }

  const removeOutputType = (output) => {
    setFormData(prev => ({
      ...prev,
      outputTypes: prev.outputTypes.filter(o => o !== output)
    }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          カスタム分析手法を追加
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            カスタム分析手法の定義
          </DialogTitle>
          <DialogDescription>
            独自の分析手法を定義して、AIに実行させることができます。
            詳細な情報を入力することで、より正確な分析が可能になります。
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 基本情報 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">基本情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="method-name">手法名 *</Label>
                  <Input
                    id="method-name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="例: カスタム最適化手法"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="method-category">カテゴリー</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="カテゴリーを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="custom">カスタム</SelectItem>
                      {Object.entries(ANALYSIS_CATEGORIES).map(([key, category]) => (
                        <SelectItem key={key} value={key}>
                          {category.icon} {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="method-description">説明 *</Label>
                <Textarea
                  id="method-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="この分析手法の目的、適用場面、特徴を詳しく説明してください"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="method-complexity">複雑度</Label>
                <Select
                  value={formData.complexity}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, complexity: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {complexityOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label} - {option.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* キーワード */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">キーワード</CardTitle>
              <CardDescription>
                この手法に関連するキーワードを追加してください。AIが問題文から手法を推定する際に使用されます。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={currentKeyword}
                  onChange={(e) => setCurrentKeyword(e.target.value)}
                  placeholder="キーワードを入力"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                />
                <Button type="button" onClick={addKeyword} variant="outline">
                  追加
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.keywords.map(keyword => (
                  <Badge key={keyword} variant="secondary" className="flex items-center gap-1">
                    {keyword}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeKeyword(keyword)}
                    />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 必要な入力 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">必要な入力情報</CardTitle>
              <CardDescription>
                この分析を実行するために必要なデータや情報を指定してください。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  placeholder="例: 目的関数、制約条件、データセット"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequiredInput())}
                />
                <Button type="button" onClick={addRequiredInput} variant="outline">
                  追加
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.requiredInputs.map(input => (
                  <Badge key={input} variant="outline" className="flex items-center gap-1">
                    {input}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeRequiredInput(input)}
                    />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 出力タイプ */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">期待される出力</CardTitle>
              <CardDescription>
                この分析から得られる結果や出力の種類を指定してください。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={currentOutput}
                  onChange={(e) => setCurrentOutput(e.target.value)}
                  placeholder="例: 最適解、推奨事項、リスク評価"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOutputType())}
                />
                <Button type="button" onClick={addOutputType} variant="outline">
                  追加
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.outputTypes.map(output => (
                  <Badge key={output} variant="outline" className="flex items-center gap-1">
                    {output}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeOutputType(output)}
                    />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* カスタム指示 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AIへの詳細指示</CardTitle>
              <CardDescription>
                AIがこの分析を実行する際の具体的な指示や注意点を記述してください。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.customInstructions}
                onChange={(e) => setFormData(prev => ({ ...prev, customInstructions: e.target.value }))}
                placeholder="例: この手法では、まず前処理として正規化を行い、次に反復計算を実行してください。収束条件は誤差が0.001以下になることです。結果は必ず統計的有意性を検証してください。"
                rows={4}
              />
            </CardContent>
          </Card>

          {/* 注意事項 */}
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-semibold text-amber-800">注意事項</h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• カスタム手法は既存の手法と組み合わせて使用できます</li>
                    <li>• 詳細な情報を提供するほど、AIの分析精度が向上します</li>
                    <li>• 数学的に複雑な手法の場合は、計算式の詳細も記述してください</li>
                    <li>• 作成した手法は現在のセッション中のみ有効です</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ボタン */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              キャンセル
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              カスタム手法を追加
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CustomMethodDialog

