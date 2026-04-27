import { useEffect, useRef } from 'react'

type ParticleCloudCanvasProps = {
  cloudTime?: number
  coalesceTime?: number
  holdTime?: number
  disperseTime?: number
  pulseRate?: number
  pulseAmount?: number
  pulseSharpness?: number
  pulseRectDamping?: number
  speed?: number
  distance?: number
  rotation?: number
  wobble?: number
  spread?: number
  tightness?: number
  rectWidth?: number
  rectHeight?: number
  count?: number
  size?: number
  darkness?: number
  bgColor?: string
  particleColor?: string
  className?: string
}

type ParticleCloudParams = Required<Omit<ParticleCloudCanvasProps, 'className'>>

type Particle = {
  cloudX: number
  cloudY: number
  cloudZ: number
  targetX: number
  targetY: number
  targetZ: number
  phase: number
  freq: number
  toneVar: number
  driftPhase: number
  driftFreq: number
  sizeVar: number
}

type ProjectedParticle = {
  sx: number
  sy: number
  scale: number
  z: number
  toneVar: number
  sizeVar: number
}

const defaultParams: ParticleCloudParams = {
  cloudTime: 2200,
  coalesceTime: 1700,
  holdTime: 2000,
  disperseTime: 700,
  pulseRate: 1.2,
  pulseAmount: 0.18,
  pulseSharpness: 0.4,
  pulseRectDamping: 0.5,
  speed: 1.2,
  distance: 1.3,
  rotation: 0.5,
  wobble: 0.7,
  spread: 150,
  tightness: 0.78,
  rectWidth: 0.32,
  rectHeight: 0.85,
  count: 900,
  size: 1.8,
  darkness: 0.16,
  bgColor: '#F7F4EE',
  particleColor: '#EFEAE1',
}

function makeParticle(): Particle {
  const u = Math.random()
  const v = Math.random()
  const theta = 2 * Math.PI * u
  const phi = Math.acos(2 * v - 1)
  const r = Math.cbrt(Math.random())

  return {
    cloudX: r * Math.sin(phi) * Math.cos(theta),
    cloudY: r * Math.sin(phi) * Math.sin(theta),
    cloudZ: r * Math.cos(phi),
    targetX: Math.random() - 0.5,
    targetY: Math.random() - 0.5,
    targetZ: Math.random() - 0.5,
    phase: Math.random() * Math.PI * 2,
    freq: 0.4 + Math.random() * 0.7,
    toneVar: (Math.random() - 0.5) * 0.5,
    driftPhase: Math.random() * Math.PI * 2,
    driftFreq: 0.7 + Math.random() * 0.6,
    sizeVar: 0.7 + Math.random() * 0.5,
  }
}

