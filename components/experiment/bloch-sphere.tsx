"use client"

import { Card } from "@/components/ui/card"
import { useEffect, useRef } from "react"

interface BlochSphereProps {
  state: { x: number; y: number; z: number }
  label?: string
}

export function BlochSphere({ state, label }: BlochSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = 80

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw sphere outline
    ctx.strokeStyle = "rgba(100, 116, 139, 0.3)"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.stroke()

    // Draw equator
    ctx.strokeStyle = "rgba(100, 116, 139, 0.2)"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.ellipse(centerX, centerY, radius, radius * 0.3, 0, 0, 2 * Math.PI)
    ctx.stroke()

    // Draw axes
    ctx.strokeStyle = "rgba(100, 116, 139, 0.4)"
    ctx.lineWidth = 1

    // X axis
    ctx.beginPath()
    ctx.moveTo(centerX - radius - 10, centerY)
    ctx.lineTo(centerX + radius + 10, centerY)
    ctx.stroke()
    ctx.fillStyle = "rgba(100, 116, 139, 0.8)"
    ctx.font = "12px monospace"
    ctx.fillText("X", centerX + radius + 15, centerY + 5)

    // Y axis
    ctx.beginPath()
    ctx.moveTo(centerX, centerY - radius - 10)
    ctx.lineTo(centerX, centerY + radius + 10)
    ctx.stroke()
    ctx.fillText("Y", centerX + 5, centerY - radius - 15)

    // Z axis (perspective)
    ctx.beginPath()
    ctx.moveTo(centerX - radius * 0.3, centerY + radius * 0.3)
    ctx.lineTo(centerX + radius * 0.3, centerY - radius * 0.3)
    ctx.stroke()
    ctx.fillText("Z", centerX + radius * 0.3 + 10, centerY - radius * 0.3)

    // Draw state vector
    const x = state.x * radius
    const y = -state.z * radius // Z maps to Y on screen (vertical)
    const z = state.y * radius * 0.3 // Y maps to depth (perspective)

    ctx.strokeStyle = "#06b6d4"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(centerX + x, centerY + y)
    ctx.stroke()

    // Draw state point
    ctx.fillStyle = "#06b6d4"
    ctx.beginPath()
    ctx.arc(centerX + x, centerY + y, 6, 0, 2 * Math.PI)
    ctx.fill()

    // Draw projection on equator
    ctx.strokeStyle = "rgba(6, 182, 212, 0.3)"
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(centerX + x, centerY + y)
    ctx.lineTo(centerX + x, centerY)
    ctx.stroke()
    ctx.setLineDash([])
  }, [state])

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{label || "Bloch Sphere"}</h3>
        <p className="text-sm text-muted-foreground font-mono">
          |ψ⟩ = ({state.x.toFixed(3)}, {state.y.toFixed(3)}, {state.z.toFixed(3)})
        </p>
      </div>
      <div className="flex justify-center">
        <canvas ref={canvasRef} width={300} height={300} />
      </div>
    </Card>
  )
}
