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
            content: `You are Clarithink, a friendly thinking clarity tool.

            Your job is to take the user's thought and reveal a hidden assumption or alternative perspective. Do NOT repeat or paraphrase the user's words.

            Output EXACTLY two lines:
            1. Suggest a plausible alternative or hidden truth about the thought in a natural, conversational tone.
            2. Follow it with a short, friendly question that encourages reflection.

            Keep it short, casual, and in the user's language.

            End with one word on a new line: "clear", "unclear", "assumption", "belief", or "question".

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