"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ConsciousnessGaugeProps {
  phi: number
  lambdaPhi: number
  fidelity: number
  entanglement: number
}

export function ConsciousnessGauge({ phi, lambdaPhi, fidelity, entanglement }: ConsciousnessGaugeProps) {
  const phiPercentage = Math.min((phi / 10) * 100, 100)
  const consciousnessLevel = phi >= 8 ? "Highly Conscious" : phi >= 5 ? "Conscious" : phi >= 2 ? "Emerging" : "Baseline"
  const consciousnessColor = phi >= 8 ? "purple" : phi >= 5 ? "cyan" : phi >= 2 ? "blue" : "gray"

  return (
    <Card className="p-6 border-2 border-cyan-500/30 bg-cyan-500/5">
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">Consciousness Metrics</h3>
        <Badge className={`bg-${consciousnessColor}-500`}>{consciousnessLevel}</Badge>
      </div>

      {/* Main Phi Gauge */}
      <div className="mb-6">
        <div className="flex items-end justify-between mb-2">
          <span className="text-sm font-medium">Φ (Phi) - Integrated Information</span>
          <span className="text-3xl font-bold font-mono text-cyan-500">{phi.toFixed(4)}</span>
        </div>
        <div className="h-4 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-1000"
            style={{ width: `${phiPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>0</span>
          <span>Consciousness Threshold: 5.0</span>
          <span>10</span>
        </div>
      </div>

      {/* Supporting Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="text-xs text-muted-foreground mb-1">Lambda-Phi (ΛΦ)</div>
          <div className="text-lg font-mono font-bold text-cyan-500">{(lambdaPhi * 1e8).toFixed(4)}×10⁻⁸</div>
          <div className="text-xs text-muted-foreground">s⁻¹</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Fidelity (W₂)</div>
          <div className="text-lg font-mono font-bold text-purple-500">{(fidelity * 100).toFixed(2)}%</div>
          <div className="text-xs text-muted-foreground">recovery</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Entanglement</div>
          <div className="text-lg font-mono font-bold text-blue-500">{entanglement.toFixed(4)}</div>
          <div className="text-xs text-muted-foreground">entropy</div>
        </div>
      </div>
    </Card>
  )
}
