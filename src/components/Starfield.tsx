import { useEffect, useRef } from 'react'

// A three-layer parallax starfield on a single 2D canvas.
// Stars are stored in normalised coordinates so resizing (e.g. a mobile URL bar
// collapsing) never reshuffles the sky.

interface Star {
  x: number
  y: number
  size: number
  alpha: number
  twinkleSpeed: number
  phase: number
  layer: number
  tint: number
}

interface ShootingStar {
  x: number
  y: number
  vx: number
  vy: number
  born: number
  life: number
}

const LAYERS = [
  { share: 0.64, scroll: 0.025, pointer: 5, size: [0.5, 1.1] },
  { share: 0.28, scroll: 0.07, pointer: 12, size: [0.9, 1.8] },
  { share: 0.08, scroll: 0.14, pointer: 22, size: [1.5, 2.8] },
] as const

// Mostly neutral starlight, with a few blue-white and warm stars.
const TINTS = ['255,255,255', '208,222,255', '255,232,208', '255,246,236']
const TINT_WEIGHTS = [0.52, 0.2, 0.12, 0.16]

const SPRITE_SIZE = 64

function pickTint() {
  let r = Math.random()
  for (let i = 0; i < TINT_WEIGHTS.length; i++) {
    r -= TINT_WEIGHTS[i]
    if (r <= 0) return i
  }
  return 0
}

function makeSprite(rgb: string) {
  const c = document.createElement('canvas')
  c.width = c.height = SPRITE_SIZE
  const g = c.getContext('2d')!
  const half = SPRITE_SIZE / 2
  const grad = g.createRadialGradient(half, half, 0, half, half, half)
  grad.addColorStop(0, `rgba(${rgb},1)`)
  grad.addColorStop(0.1, `rgba(${rgb},0.95)`)
  grad.addColorStop(0.22, `rgba(${rgb},0.32)`)
  grad.addColorStop(0.5, `rgba(${rgb},0.06)`)
  grad.addColorStop(1, `rgba(${rgb},0)`)
  g.fillStyle = grad
  g.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE)
  return c
}

function createStars(count: number): Star[] {
  const stars: Star[] = []
  LAYERS.forEach((layer, layerIndex) => {
    const n = Math.round(count * layer.share)
    for (let i = 0; i < n; i++) {
      const [min, max] = layer.size
      stars.push({
        x: Math.random(),
        y: Math.random(),
        size: min + Math.random() ** 2 * (max - min),
        alpha: 0.25 + Math.random() * 0.65,
        twinkleSpeed: 0.4 + Math.random() * 1.6,
        phase: Math.random() * Math.PI * 2,
        layer: layerIndex,
        tint: pickTint(),
      })
    }
  })
  return stars
}

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const sprites = TINTS.map(makeSprite)

    let width = 0
    let height = 0
    let stars: Star[] = []
    let starArea = 0
    let raf = 0
    let running = false

    // Pointer parallax, smoothed toward its target every frame.
    let targetX = 0
    let targetY = 0
    let pointerX = 0
    let pointerY = 0

    let shooting: ShootingStar | null = null
    let nextShot = performance.now() + 3500 + Math.random() * 5000

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas!.width = Math.round(width * dpr)
      canvas!.height = Math.round(height * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Regenerate only when the area changes a lot (rotation, big resize).
      const area = width * height
      if (!stars.length || Math.abs(area - starArea) / starArea > 0.35) {
        starArea = area
        stars = createStars(Math.min(1100, Math.round(area / 1400)))
      }
      if (!running) draw(performance.now())
    }

    function spawnShootingStar(now: number) {
      const angle = (200 + Math.random() * 25) * (Math.PI / 180)
      const speed = 900 + Math.random() * 500
      shooting = {
        x: width * (0.35 + Math.random() * 0.7),
        y: height * Math.random() * 0.45,
        vx: Math.cos(angle) * speed,
        vy: -Math.sin(angle) * speed,
        born: now,
        life: 850 + Math.random() * 400,
      }
      nextShot = now + 6000 + Math.random() * 9000
    }

    function draw(now: number) {
      ctx!.clearRect(0, 0, width, height)
      // No scroll parallax under reduced motion: the sky stays put.
      const scrollY = reduce ? 0 : window.scrollY

      pointerX += (targetX - pointerX) * 0.05
      pointerY += (targetY - pointerY) * 0.05

      for (const s of stars) {
        const layer = LAYERS[s.layer]
        let y = s.y * height - scrollY * layer.scroll
        y = ((y % height) + height) % height
        const x = s.x * width + pointerX * layer.pointer
        const yy = y + pointerY * layer.pointer

        const twinkle = reduce ? 1 : 0.72 + 0.28 * Math.sin(now * 0.001 * s.twinkleSpeed + s.phase)
        const d = s.size * 5
        ctx!.globalAlpha = s.alpha * twinkle
        ctx!.drawImage(sprites[s.tint], x - d / 2, yy - d / 2, d, d)
      }

      if (!reduce) {
        if (!shooting && now > nextShot) spawnShootingStar(now)
        if (shooting) {
          const t = (now - shooting.born) / shooting.life
          if (t >= 1) {
            shooting = null
          } else {
            const secs = (now - shooting.born) / 1000
            const hx = shooting.x + shooting.vx * secs
            const hy = shooting.y + shooting.vy * secs
            const len = 170
            const speed = Math.hypot(shooting.vx, shooting.vy)
            const tx = hx - (shooting.vx / speed) * len
            const ty = hy - (shooting.vy / speed) * len
            const grad = ctx!.createLinearGradient(hx, hy, tx, ty)
            const a = Math.sin(Math.PI * t) * 0.8
            grad.addColorStop(0, `rgba(255,244,228,${a})`)
            grad.addColorStop(1, 'rgba(255,244,228,0)')
            ctx!.globalAlpha = 1
            ctx!.strokeStyle = grad
            ctx!.lineWidth = 1.2
            ctx!.lineCap = 'round'
            ctx!.beginPath()
            ctx!.moveTo(hx, hy)
            ctx!.lineTo(tx, ty)
            ctx!.stroke()
          }
        }
      }
      ctx!.globalAlpha = 1
    }

    function loop(now: number) {
      draw(now)
      raf = requestAnimationFrame(loop)
    }

    function start() {
      if (running || reduce) return
      running = true
      raf = requestAnimationFrame(loop)
    }

    function stop() {
      running = false
      cancelAnimationFrame(raf)
    }

    const onPointer = (e: PointerEvent) => {
      targetX = (e.clientX / width - 0.5) * 2
      targetY = (e.clientY / height - 0.5) * 2
    }
    const onVisibility = () => (document.hidden ? stop() : start())

    resize()
    start()
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)
    if (!reduce) window.addEventListener('pointermove', onPointer, { passive: true })

    return () => {
      stop()
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [])

  return <canvas ref={canvasRef} className="starfield" aria-hidden="true" />
}
