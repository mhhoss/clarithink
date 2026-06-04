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

  useEffect(() => {
    localStorage.setItem('thoughts', JSON.stringify(thoughts))
  }, [thoughts])

  function handleSave() {
    if (thought.trim() === '') return
    setThoughts([...thoughts, {
      text: thought,
      time: new Date().toLocaleTimeString(),
      expansion: null
    }])
    setThought('')
  }

  function handleDelete(index) {
    const deleted = thoughts.filter((_, i) => i !== index)
    setThoughts(deleted)
  }

  async function handleClarify(index) {
    const updated = [...thoughts]
    updated[index].expansion = 'Thinking...'
    setThoughts([...updated])

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'google/gemma-4-31b-it:free',
        messages: [
          {
            role: 'user',
            content: `You are a thinking clarity tool. Your only job is to surface the hidden assumption behind the user's thought — not rewrite it, not explain it, not judge it.

            If the thought is philosophical, creative, or emotional — respect it as is. Only ask one sharp question that reveals what the user is taking for granted.

            If the thought is practical or analytical — identify the core assumption and challenge it with one precise question.

            Be brief. One short paragraph maximum. Then the question. Respond in the same language.

            End with one word on a new line: "clear", "unclear", "assumption", "belief" or "question".

            User thought: "${thoughts[index].text}"`
          }
        ]
      })
    })

    let data
    try {
      data = await response.json()
    } catch (err) {
      console.error('Failed to parse JSON:', err)
      data = null
    }
    const content = data?.choices?.[0]?.message?.content || "No response from model"
    const lines = content.trim().split('\n')
    const lastLine = lines[lines.length - 1].trim().toLowerCase()
    const validTags = ['clear', 'unclear', 'assumption', 'belief', 'question']
    const tag = validTags.includes(lastLine) ? lastLine : null
    const clarification = tag ? lines.slice(0, -1).join('\n').trim() : content

    updated[index].expansion = clarification
    updated[index].tag = tag

    setThoughts([...updated])
  }

  return (
    <div className='app-container'>
      <h1 className='app-title'>Clarithink</h1>
      <p className='app-subtitle'>Write a thought. See it clearly.</p>

      <ThoughtInput
        thought={thought}
        setThought={setThought}
        handleSave={handleSave}
      />

      <div className='thought-list'>
        {thoughts.length === 0 ? (
          <p className='empty-state'>No thoughts yet. Write your first one.</p>
        ) : (
          thoughts.map((t, index) => (
            <ThoughtCard
              key={index}
              thought={t}
              index={index}
              onDelete={handleDelete}
              onClarify={handleClarify}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default App