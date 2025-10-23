import React, { useState } from 'react'
import ProjectCard from './ProjectCard.jsx'
import ProjectModal from './ProjectModal.jsx'
import { projects } from '../data/projects.js'

export default function Projects(){
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState(null)
  function onOpen(p){ setCurrent(p); setOpen(true) }
  function onClose(){ setOpen(false); setTimeout(()=>setCurrent(null), 200) }
  return (
    <section style={{position:'relative', padding:'40px 0'}}>
      <div className="container">
        <div className="section-head">
          <h2>Projets</h2>
          <p className="subtitle">Sélection — 3 projets variés (web, front, ML).</p>
        </div>
        <div className="grid projects-grid">
          {projects.map(p => <ProjectCard key={p.id} project={p} onOpen={onOpen} />)}
        </div>
      </div>
      <ProjectModal open={open} project={current} onClose={onClose} />
    </section>
  )
}