function hexToRgb(hex: string) {
  const h = hex.replace('#', '')
  return [
    Number.parseInt(h.slice(0, 2), 16),
    Number.parseInt(h.slice(2, 4), 16),
    Number.parseInt(h.slice(4, 6), 16),
  ] as const
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function pulse(phase: number, sharpness: number) {
  const soft = Math.sin(phase * Math.PI * 2 - Math.PI / 2) * 0.5 + 0.5
  const sharp = Math.exp(-Math.pow((phase - 0.12) / 0.09, 2))
  return soft * (1 - sharpness) + sharp * sharpness
}

export function ParticleCloudCanvas({
  cloudTime = defaultParams.cloudTime,
  coalesceTime = defaultParams.coalesceTime,
  holdTime = defaultParams.holdTime,
  disperseTime = defaultParams.disperseTime,
  pulseRate = defaultParams.pulseRate,
  pulseAmount = defaultParams.pulseAmount,
  pulseSharpness = defaultParams.pulseSharpness,
  pulseRectDamping = defaultParams.pulseRectDamping,
  speed = defaultParams.speed,
  distance = defaultParams.distance,
  rotation = defaultParams.rotation,
  wobble = defaultParams.wobble,
  spread = defaultParams.spread,
  tightness = defaultParams.tightness,
  rectWidth = defaultParams.rectWidth,
  rectHeight = defaultParams.rectHeight,
  count = defaultParams.count,
  size = defaultParams.size,
  darkness = defaultParams.darkness,
  bgColor = defaultParams.bgColor,
  particleColor = defaultParams.particleColor,
  className,
}: ParticleCloudCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const startTimeRef = useRef(performance.now())
  const rotYRef = useRef(0)
  const paramsRef = useRef<ParticleCloudParams>(defaultParams)

  paramsRef.current = {
    cloudTime,
    coalesceTime,
    holdTime,
    disperseTime,
    pulseRate,
    pulseAmount,
    pulseSharpness,
    pulseRectDamping,
    speed,
    distance,
    rotation,
    wobble,
    spread,
    tightness,
    rectWidth,
    rectHeight,
    count,
    size,
    darkness,
    bgColor,
    particleColor,
  }

  useEffect(() => {
    particlesRef.current = Array.from({ length: count }, makeParticle)
  }, [count])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')

    if (!canvas || !ctx) {
      return undefined
    }

    const drawingCanvas = canvas
    const drawingContext = ctx
    let width = 0
    let height = 0

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = drawingCanvas.getBoundingClientRect()

      if (rect.width === 0 || rect.height === 0) {
        return
      }

      drawingCanvas.width = rect.width * dpr
      drawingCanvas.height = rect.height * dpr
      drawingContext.setTransform(1, 0, 0, 1, 0, 0)
      drawingContext.scale(dpr, dpr)
      width = rect.width
      height = rect.height
    }

    resize()

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(drawingCanvas)

    function animate() {
      const p = paramsRef.current
      const now = performance.now()

      let elapsed = now - startTimeRef.current
      const cloudEnd = p.cloudTime
      const coalesceEnd = cloudEnd + p.coalesceTime
      const holdEnd = coalesceEnd + p.holdTime
      const cycleEnd = holdEnd + p.disperseTime

      if (elapsed >= cycleEnd) {
        startTimeRef.current = now
        elapsed = 0
      }

      let blend: number
      if (elapsed < cloudEnd) {
        blend = 0
      } else if (elapsed < coalesceEnd) {
        blend = easeInOutCubic((elapsed - cloudEnd) / p.coalesceTime)
      } else if (elapsed < holdEnd) {
        blend = 1
      } else {
        blend = 1 - easeInOutCubic((elapsed - holdEnd) / p.disperseTime)
      }

      const pulsePeriod = 1000 / p.pulseRate
      const pulsePhase = (elapsed % pulsePeriod) / pulsePeriod
      const pulseEnvelope = pulse(pulsePhase, p.pulseSharpness)
      const pulseDamping = 1 - blend * p.pulseRectDamping
      const pulseScale = 1 + pulseEnvelope * p.pulseAmount * pulseDamping

      drawingContext.fillStyle = p.bgColor
      drawingContext.fillRect(0, 0, width, height)

      rotYRef.current += p.rotation * 0.0008

      const effectiveRotY = rotYRef.current * (1 - blend)
      const effectiveTiltX = 0.18 * (1 - blend)
      const cosY = Math.cos(effectiveRotY)
      const sinY = Math.sin(effectiveRotY)
      const cosX = Math.cos(effectiveTiltX)
      const sinX = Math.sin(effectiveTiltX)

      const time = now * 0.001
      const wobbleScale = p.wobble * 5.5
      const looseFactor = (1 - p.tightness) * 0.55
      const driftFreqX = 1.5 * p.speed
      const driftFreqY = 1.8 * p.speed
      const driftFreqZ = 1.2 * p.speed
      const driftAmplX = 30 * p.distance
      const driftAmplY = 22 * p.distance
      const driftAmplZ = 30 * p.distance
      const boxW = height * p.rectWidth
      const boxH = height * p.rectHeight
      const boxD = 50
      const lightRgb = hexToRgb(p.particleColor)
      const darkRgb = [
        Math.floor(lightRgb[0] * 0.18),
        Math.floor(lightRgb[1] * 0.18),
        Math.floor(lightRgb[2] * 0.18),
      ] as const
      const particles = particlesRef.current
      const projected: ProjectedParticle[] = new Array(particles.length)

      for (let i = 0; i < particles.length; i += 1) {
        const part = particles[i]
        const driftX =
          Math.sin(time * driftFreqX * part.driftFreq + part.driftPhase) * driftAmplX
        const driftY =
          Math.cos(time * driftFreqY * part.driftFreq + part.driftPhase) * driftAmplY
        const driftZ =
          Math.sin(time * driftFreqZ * part.driftFreq + part.driftPhase * 1.3) *
          driftAmplZ
        const cloudX = part.cloudX * p.spread + driftX
        const cloudY = part.cloudY * p.spread + driftY
        const cloudZ = part.cloudZ * p.spread + driftZ
        const wobbleX = Math.sin(time * part.freq + part.phase) * wobbleScale
        const wobbleY = Math.cos(time * part.freq * 1.2 + part.phase) * wobbleScale
        const wobbleZ = Math.sin(time * part.freq * 0.8 + part.phase + 1) * wobbleScale
        const targetX = part.targetX * boxW * p.tightness + part.cloudX * p.spread * looseFactor + wobbleX
        const targetY = part.targetY * boxH * p.tightness + part.cloudY * p.spread * looseFactor + wobbleY
        const targetZ = part.targetZ * boxD * p.tightness + part.cloudZ * p.spread * looseFactor + wobbleZ
        let x = cloudX * (1 - blend) + targetX * blend
        let y = cloudY * (1 - blend) + targetY * blend
        let z = cloudZ * (1 - blend) + targetZ * blend

        x *= pulseScale
        y *= pulseScale
        z *= pulseScale

        const rotatedX = x * cosY - z * sinY
        const rotatedZ = x * sinY + z * cosY
        const tiltedY = y * cosX - rotatedZ * sinX
        const tiltedZ = y * sinX + rotatedZ * cosX
        const focalLength = 700
        const cameraZ = 380
        const denominator = focalLength + tiltedZ + cameraZ
        const scale = focalLength / Math.max(50, denominator)

        projected[i] = {
          sx: rotatedX * scale + width / 2,
          sy: tiltedY * scale + height / 2,
          scale,
          z: tiltedZ,
          toneVar: part.toneVar,
          sizeVar: part.sizeVar,
        }
      }

      projected.sort((a, b) => b.z - a.z)

      const beatBrightness = pulseEnvelope * 0.25 * pulseDamping

      for (let i = 0; i < projected.length; i += 1) {
        const part = projected[i]
        const tone = Math.max(
          0,
          Math.min(1, p.darkness + part.toneVar * p.darkness * 0.6 - beatBrightness * p.darkness),
        )
        const r = (lightRgb[0] + (darkRgb[0] - lightRgb[0]) * tone) | 0
        const g = (lightRgb[1] + (darkRgb[1] - lightRgb[1]) * tone) | 0
        const b = (lightRgb[2] + (darkRgb[2] - lightRgb[2]) * tone) | 0
        const particleSize = Math.max(
          0.5,
          p.size * part.sizeVar * (0.55 + part.scale * 0.55),
        )

        drawingContext.fillStyle = `rgb(${r},${g},${b})`
        drawingContext.fillRect(
          part.sx - particleSize / 2,
          part.sy - particleSize / 2,
          particleSize,
          particleSize,
        )
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
      }

      resizeObserver.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className={className} />
}
