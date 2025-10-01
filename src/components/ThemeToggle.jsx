/**
 * Theme Toggle Component
 * ダークモード/ライトモードの切り替えボタンコンポーネント
 */

import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/useTheme'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className={className}
        >
          {theme === 'light' ? (
            <Moon className="h-4 w-4 transition-all" />
          ) : (
            <Sun className="h-4 w-4 transition-all" />
          )}
          <span className="sr-only">テーマを切り替え</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{theme === 'light' ? 'ダークモードに切り替え' : 'ライトモードに切り替え'}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export default ThemeToggle

