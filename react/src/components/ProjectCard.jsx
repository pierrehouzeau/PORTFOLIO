import { motion } from 'framer-motion'
import React, { useRef } from 'react'

export default function ProjectCard({ project, onOpen }){
  const ref = useRef(null)

  function onMove(e){
    const el = ref.current
    if(!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--rx', `${-y * 6}deg`)
    el.style.setProperty('--ry', `${x * 8}deg`)
  }
  function onLeave(){ const el=ref.current; if(el){ el.style.setProperty('--rx','0deg'); el.style.setProperty('--ry','0deg') } }

  return (
    <motion.article
      ref={ref}
      className="card project"
      style={{ transform: 'perspective(900px) rotateX(var(--rx,0)) rotateY(var(--ry,0))' }}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: .45, ease: 'easeOut' }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className="thumb">
        {project.cover ? <img src={project.cover} alt={project.title} loading="lazy"/> : null}
      </div>
      <div className="content">
        <h3>{project.title}</h3>
        <div className="muted">{project.year} • {(project.tech||[]).join(', ')}</div>
        <p>{project.summary}</p>
        {project.tags?.length ? (
          <div className="tags">{project.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
        ) : null}
        <div className="cta">
          <button className="btn" onClick={()=>onOpen(project)}>Détails</button>
          {project.links?.demo && <a className="btn primary" href={project.links.demo} target="_blank" rel="noreferrer noopener">Demo</a>}
          {project.links?.github && <a className="btn" href={project.links.github} target="_blank" rel="noreferrer noopener">GitHub</a>}
        </div>
      </div>
    </motion.article>
  )
}

