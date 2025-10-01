import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MermaidDiagram } from './MermaidDiagram';
import { AnalysisChart } from './AnalysisChart';
import { PayoffMatrix } from './PayoffMatrix';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export function VisualizationTab({ analysisResults }) {
  if (!analysisResults || !analysisResults.visualizationData) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            可視化データがありません。分析を実行してください。
          </p>
        </CardContent>
      </Card>
    );
  }

  const { mermaidDiagram, charts, tables } = analysisResults.visualizationData;

  const hasVisualizations = mermaidDiagram || (charts && charts.length > 0) || (tables && tables.length > 0);

  return (
    <div className="space-y-6">
      {!hasVisualizations && (
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>可視化データなし</AlertTitle>
          <AlertDescription>
            この分析結果には、可視化できるダイアグラム、チャート、またはテーブルが含まれていません。
          </AlertDescription>
        </Alert>
      )}

      {mermaidDiagram && (
        <MermaidDiagram
          diagram={mermaidDiagram}
          title="プロセルフロー図"
        />
      )}

      {charts && charts.length > 0 && charts.map((chart, index) => (
        <AnalysisChart
          key={index}
          type={chart.type}
          data={chart.data}
          title={chart.title}
          xKey={chart.axes.x}
          yKey={chart.axes.y}
        />
      ))}

      {tables && tables.map((table, index) => {
        // This is a simple heuristic to check if the table is a payoff matrix
        if (table.headers && table.rows && table.headers.length > 2) {
            const player1Strategies = table.rows.map(r => r[0]);
            const player2Strategies = table.headers.slice(1);
            const matrix = table.rows.map(row => row.slice(1).map(cell => {
                try {
                    // Try to parse payoffs like "(1, 2)"
                    return JSON.parse(`[${cell.replace('(', '').replace(')', '')}]`);
                } catch (e) {
                    return cell;
                }
            }));

            return (
                <PayoffMatrix
                    key={index}
                    title={table.title || '利得行列'}
                    matrix={matrix}
                    player1Strategies={player1Strategies}
                    player2Strategies={player2Strategies}
                />
            );
        }
        // Render a generic table if it's not a payoff matrix
        return (
            <Card key={index}>
                <CardHeader>
                    <CardTitle>{table.title || `テーブル ${index + 1}`}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {table.headers && table.headers.map((header, i) => (
                                        <th key={i} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {table.rows && table.rows.map((row, i) => (
                                    <tr key={i}>
                                        {row.map((cell, j) => (
                                            <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        )
      })}
    </div>
  );
}

export default VisualizationTab;