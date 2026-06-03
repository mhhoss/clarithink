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
            content: `You are a thinking clarity assistant. The user writes raw thoughts.

            1) Restate it neutrally. Remove overgeneralizations, emotional distortions, or cognitive biases — reduce certainty if needed.
            2) Ask one short question that challenges a hidden assumption.

            Respond in the same language. Exactly 2 paragraphs. No headers.

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
    updated[index].expansion = content
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