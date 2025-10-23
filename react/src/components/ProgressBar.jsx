import { motion, useScroll, useSpring } from 'framer-motion'
import React from 'react'

// Implémentation basée sur l'exemple officiel Framer Motion
// Scroll progress: https://www.framer.com/motion/scroll-animations/#scroll-progress
// Adaptée pour une barre verticale (scaleY) au lieu de scaleX.
export default function ProgressBar(){
  const { scrollYProgress } = useScroll()
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <motion.div
      style={{
        position:'fixed', right:14, top:76, bottom:14, width:4, zIndex:1000,
        transformOrigin: '50% 0%',
        scaleY,
        borderRadius: 999,
        background: 'linear-gradient(180deg, rgba(96,165,250,.7), rgba(167,139,250,.7), rgba(52,211,153,.7))',
        opacity: .65
      }}
    />
  )
}
