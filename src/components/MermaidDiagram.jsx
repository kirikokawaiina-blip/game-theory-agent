/**
 * Mermaid Diagram Component
 * Mermaidライブラリを使用した図解表示コンポーネント
 */

import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Eye, EyeOff } from 'lucide-react'

// Mermaidの初期化
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'Noto Sans, Arial, sans-serif',
  fontSize: 14,
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: 'basis'
  },
  gantt: {
    useMaxWidth: true,
    fontSize: 12
  },
  sequence: {
    useMaxWidth: true,
    fontSize: 12
  }
})

export function MermaidDiagram({ 
  diagram, 
  title = "図解", 
  className = "",
  showSource = false,
  onExport = null 
}) {
  const diagramRef = useRef(null)
  const [isRendered, setIsRendered] = useState(false)
  const [error, setError] = useState(null)
  const [showSourceCode, setShowSourceCode] = useState(showSource)
  const [diagramId] = useState(`mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)

  useEffect(() => {
    if (!diagram || !diagramRef.current) return

    const renderDiagram = async () => {
      try {
        setError(null)
        setIsRendered(false)

        // 既存の図を削除
        if (diagramRef.current) {
          diagramRef.current.innerHTML = ''
        }

        // Mermaidで図を描画
        const { svg } = await mermaid.render(diagramId, diagram)
        
        if (diagramRef.current) {
          diagramRef.current.innerHTML = svg
          setIsRendered(true)
        }
      } catch (err) {
        console.error('Mermaid rendering error:', err)
        setError(err.message)
        setIsRendered(false)
      }
    }

    renderDiagram()
  }, [diagram, diagramId])

  const handleExport = async (format = 'png') => {
    if (!isRendered || !diagramRef.current) return

    try {
      const svgElement = diagramRef.current.querySelector('svg')
      if (!svgElement) return

      if (format === 'svg') {
        // SVGとしてダウンロード
        const svgData = new XMLSerializer().serializeToString(svgElement)
        const blob = new Blob([svgData], { type: 'image/svg+xml' })
        const url = URL.createObjectURL(blob)
        
        const link = document.createElement('a')
        link.href = url
        link.download = `${title.replace(/\s+/g, '_')}.svg`
        link.click()
        
        URL.revokeObjectURL(url)
      } else {
        // PNGとしてダウンロード
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        
        const svgData = new XMLSerializer().serializeToString(svgElement)
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
        const url = URL.createObjectURL(svgBlob)
        
        img.onload = () => {
          canvas.width = img.width * 2 // 高解像度
          canvas.height = img.height * 2
          ctx.scale(2, 2)
          ctx.drawImage(img, 0, 0)
          
          canvas.toBlob((blob) => {
            const pngUrl = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = pngUrl
            link.download = `${title.replace(/\s+/g, '_')}.png`
            link.click()
            
            URL.revokeObjectURL(pngUrl)
            URL.revokeObjectURL(url)
          }, 'image/png')
        }
        
        img.src = url
      }

      if (onExport) {
        onExport(format)
      }
    } catch (err) {
      console.error('Export error:', err)
    }
  }

  if (!diagram) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            図解データがありません
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSourceCode(!showSourceCode)}
            >
              {showSourceCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showSourceCode ? 'ソース非表示' : 'ソース表示'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('png')}
              disabled={!isRendered}
            >
              <Download className="h-4 w-4 mr-2" />
              PNG
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('svg')}
              disabled={!isRendered}
            >
              <Download className="h-4 w-4 mr-2" />
              SVG
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-4 border border-red-200 bg-red-50 rounded-lg">
            <p className="text-sm text-red-800">
              図解の描画中にエラーが発生しました: {error}
            </p>
          </div>
        )}
        
        {showSourceCode && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2">Mermaidソースコード:</h4>
            <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-40">
              {diagram}
            </pre>
          </div>
        )}
        
        <div 
          ref={diagramRef}
          className="mermaid-container overflow-auto"
          style={{ 
            minHeight: '200px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {!isRendered && !error && (
            <div className="text-center py-8 text-muted-foreground">
              図解を描画中...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default MermaidDiagram

