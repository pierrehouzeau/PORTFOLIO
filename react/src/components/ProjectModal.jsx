import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'

export default function ProjectModal({ open, project, onClose }){
  return (
    <AnimatePresence>
      {open && project && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-dialog"
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 18, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={onClose} aria-label="Fermer">×</button>
            <div className="modal-header">
              <div className="modal-cover">
                {project.cover ? (
                  <img src={project.cover} alt={project.title} loading="lazy" />
                ) : null}
              </div>
            </div>
            <div className="modal-body">
              <div className="modal-info">
                <h3 className="modal-title">{project.title}</h3>
                <div className="muted">{project.year} • {(project.tech||[]).join(', ')}</div>
                <p>{project.summary}</p>
                {project.tags?.length ? (
                  <div className="tags">
                    {project.tags.map((t) => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                ) : null}
                <div className="cta">
                  {project.links?.demo && (
                    <a className="btn primary" href={project.links.demo} target="_blank" rel="noreferrer noopener">Demo</a>
                  )}
                  {project.links?.github && (
                    <a className="btn" href={project.links.github} target="_blank" rel="noreferrer noopener">GitHub</a>
                  )}
                </div>
              </div>
              <div className="term">
                <div className="term-bar">
                  <span className="win-dot red" />
                  <span className="win-dot yellow" />
                  <span className="win-dot green" />
                  <span className="term-title">Logs</span>
                </div>
                <pre className="term-screen">
                  {project.detail}
                </pre>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

