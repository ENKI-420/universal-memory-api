"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface MetricsChartProps {
  data: Array<{ label: string; value: number; color?: string }>
  title: string
  unit?: string
}

export function MetricsChart({ data, title, unit }: MetricsChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value))

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-4">
        {data.map((item, idx) => {
          const percentage = (item.value / maxValue) * 100
          const color = item.color || "cyan"

          return (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-mono">{item.label}</span>
                <Badge variant="outline" className="font-mono">
                  {item.value.toFixed(4)}
                  {unit && ` ${unit}`}
                </Badge>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full bg-${color}-500 transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
