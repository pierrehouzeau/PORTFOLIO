import { useEffect } from 'react'

// Subtle cursor trail drawn on a fixed canvas (React side-effect component)
// Inspiration: GSAP forum — follow cursor with ease (rAF + interpolation)
// https://greensock.com/forums/topic/21475-follow-cursor-with-ease/
export default function CursorTrail(){
  useEffect(() => {
    if (typeof window === 'undefined') return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const noHover = window.matchMedia('(hover: none)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (prefersReduced || noHover || coarse) return

    const canvas = document.createElement('canvas')
    Object.assign(canvas.style, {
      position: 'fixed', inset: '0', pointerEvents: 'none', zIndex: 9998
    })
    document.body.appendChild(canvas)
    const ctx = canvas.getContext('2d')

    let dpr = 1, W = 0, H = 0
    const resize = () => {
      dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
      W = canvas.width = Math.floor(window.innerWidth * dpr)
      H = canvas.height = Math.floor(window.innerHeight * dpr)
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const points = [] // {x,y,t}
    const maxAge = 320 // ms
    const maxLen = 18
    const onMove = (e) => {
      const now = performance.now()
      points.push({ x: e.clientX, y: e.clientY, t: now })
      if (points.length > maxLen) points.shift()
    }
    document.addEventListener('pointermove', onMove, { passive: true })

    let raf
    const draw = () => {
      const now = performance.now()
      while (points.length && now - points[0].t > maxAge) points.shift()
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      if (points.length < 2) return

      const head = points[points.length - 1]
      const tail = points[0]
      const g = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y)
      g.addColorStop(0, 'rgba(96,165,250,0.12)')   // #60a5fa
      g.addColorStop(0.5, 'rgba(167,139,250,0.10)') // #a78bfa
      g.addColorStop(1, 'rgba(52,211,153,0.10)')   // #34d399

      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.lineWidth = 4
      ctx.strokeStyle = g
      ctx.beginPath()
      for (let i = 0; i < points.length; i++) {
        const p = points[i]
        if (i === 0) ctx.moveTo(p.x, p.y)
        else ctx.lineTo(p.x, p.y)
      }
      ctx.stroke()
      ctx.restore()
    }

    const loop = () => { draw(); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('pointermove', onMove)
      canvas.remove()
    }
  }, [])

  return null
}

