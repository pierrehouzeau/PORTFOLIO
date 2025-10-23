import React from 'react'
import { createRoot } from 'react-dom/client'
import ProgressBar from './components/ProgressBar.jsx'
import AnimatedCursor from 'react-animated-cursor'
import CursorTrail from './components/CursorTrail.jsx'

const mountId = 'react-progress-root'
let mount = document.getElementById(mountId)
if(!mount){
  mount = document.createElement('div')
  mount.id = mountId
  document.body.appendChild(mount)
}

function FixedBar(){
  const style = { position:'fixed', right:14, top:76, bottom:14, width:4, zIndex:1000 }
  return (
    <>
      <div style={style}>
        <ProgressBar />
      </div>
      <CursorTrail />
      <AnimatedCursor
        innerSize={6}
        outerSize={28}
        color="59,130,246" /* #3b82f6 */
        outerAlpha={0.25}
        innerScale={1}
        outerScale={2}
        hasBlendMode={true}
        trailingSpeed={4}
        clickables={['a','button','.btn','[role="button"]','input','textarea','select','label']}
      />
    </>
  )
}

createRoot(mount).render(<FixedBar />)
