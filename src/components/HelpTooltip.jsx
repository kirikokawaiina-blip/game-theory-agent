/**
 * Help Tooltip Component
 * ヘルプ情報を表示するツールチップコンポーネント
 */

import { HelpCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export function HelpTooltip({ content, children, side = "top" }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children || (
          <button className="inline-flex items-center justify-center w-4 h-4 text-muted-foreground hover:text-foreground transition-colors">
            <HelpCircle className="w-4 h-4" />
          </button>
        )}
      </TooltipTrigger>
      <TooltipContent side={side} className="max-w-xs">
        <p className="text-sm">{content}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export default HelpTooltip

