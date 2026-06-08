import { useState, useEffect } from 'react'
import ThoughtCard from './components/ThoughtCard'
import ThoughtInput from './components/ThoughtInput'
import './App.css'

function App() {
  const [thought, setThought] = useState('')
  const [thoughts, setThoughts] = useState(() => {
    const saved = localStorage.getItem('thoughts')
    return saved ? JSON.parse(saved) : []
  })
  const [view, setView] = useState({ mode: 'home', tag: null })

  useEffect(() => {
    localStorage.setItem('thoughts', JSON.stringify(thoughts))
  }, [thoughts])

  const MAX_FLOW = 3
  const visibleThoughts =
    view.mode === 'home'
      ? thoughts.slice(0, MAX_FLOW)
      : thoughts.filter(t => t.tag === view.tag)

  const tags = [
    { key: 'belief', color: '#0097a7' },
    { key: 'assumption', color: '#3949ab' },
    { key: 'fear', color: '#c62828' },
    { key: 'desire', color: '#e65100' },
    { key: 'judgment', color: '#7b1fa2' },
    { key: 'pattern', color: '#2e7d32' },
  ]

  const PROMPT = text => `
  You are Clarithink, a thinking clarity tool.

  Goal: reveal a hidden assumption or produce a subtle cognitive shift.

  STRICT RULES:
  - Do NOT repeat input
  - Do NOT explain
  - Do NOT exceed 2 lines

  OUTPUT:
  Line 1: reframing or assumption
  Line 2: question

  End with one word:
  belief, assumption, fear, desire, judgment, pattern

  Use the same language as the user.

  User thought: "${text}"
  `

  async function callAPI(text, index) {
    let data
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 12000)
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'google/gemma-4-31b-it:free',
          messages: [{ role: 'user', content: PROMPT(text) }]
        }),
        signal: controller.signal
      })
      clearTimeout(timeout)
      data = await response.json()
    } catch {
      data = null
    }

    const content = data?.choices?.[0]?.message?.content || 'Failed. Retry?'
    const lines = content.trim().split('\n')
    const last = lines[lines.length - 1]?.toLowerCase()
    const valid = ['belief','assumption','fear','desire','judgment','pattern']
    const tag = valid.includes(last) ? last : null
    const expansion = tag ? lines.slice(0,-1).join('\n') : content

    setThoughts(prev => {
      const copy = [...prev]
      copy[index] = { ...copy[index], expansion, tag }
      return copy
    })
  }

  async function handleSaveAndClarify() {
    if (!thought.trim()) return
    const newThought = {
      text: thought,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      expansion: 'Thinking...',
      tag: null
    }
    setThoughts(prev => [newThought, ...prev])
    setThought('')
    await callAPI(thought, 0)
  }

  function handleDelete(index) {
    setThoughts(prev => prev.filter((_, i) => i !== index))
  }

  function handleRetry(index) {
    const t = thoughts[index]
    setThoughts(prev => prev.map((th, i) =>
      i === index ? { ...th, expansion: 'Thinking...' } : th
    ))
    callAPI(t.text, index)
  }

  return (
    <div className="app-wrapper">
      <div className="app-container">
        <h1 className="app-title">Clarithink</h1>

        {view.mode === 'home' && (
          <ThoughtInput
            thought={thought}
            setThought={setThought}
            handleSaveAndClarify={handleSaveAndClarify}
          />
        )}

        {view.mode === 'home' && (
          <>
            <div className="latest-flow-title">Latest flow</div>
            <div className="latest-flow-divider" />
          </>
        )}

        <div className="thought-list">
          {visibleThoughts.length === 0 ? (
            <p className="empty-state">No thoughts yet</p>
          ) : (
            visibleThoughts.map((t, i) => (
              <ThoughtCard
                key={i}
                thought={t}
                index={i}
                onRetry={() => handleRetry(i)}
                onDelete={() => handleDelete(i)}
              />
            ))
          )}
        </div>
      </div>

      <div className="tag-bar">
        <button
          className={`tag-pill tag-pill-home ${view.mode === 'home' ? 'active' : ''}`}
          onClick={() => setView({ mode: 'home', tag: null })}
        >
          flow
        </button>

        {tags.map(t => (
          <button
            key={t.key}
            className={`tag-pill ${view.tag === t.key ? 'active' : ''}`}
            style={{ borderColor: t.color }}
            onClick={() =>
              setView(prev =>
                prev.tag === t.key
                  ? { mode: 'home', tag: null }
                  : { mode: 'filter', tag: t.key }
              )
            }
          >
            {t.key}
          </button>
        ))}
      </div>
    </div>
  )
}

export default App