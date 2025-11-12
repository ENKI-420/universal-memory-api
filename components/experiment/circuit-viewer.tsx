"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface CircuitGate {
  type: string
  qubit: number
  params?: number[]
  control?: number
}

interface CircuitViewerProps {
  gates: CircuitGate[]
  numQubits: number
  depth: number
}

export function CircuitViewer({ gates, numQubits, depth }: CircuitViewerProps) {
  const gateWidth = 60
  const gateHeight = 40
  const qubitSpacing = 80
  const leftPadding = 60
  const topPadding = 40

  const width = leftPadding + depth * (gateWidth + 20) + 40
  const height = topPadding + numQubits * qubitSpacing + 40

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Quantum Circuit</h3>
        <div className="flex gap-2">
          <Badge variant="outline">{numQubits} Qubits</Badge>
          <Badge variant="outline">Depth: {depth}</Badge>
        </div>
      </div>
      <div className="overflow-x-auto">
        <svg width={width} height={height} className="border border-border rounded-lg bg-background">
          {/* Qubit lines */}
          {Array.from({ length: numQubits }).map((_, i) => (
            <g key={`qubit-${i}`}>
              <text x={20} y={topPadding + i * qubitSpacing + 5} className="fill-foreground text-sm font-mono">
                q{i}
              </text>
              <line
                x1={leftPadding}
                y1={topPadding + i * qubitSpacing}
                x2={width - 20}
                y2={topPadding + i * qubitSpacing}
                className="stroke-border"
                strokeWidth={2}
              />
            </g>
          ))}

          {/* Gates */}
          {gates.map((gate, idx) => {
            const x = leftPadding + (idx % depth) * (gateWidth + 20)
            const y = topPadding + gate.qubit * qubitSpacing

            if (gate.type === "cx" && gate.control !== undefined) {
              // Controlled gate
              const controlY = topPadding + gate.control * qubitSpacing
              return (
                <g key={`gate-${idx}`}>
                  <line
                    x1={x + gateWidth / 2}
                    y1={controlY}
                    x2={x + gateWidth / 2}
                    y2={y}
                    className="stroke-cyan-500"
                    strokeWidth={2}
                  />
                  <circle cx={x + gateWidth / 2} cy={controlY} r={6} className="fill-cyan-500" />
                  <circle cx={x + gateWidth / 2} cy={y} r={16} className="fill-none stroke-cyan-500" strokeWidth={2} />
                  <line
                    x1={x + gateWidth / 2 - 12}
                    y1={y}
                    x2={x + gateWidth / 2 + 12}
                    y2={y}
                    className="stroke-cyan-500"
                    strokeWidth={2}
                  />
                  <line
                    x1={x + gateWidth / 2}
                    y1={y - 12}
                    x2={x + gateWidth / 2}
                    y2={y + 12}
                    className="stroke-cyan-500"
                    strokeWidth={2}
                  />
                </g>
              )
            }

            // Single qubit gate
            const color = gate.type === "h" ? "purple" : gate.type.startsWith("r") ? "cyan" : "blue"
            return (
              <g key={`gate-${idx}`}>
                <rect
                  x={x}
                  y={y - gateHeight / 2}
                  width={gateWidth}
                  height={gateHeight}
                  className={`fill-${color}-500/20 stroke-${color}-500`}
                  strokeWidth={2}
                  rx={4}
                />
                <text
                  x={x + gateWidth / 2}
                  y={y + 5}
                  className={`fill-${color}-500 text-sm font-mono font-bold`}
                  textAnchor="middle"
                >
                  {gate.type.toUpperCase()}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </Card>
  )
}
