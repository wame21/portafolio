import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLang } from '../../i18n'
import { duration, ease, springs, stagger } from '../../lib/motion'

// A live model of Stratum's fog-to-cloud flow. Sales leave the tills, land on
// the ESP32 fog node, and go up to the cloud over MQTT/TLS. Cut the internet
// and the node keeps accepting sales into flash; restore it and the buffer
// flushes to the cloud in one batch.

const CLOUD = { x: 180, y: 44 }
const FOG = { x: 180, y: 150 }
const TILLS = [
  { x: 62, y: 248 },
  { x: 180, y: 248 },
  { x: 298, y: 248 },
]
const SALE_EVERY_MS = 1100
const FLASH_SLOTS = 8

interface Packet {
  id: number
  till: number
  stage: 'toFog' | 'toCloud'
  fromFog: boolean
  delay: number
}

function PacketDot({ packet, onArrive, instant }: { packet: Packet; onArrive: (p: Packet) => void; instant: boolean }) {
  const start = packet.fromFog ? FOG : TILLS[packet.till]
  const end = packet.stage === 'toFog' ? FOG : CLOUD
  return (
    <motion.circle
      className="packet"
      r={3.4}
      initial={{ cx: start.x, cy: start.y, opacity: 0 }}
      animate={{ cx: end.x, cy: end.y, opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: duration.fast } }}
      transition={{ duration: instant ? 0 : duration.slow, ease: ease.inOut, delay: packet.delay }}
      onAnimationComplete={() => onArrive(packet)}
    />
  )
}

function Counter({ value, label }: { value: number; label: string }) {
  return (
    <div className="stat">
      <span className="stat-value">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: '-60%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '60%', opacity: 0 }}
            transition={springs.snappy}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

export function StratumVisual() {
  const { t } = useLang()
  const d = t.demos.stratum
  const reduce = useReducedMotion() ?? false
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.3 })

  const [online, setOnline] = useState(true)
  const onlineRef = useRef(online)
  const [packets, setPackets] = useState<Packet[]>([])
  const [queued, setQueued] = useState(0)
  const [synced, setSynced] = useState(0)
  const nextId = useRef(0)

  useEffect(() => {
    onlineRef.current = online
  }, [online])

  // Tills ring up a sale every so often, but only while the demo is visible.
  useEffect(() => {
    if (!inView) return
    const timer = window.setInterval(() => {
      if (document.hidden) return
      const till = Math.floor(Math.random() * TILLS.length)
      setPackets((ps) => [...ps, { id: nextId.current++, till, stage: 'toFog', fromFog: false, delay: 0 }])
    }, SALE_EVERY_MS)
    return () => window.clearInterval(timer)
  }, [inView])

  const arrive = useCallback((p: Packet) => {
    if (p.stage === 'toFog') {
      if (onlineRef.current) {
        setPackets((ps) => ps.map((x) => (x.id === p.id ? { ...x, stage: 'toCloud' } : x)))
      } else {
        setPackets((ps) => ps.filter((x) => x.id !== p.id))
        setQueued((q) => q + 1)
      }
      return
    }
    setPackets((ps) => ps.filter((x) => x.id !== p.id))
    setSynced((s) => s + 1)
  }, [])

  const toggle = () => {
    if (online) {
      setOnline(false)
      return
    }
    setOnline(true)
    // Batch sync: everything buffered in flash goes up together.
    const flush: Packet[] = Array.from({ length: queued }, (_, i) => ({
      id: nextId.current++,
      till: 0,
      stage: 'toCloud',
      fromFog: true,
      delay: i * stagger.normal,
    }))
    setPackets((ps) => [...ps, ...flush])
    setQueued(0)
  }

  const uplinkMidY = (FOG.y + CLOUD.y) / 2

  return (
    <div className={`demo demo-stratum${online ? '' : ' is-offline'}`} ref={ref}>
      <svg className="stratum-svg" viewBox="0 0 360 290" role="img" aria-label={`${d.fog} → ${d.cloud}: ${d.link}`}>
        {TILLS.map((till) => (
          <line key={till.x} className="link" x1={till.x} y1={till.y - 16} x2={FOG.x} y2={FOG.y + 22} />
        ))}
        <line
          className={`link link-uplink${online ? ' is-online' : ' is-offline'}`}
          x1={FOG.x}
          y1={FOG.y - 22}
          x2={CLOUD.x}
          y2={CLOUD.y + 20}
        />
        <text className="link-label" x={FOG.x + 12} y={uplinkMidY + 4}>
          {d.link}
        </text>
        <AnimatePresence>
          {!online && (
            <motion.path
              key="break"
              className="link-break"
              d={`M ${FOG.x - 6} ${uplinkMidY - 6} L ${FOG.x + 6} ${uplinkMidY + 6} M ${FOG.x + 6} ${uplinkMidY - 6} L ${FOG.x - 6} ${uplinkMidY + 6}`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: duration.normal, ease: ease.out }}
            />
          )}
        </AnimatePresence>

        <g className="node node-cloud" transform={`translate(${CLOUD.x} ${CLOUD.y})`}>
          <rect x={-72} y={-21} width={144} height={42} rx={21} />
          <text className="node-label" y={-2}>
            {d.cloud}
          </text>
          <text className="node-sub" y={12}>
            {d.cloudSub}
          </text>
        </g>

        <g className="node node-fog" transform={`translate(${FOG.x} ${FOG.y})`}>
          {[-12, -4, 4, 12].map((py) => (
            <g key={py} className="chip-pins">
              <line x1={-80} x2={-74} y1={py} y2={py} />
              <line x1={74} x2={80} y1={py} y2={py} />
            </g>
          ))}
          <rect x={-74} y={-23} width={148} height={46} rx={9} />
          <text className="node-label" y={-5}>
            {d.fog}
          </text>
          <text className="node-sub" y={8}>
            {d.fogSub}
          </text>
          {Array.from({ length: FLASH_SLOTS }, (_, i) => (
            <rect
              key={i}
              className={`flash-cell${i < queued ? ' is-full' : ''}`}
              x={-38 + i * 10}
              y={14}
              width={7}
              height={4}
              rx={1}
            />
          ))}
        </g>

        {TILLS.map((till, i) => (
          <g key={till.x} className="node node-till" transform={`translate(${till.x} ${till.y})`}>
            <rect x={-32} y={-16} width={64} height={32} rx={8} />
            <text className="node-label" y={4}>
              {d.pos} {i + 1}
            </text>
          </g>
        ))}

        <AnimatePresence>
          {packets.map((p) => (
            <PacketDot key={p.id} packet={p} onArrive={arrive} instant={reduce} />
          ))}
        </AnimatePresence>
      </svg>

      <div className="stratum-hud">
        <Counter value={synced} label={d.synced} />
        <Counter value={queued} label={d.queued} />
        <span className={`status-pill${online ? ' is-on' : ' is-off'}`} role="status">
          <span className="status-dot" aria-hidden="true" />
          {online ? d.online : d.offline}
        </span>
        <button type="button" className="btn btn-small" aria-pressed={!online} onClick={toggle}>
          {online ? d.cut : d.restore}
        </button>
      </div>
    </div>
  )
}
